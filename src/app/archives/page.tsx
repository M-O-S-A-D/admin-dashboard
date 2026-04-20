'use client';

import { useState, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { MOCK_ARCHIVE_CLIPS } from '@/lib/mock-data';
import {
  Search, Clock, HardDrive, CloudUpload, Settings2,
  Filter, ChevronLeft, ChevronRight,
} from 'lucide-react';
import type { ArchiveClip } from '@/types';

const TAGS = ['Vehicles', 'Staff', 'Deliveries', 'After Hours', 'Perimeter Alert'];

const TYPE_COLORS: Record<string, string> = {
  EVENT:  'bg-red-600',
  MOTION: 'bg-yellow-500',
  AUDIT:  'bg-blue-600',
};

function formatDuration(secs: number): string {
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m ${secs % 60}s`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ArchivesPage() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'AI Detections' | 'All Footage' | 'Flagged'>('AI Detections');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

  const clips: ArchiveClip[] = MOCK_ARCHIVE_CLIPS;
  const filtered = clips.filter(c => {
    const matchesQuery = !query || c.vlmDescription?.toLowerCase().includes(query.toLowerCase());
    const matchesTags = activeTags.size === 0 || c.tags?.some(t => activeTags.has(t));
    return matchesQuery && matchesTags;
  });

  const toggleTag = useCallback((tag: string) => {
    setActiveTags(prev => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }, []);

  const prevMonth = () => setSelectedDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setSelectedDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const monthLabel = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
  const today = new Date();
  const todayNum = today.getDate();
  const isCurrentMonth = today.getMonth() === selectedDate.getMonth() && today.getFullYear() === selectedDate.getFullYear();

  return (
    <AppLayout>
      <div className="flex gap-5">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-white text-2xl font-bold">Footage Archives</h1>
            <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Storage: 84% Free
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a5568]" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search VLM events (e.g., 'red truck', 'unauthorized entry', 'crowd forming')"
              className="w-full bg-[#0d1117] border border-[#1e2530] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#4a5568] focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 mb-5">
            {(['AI Detections', 'All Footage', 'Flagged'] as const).map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === f ? 'bg-blue-600 text-white' : 'bg-[#1a2332] text-[#8892a4] hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
            <div className="flex items-center gap-1.5 ml-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a2332] hover:bg-[#222d3d] text-[#8892a4] rounded-full text-sm transition-colors">
                <Filter size={13} />
                High Confidence
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a2332] hover:bg-[#222d3d] text-[#8892a4] rounded-full text-sm transition-colors">
                <Settings2 size={13} />
                All Channels
              </button>
            </div>
          </div>

          {/* Results header */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#8892a4] text-sm font-semibold uppercase tracking-wider">
              Results — October 30, 2023
            </p>
            <p className="text-[#4a5568] text-sm">{filtered.length} clips found</p>
          </div>

          {/* Clips grid */}
          <div className="grid grid-cols-3 gap-4">
            {filtered.map(clip => (
              <div
                key={clip.clipId}
                className="bg-[#0d1117] border border-[#1e2530] rounded-xl overflow-hidden hover:border-blue-500/50 transition-colors cursor-pointer group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-[#111827]">
                  {clip.imageUrl ? (
                    <img src={clip.imageUrl} alt={clip.cameraName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1a2332] to-[#111827]" />
                  )}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className={`${TYPE_COLORS[clip.type] ?? 'bg-gray-600'} text-white text-[10px] font-bold px-2 py-0.5 rounded`}>
                      {clip.type}
                    </span>
                    <span className="text-white text-[10px] font-semibold bg-black/60 px-2 py-0.5 rounded">
                      {new Date(clip.timestamp).toTimeString().slice(0, 8)}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-white text-sm font-semibold leading-tight">{clip.cameraName}</p>
                    {clip.matchScore && (
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="text-blue-400 text-sm font-bold">{clip.matchScore}%</p>
                        <p className="text-blue-400/70 text-[9px]">Match</p>
                      </div>
                    )}
                  </div>
                  {clip.vlmDescription && (
                    <p className="text-[#8892a4] text-xs leading-relaxed mb-2 line-clamp-2 italic">
                      &quot;{clip.vlmDescription}&quot;
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-[#4a5568] text-xs">
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {formatDuration(clip.duration)} duration
                    </span>
                    <span className="flex items-center gap-1">
                      <HardDrive size={10} />
                      {clip.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-[#4a5568]">
              <Search size={36} className="mb-3 opacity-30" />
              <p>No clips match your search</p>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="w-[220px] flex-shrink-0 space-y-4">
          {/* Calendar */}
          <div className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white text-sm font-semibold">Select Date</p>
              <div className="flex items-center gap-1">
                <button onClick={prevMonth} className="p-1 hover:bg-[#1a2332] rounded transition-colors">
                  <ChevronLeft size={14} className="text-[#8892a4]" />
                </button>
                <button onClick={nextMonth} className="p-1 hover:bg-[#1a2332] rounded transition-colors">
                  <ChevronRight size={14} className="text-[#8892a4]" />
                </button>
              </div>
            </div>
            <p className="text-[#8892a4] text-xs text-center mb-2">{monthLabel}</p>
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                <div key={d} className="text-[#4a5568] text-[9px] py-1">{d}</div>
              ))}
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const isToday = isCurrentMonth && day === todayNum;
                return (
                  <button
                    key={day}
                    className={`text-[11px] py-1 rounded transition-colors ${
                      isToday
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-[#8892a4] hover:bg-[#1a2332] hover:text-white'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time range */}
          <div className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-4">
            <p className="text-white text-sm font-semibold mb-3">Time Range</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <p className="text-[#4a5568] text-[9px] uppercase mb-1">From</p>
                <p className="text-white text-xs font-mono bg-[#1a2332] rounded px-2 py-1">00:00:00</p>
              </div>
              <div>
                <p className="text-[#4a5568] text-[9px] uppercase mb-1">To</p>
                <p className="text-white text-xs font-mono bg-[#1a2332] rounded px-2 py-1">23:59:59</p>
              </div>
            </div>
            <input type="range" className="w-full accent-blue-600" defaultValue={100} />
          </div>

          {/* Quick tags */}
          <div className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-4">
            <p className="text-white text-sm font-semibold mb-3">Quick Activity Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeTags.has(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#1a2332] text-[#8892a4] hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-archive */}
          <div className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CloudUpload size={16} className="text-blue-400" />
              <p className="text-blue-400 text-sm font-semibold">Auto-Archive Enabled</p>
            </div>
            <p className="text-[#4a5568] text-xs leading-relaxed mb-3">
              Clips older than 30 days are moved to cold storage.
            </p>
            <button className="text-blue-400 hover:text-blue-300 text-xs font-semibold uppercase tracking-wider transition-colors">
              Configure Retention
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
