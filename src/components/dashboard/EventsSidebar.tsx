'use client';

import { useState } from 'react';
import { Zap, ChevronRight } from 'lucide-react';
import type { VLMEvent } from '@/types';

const TYPE_STYLES: Record<string, { color: string; bg: string }> = {
  CRITICAL:     { color: 'text-red-400',    bg: 'bg-red-400/10'    },
  ANOMALY:      { color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  ACCESS:       { color: 'text-green-400',  bg: 'bg-green-400/10'  },
  VEHICLE:      { color: 'text-blue-400',   bg: 'bg-blue-400/10'   },
  OBJECT_MATCH: { color: 'text-purple-400', bg: 'bg-purple-400/10' },
  MOTION:       { color: 'text-orange-400', bg: 'bg-orange-400/10' },
  AUDIT:        { color: 'text-cyan-400',   bg: 'bg-cyan-400/10'   },
};

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)  return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

interface EventsSidebarProps {
  events: VLMEvent[];
  newCount?: number;
}

export default function EventsSidebar({ events, newCount = 0 }: EventsSidebarProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = events.filter(e => !dismissed.has(e.eventId));

  return (
    <aside className="w-[300px] flex-shrink-0 bg-[#0d1117] border border-[#1e2530] rounded-xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e2530]">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-blue-400" />
          <span className="text-white text-sm font-semibold">VLM Real-time Events</span>
        </div>
        {newCount > 0 && (
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {newCount} NEW
          </span>
        )}
      </div>

      {/* Event list */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#1e2530]">
        {visible.length === 0 && (
          <div className="flex items-center justify-center h-32 text-[#4a5568] text-sm">
            No active events
          </div>
        )}
        {visible.map(event => {
          const style = TYPE_STYLES[event.type] ?? TYPE_STYLES.MOTION;
          return (
            <div key={event.eventId} className="p-4 hover:bg-[#111827] transition-colors">
              <div className="flex items-start justify-between mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${style.color}`}>
                  {event.type.replace('_', ' ')}
                </span>
                <span className="text-[#4a5568] text-[10px]">{timeAgo(event.timestamp)}</span>
              </div>
              <p className="text-white text-sm font-semibold mb-1">{event.title}</p>
              <p className="text-[#8892a4] text-xs leading-relaxed mb-2 line-clamp-2">
                &quot;{event.description}&quot;
              </p>

              {/* Frame image */}
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt="Event frame"
                  className="w-full h-24 object-cover rounded-lg mb-2 bg-[#1a2332]"
                />
              )}
              {!event.imageUrl && event.imageKey && (
                <div className="w-full h-20 bg-[#1a2332] rounded-lg mb-2 flex items-center justify-center">
                  <span className="text-[#4a5568] text-[10px]">Frame loading…</span>
                </div>
              )}

              {/* Actions for critical */}
              {event.type === 'CRITICAL' && !event.acknowledged && (
                <div className="flex gap-2">
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors">
                    DISPATCH
                  </button>
                  <button
                    className="flex-1 bg-[#1a2332] hover:bg-[#222d3d] text-[#8892a4] text-xs font-semibold py-1.5 rounded-lg transition-colors"
                    onClick={() => setDismissed(p => new Set([...p, event.eventId]))}
                  >
                    DISMISS
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#1e2530]">
        <button className="w-full flex items-center justify-center gap-1.5 text-[#8892a4] hover:text-white text-xs font-medium transition-colors">
          VIEW ALL HISTORY
          <ChevronRight size={12} />
        </button>
      </div>
    </aside>
  );
}
