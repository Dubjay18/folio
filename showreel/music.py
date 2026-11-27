"""Original soundtrack, cut 2: 120 BPM, F major, 24 s, 48 kHz stereo.

Every event is placed on the beat grid counted from sample 0, so cuts in the
video (all on beats) line up with the music.
"""
import sys
import wave

import numpy as np

SR = 48000
BPM = 120
BEAT = 60 / BPM          # 0.5 s
DUR = 24.0
N = int(DUR * SR)
rng = np.random.default_rng(7)


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def lowpass(x, fc, order=2):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X / (1 + (f / fc) ** (2 * order)), len(x))


def highpass(x, fc, order=2):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    r = (f / fc) ** (2 * order)
    return np.fft.irfft(X * r / (1 + r), len(x))


def bandpass(x, lo, hi):
    return highpass(lowpass(x, hi), lo)


def place(buf, sig, t, gain=1.0):
    i = int(round(t * SR))
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def saw(freq, n, detune=0.0):
    t = np.arange(n) / SR
    ph = (freq * (1 + detune) * t + rng.random()) % 1.0
    return 2 * ph - 1


# ---------- arrangement ----------
CHORDS = [  # one per bar (2 s): F C Dm Bb ...
    ([57, 60, 65], 29), ([55, 60, 64], 36), ([57, 62, 65], 26), ([58, 62, 65], 34),
] * 3
GROOVE_START, GROOVE_END = 3.0, 21.0
IMPACT = 21.0

kick_times = [b * BEAT for b in range(0, 6, 2)] + [b * BEAT for b in range(6, 42)] + [IMPACT]
clap_times = [b * BEAT for b in range(6, 42) if b % 2 == 1]
hat_times = [b * BEAT + BEAT / 2 for b in range(6, 42)]
hat16_times = [b * BEAT / 4 for b in range(int(10 / (BEAT / 4)), int(GROOVE_END / (BEAT / 4))) if b % 2 == 1]
cuts = [3.0, 6.5, 10.0, 13.5, 17.0, 21.0]
ticks = [0.25 + 0.5 * i for i in range(4)] + [a + 0.5 for a in (3.0, 6.5, 10.0, 13.5)] \
    + [17.75 + 0.25 * i for i in range(9)]

L = np.zeros(N)
R = np.zeros(N)
send = np.zeros(N)       # reverb bus (mono)
t_all = np.arange(N) / SR

# sidechain envelope from kicks
duck = np.ones(N)
for tk in kick_times:
    i = int(tk * SR)
    seg = np.arange(N - i) / SR
    duck[i:] = np.minimum(duck[i:], 1 - 0.55 * np.exp(-seg / 0.11))

# kick
def kick():
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 46 + 110 * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / 0.26)
    click = lowpass(rng.standard_normal(n) * np.exp(-t / 0.003), 4000) * 0.25
    return np.tanh(1.4 * (body + click))

K = kick()
for tk in kick_times:
    g = 0.55 if tk < GROOVE_START else (1.0 if tk < IMPACT else 1.1)
    place(L, K, tk, 0.72 * g)
    place(R, K, tk, 0.72 * g)

# clap
def clap():
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    env = np.zeros(n)
    for o in (0, 0.009, 0.018):
        env += (t >= o) * np.exp(-np.maximum(t - o, 0) / (0.006 if o < 0.018 else 0.11))
    return bandpass(rng.standard_normal(n), 900, 3200) * env

C = clap()
for tc in clap_times:
    place(L, C, tc, 0.32)
    place(R, C, tc, 0.32)
    place(send, C, tc, 0.22)

# hats
def hat(decay):
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    return highpass(rng.standard_normal(n), 7500, 3) * np.exp(-t / decay)

H = hat(0.03)
H16 = hat(0.015)
for th in hat_times:
    place(L, H, th, 0.13)
    place(R, H, th, 0.10)
for i, th in enumerate(hat16_times):
    place(L if i % 2 else R, H16, th, 0.05)

# bass: eighth notes on chord roots, sidechained
bass = np.zeros(N)
for bar, (_, root) in enumerate(CHORDS):
    for e in range(4 * 2):
        t0 = bar * 2 + e * BEAT / 2
        if not (GROOVE_START <= t0 < GROOVE_END):
            continue
        n = int(0.23 * SR)
        t = np.arange(n) / SR
        f = mtof(root + 12)
        sig = 0.7 * np.sin(2 * np.pi * f * t) + 0.3 * saw(f, n)
        env = np.minimum(1, t / 0.004) * (0.55 + 0.45 * np.exp(-t / 0.06)) * np.minimum(1, (0.23 - t) / 0.02)
        place(bass, sig * env, t0, 0.42 if e % 2 else 0.30)
bass = lowpass(bass, 320) * duck
L += bass
R += bass

# pad: detuned saws, dark -> bright opening in the intro
padL = np.zeros(N)
padR = np.zeros(N)
for bar, (notes, _) in enumerate(CHORDS):
    t0 = bar * 2.0
    if t0 >= IMPACT:
        break
    length = min(2.0, IMPACT - t0) + 0.05
    n = int(length * SR)
    t = np.arange(n) / SR
    env = np.minimum(1, t / 0.08) * np.minimum(1, (length - t) / 0.05)
    for m in notes:
        f = mtof(m)
        place(padL, (saw(f, n, -0.004) + 0.5 * saw(f * 2, n, 0.003)) * env, t0, 0.068)
        place(padR, (saw(f, n, 0.004) + 0.5 * saw(f * 2, n, -0.003)) * env, t0, 0.068)
