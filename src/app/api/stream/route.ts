/**
 * RTSP → MJPEG proxy
 *
 * This API route proxies an RTSP stream from the Raspberry Pi to the browser
 * as a multipart/x-mixed-replace MJPEG stream, which any <img> tag can display.
 *
 * Prerequisites on the server running this Next.js app:
 *   1. Install FFmpeg:
 *        Ubuntu/Debian: sudo apt-get install ffmpeg
 *        macOS:         brew install ffmpeg
 *        Windows:       https://ffmpeg.org/download.html
 *   2. Both this machine and the Raspberry Pi must be on the same local network.
 *   3. Confirm the RTSP URL is reachable: ffplay rtsp://<pi-ip>:554/stream
 *
 * Usage (from any component):
 *   <img src={`/api/stream?url=${encodeURIComponent('rtsp://192.168.1.101:554/stream')}`} />
 */

import { NextRequest } from 'next/server';
import { spawn } from 'child_process';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const rtspUrl = req.nextUrl.searchParams.get('url');

  if (!rtspUrl) {
    return new Response('Missing ?url= parameter', { status: 400 });
  }

  // Basic URL validation — only allow rtsp:// or rtsps:// schemes
  if (!/^rtsps?:\/\//.test(rtspUrl)) {
    return new Response('Only rtsp:// and rtsps:// URLs are allowed', { status: 400 });
  }

  const boundary = 'mosad_frame_boundary';

  const stream = new ReadableStream({
    start(controller) {
      /**
       * FFmpeg command breakdown:
       *  -rtsp_transport tcp   → use TCP for RTSP (more reliable than UDP on local networks)
       *  -i <url>              → input RTSP stream
       *  -f image2pipe         → pipe frames as raw images
       *  -vcodec mjpeg         → encode each frame as JPEG
       *  -q:v 5                → JPEG quality (2=best, 31=worst; 5 is a good balance)
       *  -r 15                 → cap output to 15 fps to reduce CPU load
       *  -vf scale=1280:-1     → resize to 1280px wide, keep aspect ratio
       *  pipe:1                → write to stdout
       */
      const ffmpeg = spawn('ffmpeg', [
        '-rtsp_transport', 'tcp',
        '-i', rtspUrl,
        '-f', 'image2pipe',
        '-vcodec', 'mjpeg',
        '-q:v', '5',
        '-r', '15',
        '-vf', 'scale=1280:-1',
        'pipe:1',
      ], { stdio: ['ignore', 'pipe', 'ignore'] });

      ffmpeg.stdout.on('data', (chunk: Buffer) => {
        try {
          const header = `--${boundary}\r\nContent-Type: image/jpeg\r\nContent-Length: ${chunk.length}\r\n\r\n`;
          controller.enqueue(Buffer.from(header));
          controller.enqueue(chunk);
          controller.enqueue(Buffer.from('\r\n'));
        } catch {
          // Client disconnected
        }
      });

      ffmpeg.on('close', () => {
        try { controller.close(); } catch { /* already closed */ }
      });

      ffmpeg.on('error', () => {
        try { controller.close(); } catch { /* already closed */ }
      });

      // Clean up ffmpeg process when the client disconnects
      req.signal.addEventListener('abort', () => {
        ffmpeg.kill('SIGKILL');
        try { controller.close(); } catch { /* already closed */ }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': `multipart/x-mixed-replace; boundary=${boundary}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',   // disable Nginx buffering if behind a proxy
    },
  });
}
