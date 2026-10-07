# -*- coding: utf-8 -*-
"""효과음을 코드로 합성한다 (외부 음원·라이선스 없음). 44.1kHz 스테레오 16bit.

  python render/_lib/sfx.py      → render/_lib/sfx/impact.wav, whoosh.wav
"""
import wave
from pathlib import Path
import numpy as np

SR = 44100
OUT = Path(__file__).resolve().parent / "sfx"
rng = np.random.default_rng(7)


def band(x, lo, hi):
    """FFT 대역 통과 (부드러운 경계)."""
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    g = 1 / (1 + ((lo / np.maximum(f, 1)) ** 4)) * 1 / (1 + ((f / hi) ** 4))
    return np.fft.irfft(X * g, len(x))


def reverb(x, sec=1.4, mix=0.22):
    n = int(sec * SR); t = np.arange(n) / SR
    ir = rng.standard_normal(n) * np.exp(-t * 4.2); ir = band(ir, 200, 7000); ir /= np.abs(ir).sum() ** 0.5 * 40
    wet = np.convolve(x, ir)[: len(x) + n]
    wet = np.concatenate([wet, np.zeros(len(x) + n - len(wet))])
    dry = np.concatenate([x, np.zeros(n)])
    return dry + mix * wet / (np.abs(wet).max() + 1e-9) * np.abs(x).max()


def save(name, mono, gain_db=-4.0, width=0.0):
    mono = mono / (np.abs(mono).max() + 1e-9) * 10 ** (gain_db / 20)
    # 약간의 좌우 폭: 한쪽을 몇 ms 지연
    d = int(width * SR)
    L = mono; R = np.concatenate([np.zeros(d), mono[: len(mono) - d]]) if d else mono
    st = (np.stack([L, R], 1) * 32767).astype(np.int16)
    OUT.mkdir(exist_ok=True)
    with wave.open(str(OUT / name), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())
    print("saved", OUT / name, f"{len(mono)/SR:.2f}s")


def whoosh(dur=0.55):
    n = int(dur * SR); t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    # 중심 주파수가 올라가는 스윕: 짧은 블록마다 대역 통과
    out = np.zeros(n); B = 1024
    for i in range(0, n, B // 2):
        seg = noise[i:i + B]
        if len(seg) < 64: break
        c = 300 * (12 ** (i / n))
        win = np.hanning(len(seg))
        out[i:i + len(seg)] += band(seg, c * 0.6, c * 1.8) * win
    env = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.6
    return out * env


def impact(total=4.2, at=0.42):
    n = int(total * SR); t = np.arange(n) / SR; x = np.zeros(n)
    # 앞의 짧은 휙 (0 → at)
    w = whoosh(at + 0.05); x[: len(w)] += 0.55 * w / (np.abs(w).max() + 1e-9)
    k = int(at * SR); tt = t[k:] - at
    # 서브 붐: 95Hz → 38Hz 하강
    f = 38 + 57 * np.exp(-tt * 9)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x[k:] += 1.0 * np.sin(ph) * np.exp(-tt * 3.2)
    # 타격 순간의 딱 소리 (짧은 고역 노이즈)
    cl = band(rng.standard_normal(len(tt)), 1500, 9000) * np.exp(-tt * 70)
    x[k:] += 0.9 * cl / (np.abs(cl).max() + 1e-9)
    # 몸통 (중역 노이즈 펀치)
    body = band(rng.standard_normal(len(tt)), 120, 900) * np.exp(-tt * 16)
    x[k:] += 0.6 * body / (np.abs(body).max() + 1e-9)
    # 밝은 여운 (화음, 긍정적인 마무리 느낌)
    for fr, a in [(523.25, 0.10), (783.99, 0.08), (1046.5, 0.06)]:
        x[k:] += a * np.sin(2 * np.pi * fr * tt) * np.exp(-tt * 1.6) * (1 - np.exp(-tt * 60))
    y = reverb(x, 1.6, 0.28)[:n]
    y *= np.clip((total - t) / 0.6, 0, 1)   # 끝 페이드
    return y


if __name__ == "__main__":
    save("impact.wav", impact(), -3.0, 0.004)
    save("whoosh.wav", whoosh(0.6), -12.0, 0.003)