open_env = np.clip(t_all / GROOVE_START, 0, 1) ** 2
pad_mix_L = lowpass(padL, 500) * (1 - open_env) + lowpass(padL, 2600) * open_env
pad_mix_R = lowpass(padR, 500) * (1 - open_env) + lowpass(padR, 2600) * open_env
pad_duck = np.where(t_all < GROOVE_START, 1.0, duck)
L += pad_mix_L * pad_duck
R += pad_mix_R * pad_duck
send += (pad_mix_L + pad_mix_R) * 0.25

# pluck arpeggio, 16ths, ping-pong delay
pl = np.zeros(N)
pattern = [0, 2, 1, 2, 0, 2, 1, 2]
for bar, (notes, _) in enumerate(CHORDS):
    for s in range(16):
        t0 = bar * 2 + s * BEAT / 4
        if not (GROOVE_START <= t0 < GROOVE_END):
            continue
        m = notes[pattern[s % 8]] + 12 + (12 if s % 8 == 7 else 0)
        n = int(0.25 * SR)
        t = np.arange(n) / SR
        sig = saw(mtof(m), n) * np.exp(-t / 0.07) * np.minimum(1, t / 0.002)
        place(pl, sig, t0, 0.12 if s % 4 == 0 else 0.08)
pl = lowpass(pl, 2800)
d = int(3 * BEAT / 4 * SR)
plL = pl.copy()
plR = np.zeros(N)
plR[d:] += pl[:-d] * 0.45
plL[2 * d:] += pl[: -2 * d] * 0.22
L += plL
R += plR
send += pl * 0.4


# offbeat chord stabs: sine + soft harmonics, short and bright
ep = np.zeros(N)
for bar, (notes, _) in enumerate(CHORDS):
    for bt in range(4):
        t0 = bar * 2 + bt * BEAT + BEAT / 2
        if not (GROOVE_START <= t0 < GROOVE_END):
            continue
        n = int(0.32 * SR)
        t = np.arange(n) / SR
        env = np.minimum(1, t / 0.003) * np.exp(-t / 0.11)
        sig = sum(np.sin(2 * np.pi * mtof(m + 12) * t) + 0.35 * np.sin(4 * np.pi * mtof(m + 12) * t) for m in notes)
        place(ep, sig * env, t0, 0.07)
ep = lowpass(ep, 4200) * duck
L += ep * 0.9
R += ep * 1.1
send += ep * 0.35

# risers into the drop (4 s) and the company slam (14 s)
for end, length, g in ((3.0, 1.5, 0.14), (17.0, 2.0, 0.12), (21.0, 1.5, 0.10)):
    n = int(length * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    ramp = (t / length) ** 2
    sig = lowpass(noise, 1200) * (1 - ramp) + highpass(noise, 3000) * ramp
    place(L, sig * ramp, end - length, g)
    place(R, sig * ramp, end - length, g)
    place(send, sig * ramp, end - length, g * 0.5)

# whooshes on cuts: soft, low-passed, under the music
for tc in cuts:
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    env = np.exp(-((t - 0.3) / 0.09) ** 2)
    sig = lowpass(rng.standard_normal(n), 1800) * env
    place(L, sig, tc - 0.3, 0.10)
    place(R, sig, tc - 0.3, 0.10)

# in-key ticks on lands (A5 / E6), quiet, mostly in the reverb
for i, tk in enumerate(ticks):
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    f = mtof(81 if i % 2 == 0 else 88)
    sig = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.035) * np.minimum(1, t / 0.001)
    place(L if i % 2 else R, sig, tk, 0.05)
    place(send, sig, tk, 0.05)

# impact at 17 s: sub boom + Am stab ringing out
n = int(4.0 * SR)
t = np.arange(n) / SR
boom = np.sin(2 * np.pi * (44 + 25 * np.exp(-t / 0.05)) * t) * np.exp(-t / 0.9)
stab = sum(saw(mtof(m), n, dt) for m in (41, 53, 57, 60, 65) for dt in (-0.003, 0.003))
stab = lowpass(stab * np.exp(-t / 1.4) * np.minimum(1, t / 0.005), 2200)
place(L, boom, IMPACT, 0.55)
place(R, boom, IMPACT, 0.55)
place(L, stab, IMPACT, 0.045)
place(R, stab, IMPACT, 0.045)
place(send, stab, IMPACT, 0.06)
# a soft hat pulse keeps time through the outro
for b in range(42, 47):
    place(L, H, b * BEAT + BEAT / 2, 0.05)
    place(R, H, b * BEAT + BEAT / 2, 0.05)

# reverb: FFT convolution with a decaying noise tail
ir_n = int(1.2 * SR)
ti = np.arange(ir_n) / SR
irL = rng.standard_normal(ir_n) * np.exp(-ti / 0.35)
irR = rng.standard_normal(ir_n) * np.exp(-ti / 0.35)
irL, irR = lowpass(irL, 5000), lowpass(irR, 5000)
size = 1 << int(np.ceil(np.log2(N + ir_n)))
S = np.fft.rfft(send, size)
revL = np.fft.irfft(S * np.fft.rfft(irL, size), size)[:N]
revR = np.fft.irfft(S * np.fft.rfft(irR, size), size)[:N]
rv = 0.18 / max(1e-9, np.max(np.abs(revL)))
L += revL * rv
R += revR * rv

# master: gentle glue, fade the tail, normalise to -1 dBFS
fade = np.clip((DUR - t_all) / 1.6, 0, 1) ** 1.5
fade_in = np.clip(t_all / 0.01, 0, 1)
L = np.tanh(1.2 * L) * fade * fade_in
R = np.tanh(1.2 * R) * fade * fade_in
peak = max(np.max(np.abs(L)), np.max(np.abs(R)))
g = 10 ** (-1 / 20) / peak
out = np.stack([L * g, R * g], axis=1)
pcm = (np.clip(out, -1, 1) * 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", sys.argv[1], f"{N / SR:.2f}s")
