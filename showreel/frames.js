// Render every frame (pure function of t) straight into ffmpeg; no PNGs on disk.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
(async () => {
  const [out, fps = 30, dur = 21] = process.argv.slice(2);
  const total = Math.round(Number(fps) * Number(dur));
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await p.goto('http://127.0.0.1:8765/index.html');
  await p.evaluate(() => window.ready);
  for (let f = 0; f < total; f++) {
    await p.evaluate(t => render(t), f / Number(fps));
    const buf = await p.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 90 === 0) console.log('frame', f, '/', total);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await b.close();
  console.log('done', total, 'frames');
})();
