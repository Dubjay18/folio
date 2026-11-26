#!/usr/bin/env bash
# Rebuilds the showreel into public/videos/. Needs ffmpeg, python3 + numpy,
# and Playwright with Chromium (e.g. `npm i -g playwright && npx playwright install chromium`).
set -euo pipefail
cd "$(dirname "$0")"
ROOT=$(cd .. && pwd)
WORK=$(mktemp -d)
trap 'kill $SERVER 2>/dev/null || true' EXIT

# Stage the page with the site's real stylesheet and fonts.
cp index.html "$WORK/"
cp "$ROOT/src/app/globals.css" "$WORK/site.css"
for p in @fontsource-variable/hubot-sans @fontsource-variable/mona-sans @fontsource-variable/newsreader @fontsource/monaspace-neon; do
  d="$WORK/fonts/$(basename "$p")"; mkdir -p "$d"; cp -r "$ROOT/node_modules/$p/files" "$ROOT/node_modules/$p/"*.css "$d/"
done

python3 music.py "$WORK/music.wav"
(cd "$WORK" && exec python3 -m http.server 8765 --bind 127.0.0.1 >/dev/null 2>&1) & SERVER=$!
sleep 1
NODE_PATH=$(npm root -g) node frames.js "$WORK/video.mp4" 30 21

OUT="$ROOT/public/videos"
POSTER_T=7.6   # a settled frame of the cards scene
ffmpeg -loglevel error -y -ss $POSTER_T -i "$WORK/video.mp4" -frames:v 1 -q:v 2 "$WORK/poster.jpg"
# Frame 0 is the poster (thumbnail everywhere); duration and sync are unchanged.
ffmpeg -loglevel error -y -loop 1 -i "$WORK/poster.jpg" -i "$WORK/video.mp4" -i "$WORK/music.wav" -filter_complex \
  "[0:v]trim=end_frame=1,setpts=PTS-STARTPTS,format=yuv420p,fps=30[p];[1:v]trim=start_frame=1,setpts=PTS-STARTPTS,format=yuv420p[v];[p][v]concat=n=2:v=1:a=0[out];[2:a]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[a]" \
  -map "[out]" -map "[a]" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -movflags +faststart -t 21 "$OUT/showreel-full.mp4"
LOOP_VF="scale=1280:-2,fade=t=out:st=11.7:d=0.3:color=0x0C0C0B"
ffmpeg -loglevel error -y -ss 4.5 -t 12 -i "$WORK/video.mp4" -an -vf "$LOOP_VF" -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart "$OUT/showreel-loop.mp4"
ffmpeg -loglevel error -y -ss 4.5 -t 12 -i "$WORK/video.mp4" -an -vf "$LOOP_VF" -c:v libvpx-vp9 -b:v 0 -crf 44 -row-mt 1 "$OUT/showreel-loop.webm"
ffmpeg -loglevel error -y -i "$WORK/poster.jpg" -vf scale=1280:-2 -q:v 3 "$OUT/showreel-poster.jpg"
echo "showreel written to $OUT"
