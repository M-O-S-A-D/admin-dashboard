import AppLayout from '@/components/layout/AppLayout';
import { Map } from 'lucide-react';

export default function MapPage() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold mb-1">Map View</h1>
          <p className="text-[#8892a4] text-sm">Camera positions and event overlays on facility map</p>
        </div>
      </div>

      <div className="bg-[#0d1117] border border-[#1e2530] rounded-xl flex flex-col items-center justify-center h-[600px] gap-4">
        <Map size={64} className="text-[#1e2530]" />
        <div className="text-center">
          <p className="text-[#4a5568] text-lg font-medium mb-2">Floor Plan Integration</p>
          <p className="text-[#2d3748] text-sm max-w-sm">
            Upload a facility floor plan to overlay camera positions, detection zones, and live event feeds on an interactive map.
          </p>
        </div>
        <button className="mt-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
          Upload Floor Plan
        </button>
      </div>
    </AppLayout>
  );
}
