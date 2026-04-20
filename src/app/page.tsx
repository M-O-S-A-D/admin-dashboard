import AppLayout from '@/components/layout/AppLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import CameraFeed from '@/components/dashboard/CameraFeed';
import EventsSidebar from '@/components/dashboard/EventsSidebar';
import { MOCK_CAMERAS, MOCK_EVENTS, MOCK_SYSTEM_STATUS } from '@/lib/mock-data';
import { Activity, HardDrive, Wifi } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const status = MOCK_SYSTEM_STATUS;
  const events = MOCK_EVENTS;
  const cameras = MOCK_CAMERAS;
  const newEvents = events.filter(e => !e.acknowledged).length;

  return (
    <AppLayout notificationCount={newEvents}>
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatsCard
          label="Active Cameras"
          value={`${status.activeCameras} / ${status.totalCameras}`}
          delta="+2% from yesterday"
          deltaPositive
          icon={<Wifi size={20} className="text-blue-400" />}
          iconBg="bg-blue-500/10"
        />
        <StatsCard
          label="System Health"
          value={`${status.systemHealth}%`}
          subValue={`Latency: ${status.latencyMs}ms`}
          icon={<Activity size={20} className="text-green-400" />}
          iconBg="bg-green-500/10"
        />
        <StatsCard
          label="Storage Status"
          value={`${status.storageUsedTB} TB`}
          delta={`${status.storageCapacityPct}% Capacity`}
          deltaPositive={status.storageCapacityPct < 90}
          icon={<HardDrive size={20} className="text-yellow-400" />}
          iconBg="bg-yellow-500/10"
        />
      </div>

      {/* Main content */}
      <div className="flex gap-5">
        {/* Camera grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">Main Surveillance Grid</h2>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-xs text-[#8892a4] hover:text-white bg-[#1a2332] rounded-lg transition-colors">
                2×2
              </button>
              <button className="px-3 py-1.5 text-xs text-white bg-blue-600 rounded-lg">
                3×3
              </button>
              <button className="px-3 py-1.5 text-xs text-[#8892a4] hover:text-white bg-[#1a2332] rounded-lg transition-colors">
                Fullscreen
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {cameras.map(camera => (
              <CameraFeed key={camera.cameraId} camera={camera} />
            ))}
          </div>
        </div>

        {/* Events sidebar */}
        <EventsSidebar events={events} newCount={newEvents} />
      </div>
    </AppLayout>
  );
}
