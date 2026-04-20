'use client';

import { useState } from 'react';
import { Maximize2, WifiOff } from 'lucide-react';
import type { Camera } from '@/types';

interface CameraFeedProps {
  camera: Camera;
  showVlmOverlay?: boolean;
  onClick?: () => void;
}

const STATUS_COLORS = {
  LIVE:   { dot: 'bg-green-400',  label: 'LIVE',   text: 'text-green-400'  },
  OFFLINE:{ dot: 'bg-gray-500',   label: 'OFFLINE',text: 'text-gray-400'   },
  SECURE: { dot: 'bg-green-400',  label: 'SECURE', text: 'text-green-400'  },
  MOTION: { dot: 'bg-yellow-400', label: 'MOTION', text: 'text-yellow-400' },
};

export default function CameraFeed({ camera, showVlmOverlay = false, onClick }: CameraFeedProps) {
  const [streamError, setStreamError] = useState(false);
  const status = STATUS_COLORS[camera.status];

  // The stream proxy endpoint — Next.js API route that converts RTSP → MJPEG
  const streamSrc = `/api/stream?url=${encodeURIComponent(camera.rtspUrl)}`;

  return (
    <div
      className="relative bg-[#0d1117] rounded-xl overflow-hidden border border-[#1e2530] cursor-pointer group aspect-video"
      onClick={onClick}
    >
      {/* Video stream */}
      {camera.status !== 'OFFLINE' && !streamError ? (
        <img
          src={streamSrc}
          alt={camera.name}
          className="w-full h-full object-cover"
          onError={() => setStreamError(true)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#111827] gap-2">
          <WifiOff size={28} className="text-[#4a5568]" />
          <span className="text-[#4a5568] text-xs">
            {camera.status === 'OFFLINE' ? 'Camera Offline' : 'Stream unavailable'}
          </span>
          <span className="text-[#2d3748] text-[10px]">{camera.rtspUrl}</span>
        </div>
      )}

      {/* Top status bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-2.5 py-1.5 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${status.dot} ${camera.status === 'LIVE' || camera.status === 'MOTION' ? 'animate-pulse' : ''}`} />
          <span className="text-white text-[11px] font-semibold tracking-wide">
            {status.label} • {camera.name.toUpperCase()}
          </span>
          {camera.vlmActive && (
            <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              VLM ACTIVE
            </span>
          )}
        </div>
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
          onClick={e => { e.stopPropagation(); /* TODO: fullscreen */ }}
        >
          <Maximize2 size={12} className="text-white" />
        </button>
      </div>

      {/* VLM description overlay */}
      {showVlmOverlay && camera.lastDescription && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-[8px] text-white font-bold">AI</span>
            </div>
            <span className="text-blue-400 text-[11px] font-semibold">VLM Description</span>
          </div>
          <p className="text-[#c9d1d9] text-[11px] leading-relaxed line-clamp-2">
            <span className="text-blue-400 font-medium">Scene:</span> {camera.lastDescription}
          </p>
        </div>
      )}
    </div>
  );
}
