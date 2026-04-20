'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { MOCK_EVENTS } from '@/lib/mock-data';
import { Shield, Search, Filter } from 'lucide-react';
import type { VLMEvent } from '@/types';

const TYPE_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  CRITICAL:     { color: 'text-red-400',    bg: 'bg-red-400/10',    label: 'Critical'      },
  ANOMALY:      { color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Anomaly'       },
  ACCESS:       { color: 'text-green-400',  bg: 'bg-green-400/10',  label: 'Access'        },
  VEHICLE:      { color: 'text-blue-400',   bg: 'bg-blue-400/10',   label: 'Vehicle'       },
  OBJECT_MATCH: { color: 'text-purple-400', bg: 'bg-purple-400/10', label: 'Object Match'  },
  MOTION:       { color: 'text-orange-400', bg: 'bg-orange-400/10', label: 'Motion'        },
  AUDIT:        { color: 'text-cyan-400',   bg: 'bg-cyan-400/10',   label: 'Audit'         },
};

const FILTERS = ['All', 'Critical', 'Anomaly', 'Access', 'Vehicle', 'Motion'];

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)   return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString();
}

export default function EventsPage() {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const events: VLMEvent[] = MOCK_EVENTS;

  const visible = events.filter(e => {
    const matchFilter = filter === 'All' || e.type.toLowerCase().includes(filter.toLowerCase());
    const matchQuery  = !query || e.title.toLowerCase().includes(query.toLowerCase()) || e.description.toLowerCase().includes(query.toLowerCase());
    return matchFilter && matchQuery;
  });

  return (
    <AppLayout notificationCount={events.filter(e => !e.acknowledged).length}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold mb-1">Event Log</h1>
          <p className="text-[#8892a4] text-sm">All VLM-detected security events across all cameras</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-red-400 bg-red-400/10 px-3 py-1.5 rounded-full font-medium">
            {events.filter(e => !e.acknowledged).length} Unacknowledged
          </span>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a5568]" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search events…"
            className="w-full bg-[#0d1117] border border-[#1e2530] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-[#4a5568] focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === f ? 'bg-blue-600 text-white' : 'bg-[#1a2332] text-[#8892a4] hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Event table */}
      <div className="bg-[#0d1117] border border-[#1e2530] rounded-xl overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_2fr_auto_auto] gap-4 px-4 py-2.5 border-b border-[#1e2530] text-[#4a5568] text-xs uppercase tracking-wider font-semibold">
          <span>Type</span>
          <span>Title / Camera</span>
          <span>Description</span>
          <span>Confidence</span>
          <span>Time</span>
        </div>
        <div className="divide-y divide-[#1e2530]">
          {visible.map(event => {
            const style = TYPE_STYLES[event.type] ?? TYPE_STYLES.MOTION;
            return (
              <div
                key={event.eventId}
                className={`grid grid-cols-[auto_1fr_2fr_auto_auto] gap-4 px-4 py-3 items-center hover:bg-[#111827] transition-colors ${
                  !event.acknowledged ? 'border-l-2 border-l-blue-500' : ''
                }`}
              >
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase whitespace-nowrap ${style.color} ${style.bg}`}>
                  {style.label}
                </span>
                <div>
                  <p className="text-white text-sm font-medium">{event.title}</p>
                  <p className="text-[#4a5568] text-xs">{event.cameraName}</p>
                </div>
                <p className="text-[#8892a4] text-sm line-clamp-1">{event.description}</p>
                <span className="text-[#8892a4] text-sm font-mono">
                  {event.confidence ? `${event.confidence}%` : '—'}
                </span>
                <span className="text-[#4a5568] text-xs whitespace-nowrap">{timeAgo(event.timestamp)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
