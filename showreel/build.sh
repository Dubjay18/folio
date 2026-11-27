#!/usr/bin/env bash
# Rebuilds the showreel into public/videos/. Needs ffmpeg, python3 + numpy, npm,
# and Playwright with Chromium (e.g. `npm i -g playwright && npx playwright install chromium`).
# Product screens live in showreel/img (captured from the live sites and app repos).
set -euo pipefail
cd "$(dirname "$0")"
ROOT=$(cd .. && pwd)
WORK=$(mktemp -d)
trap 'kill ${SERVER:-0} 2>/dev/null || true' EXIT

cp index.html "$WORK/" && cp -r img "$WORK/img"
(cd "$WORK" && npm init -y >/dev/null && npm i --silent --no-audit --no-fund @fontsource-variable/inter@5 @fontsource/instrument-serif@5)
mkdir -p "$WORK/fonts"
cp -r "$WORK/node_modules/@fontsource-variable/inter" "$WORK/fonts/inter"
cp -r "$WORK/node_modules/@fontsource/instrument-serif" "$WORK/fonts/instrument-serif"

python3 music.py "$WORK/music.wav"
(cd "$WORK" && exec python3 -m http.server 8765 --bind 127.0.0.1 >/dev/null 2>&1) & SERVER=$!
sleep 1
NODE_PATH=$(npm root -g) node frames.js "$WORK/video.mp4" 30 24

OUT="$ROOT/public/videos"
ffmpeg -loglevel error -y -ss 2.8 -i "$WORK/video.mp4" -frames:v 1 -q:v 2 "$WORK/poster.jpg"
# Frame 0 is the poster (thumbnail everywhere); duration and sync are unchanged.
ffmpeg -loglevel error -y -loop 1 -i "$WORK/poster.jpg" -i "$WORK/video.mp4" -i "$WORK/music.wav" -filter_complex \
  "[0:v]trim=end_frame=1,setpts=PTS-STARTPTS,format=yuv420p,fps=30[p];[1:v]trim=start_frame=1,setpts=PTS-STARTPTS,format=yuv420p[v];[p][v]concat=n=2:v=1:a=0[out];[2:a]loudnorm=I=-14:TP=-2:LRA=11,alimiter=limit=0.8:level=false,aresample=48000[a]" \
  -map "[out]" -map "[a]" -c:v libx264 -preset slow -crf 21 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -movflags +faststart -t 24 "$OUT/showreel-full.mp4"
# Hero loop: the four company scenes, muted.
LOOP_VF="scale=1280:-2,fade=t=in:st=0:d=0.2:color=0xF4F2ED,fade=t=out:st=11.75:d=0.25:color=0xF4F2ED"
ffmpeg -loglevel error -y -ss 3.6 -t 12 -i "$WORK/video.mp4" -an -vf "$LOOP_VF" -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart "$OUT/showreel-loop.mp4"
ffmpeg -loglevel error -y -ss 3.6 -t 12 -i "$WORK/video.mp4" -an -vf "$LOOP_VF" -c:v libvpx-vp9 -b:v 0 -crf 46 -row-mt 1 "$OUT/showreel-loop.webm"
ffmpeg -loglevel error -y -ss 5.9 -i "$WORK/video.mp4" -frames:v 1 -vf scale=1280:-2 -q:v 3 "$OUT/showreel-poster.jpg"
echo "showreel written to $OUT"
