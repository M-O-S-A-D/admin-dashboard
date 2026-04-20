'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import CameraFeed from '@/components/dashboard/CameraFeed';
import { MOCK_CAMERAS, MOCK_EVENTS } from '@/lib/mock-data';
import { LayoutGrid, Plus, AlertTriangle } from 'lucide-react';
import type { Camera } from '@/types';

const LOCATIONS = ['All Locations', 'Entrance', 'Warehouse', 'Retail Floor', 'Loading Dock', 'Server Room', 'Parking'];

export default function LiveFeedsPage() {
  const [activeLocation, setActiveLocation] = useState('All Locations');
  const [showAlerts, setShowAlerts] = useState(false);
  const cameras: Camera[] = MOCK_CAMERAS;
  const activeAlertIds = new Set(MOCK_EVENTS.filter(e => !e.acknowledged).map(e => e.cameraId));

  const filtered = cameras.filter(cam => {
    if (showAlerts) return activeAlertIds.has(cam.cameraId);
    if (activeLocation === 'All Locations') return true;
    return cam.location === activeLocation;
  });

  const locationCounts = LOCATIONS.reduce<Record<string, number>>((acc, loc) => {
    if (loc === 'All Locations') return acc;
    acc[loc] = cameras.filter(c => c.location === loc).length;
    return acc;
  }, {});

  const offline = cameras.filter(c => c.status === 'OFFLINE').length;
  const alertCount = activeAlertIds.size;

  return (
    <AppLayout notificationCount={alertCount}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-white text-2xl font-bold mb-1">Live Feeds</h1>
          <p className="text-[#8892a4] text-sm">
            Real-time analysis from {cameras.length} connected vision modules
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2332] hover:bg-[#222d3d] text-[#8892a4] hover:text-white rounded-lg text-sm transition-colors">
            <LayoutGrid size={15} />
            Layout
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            <Plus size={15} />
            Add Feed
          </button>
        </div>
      </div>

      {/* Location filter */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {LOCATIONS.map(loc => {
          const count = loc === 'All Locations' ? cameras.length : locationCounts[loc] ?? 0;
          if (loc !== 'All Locations' && count === 0) return null;
          const active = activeLocation === loc && !showAlerts;
          return (
            <button
              key={loc}
              onClick={() => { setActiveLocation(loc); setShowAlerts(false); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#1a2332] text-[#8892a4] hover:text-white'
              }`}
            >
              {loc === 'All Locations' ? loc : `${loc} (${count})`}
            </button>
          );
        })}
        <button
          onClick={() => { setShowAlerts(v => !v); }}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
            showAlerts
              ? 'bg-red-600 text-white'
              : 'bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white'
          }`}
        >
          <AlertTriangle size={13} />
          Active Alerts{alertCount > 0 && ` (${alertCount})`}
        </button>
      </div>

      {/* Feed grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-[#4a5568]">
          <LayoutGrid size={40} className="mb-3 opacity-30" />
          <p>No cameras match the current filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(camera => (
            <CameraFeed key={camera.cameraId} camera={camera} showVlmOverlay />
          ))}
        </div>
      )}

      {/* Status bar */}
      <div className="fixed bottom-0 left-[240px] right-0 bg-[#0d1117] border-t border-[#1e2530] px-6 py-2.5 flex items-center justify-between z-20">
        <div className="flex items-center gap-5 text-xs">
          <span className="flex items-center gap-1.5 text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            {cameras.filter(c => c.status !== 'OFFLINE').length} Cameras Active
          </span>
          <span className="flex items-center gap-1.5 text-[#8892a4]">
            <span className="w-2 h-2 rounded-full bg-gray-500" />
            {offline} Offline
          </span>
          {alertCount > 0 && (
            <span className="flex items-center gap-1.5 text-yellow-400">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              {alertCount} Alert{alertCount !== 1 ? 's' : ''} Logged
            </span>
          )}
        </div>
        <div className="text-xs text-[#4a5568]">
          System latency: 42ms &nbsp;|&nbsp; Storage: 64% full
        </div>
      </div>
    </AppLayout>
  );
}
