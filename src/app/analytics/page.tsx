import AppLayout from '@/components/layout/AppLayout';
import DetectionChart from '@/components/analytics/DetectionChart';
import HeatmapGrid from '@/components/analytics/HeatmapGrid';
import { MOCK_ANALYTICS, MOCK_EVENTS } from '@/lib/mock-data';
import { TrendingUp, TrendingDown, Shield, Eye, Zap, Package, User, Car } from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Delivery Vehicles': <Car size={14} className="text-blue-400" />,
  'Unidentified Personnel': <User size={14} className="text-yellow-400" />,
  'Lost Property/Packages': <Package size={14} className="text-orange-400" />,
};

export default function AnalyticsPage() {
  const data = MOCK_ANALYTICS;
  const flagged = MOCK_EVENTS.filter(e => ['CRITICAL', 'ANOMALY'].includes(e.type)).slice(0, 3);
  const maxCategory = Math.max(...data.topCategories.map(c => c.count));

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold mb-1">System Intelligence</h1>
          <p className="text-[#8892a4] text-sm">
            Cross-referencing vision-language model metadata across 12 cameras.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-[#1a2332] hover:bg-[#222d3d] text-[#8892a4] hover:text-white rounded-lg text-sm transition-colors">
            Export Report
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            Schedule Sync
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#8892a4] text-sm">Total Detections</p>
            <span className={`flex items-center gap-0.5 text-xs font-bold ${data.detectionsDelta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {data.detectionsDelta >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {data.detectionsDelta > 0 ? '+' : ''}{data.detectionsDelta}%
            </span>
          </div>
          <p className="text-white text-3xl font-bold">{data.totalDetections.toLocaleString()}</p>
          <p className="text-[#4a5568] text-xs mt-1">vs last 7 days</p>
        </div>

        <div className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#8892a4] text-sm">Security Threats</p>
            <span className={`flex items-center gap-0.5 text-xs font-bold ${data.threatsDelta <= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {data.threatsDelta <= 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
              {data.threatsDelta > 0 ? '+' : ''}{data.threatsDelta}%
            </span>
          </div>
          <p className="text-white text-3xl font-bold">{data.securityThreats}</p>
          <p className="text-[#4a5568] text-xs mt-1">vs last 7 days</p>
        </div>

        <div className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#8892a4] text-sm">Object Confidence</p>
            <span className="text-xs font-bold text-[#4a5568]">0%</span>
          </div>
          <p className="text-white text-3xl font-bold">{data.objectConfidence}%</p>
          <p className="text-[#4a5568] text-xs mt-1">System wide avg.</p>
        </div>

        <div className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#8892a4] text-sm">VLM Inference Speed</p>
            <span className="flex items-center gap-0.5 text-xs font-bold text-green-400">
              <TrendingUp size={12} />
              +8ms
            </span>
          </div>
          <p className="text-white text-3xl font-bold">{data.vlmInferenceMs}ms</p>
          <p className="text-[#4a5568] text-xs mt-1">Per frame processing</p>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* Detection trend */}
        <div className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Detection Trends</h3>
            <select className="bg-[#1a2332] text-[#8892a4] text-xs rounded-lg px-2.5 py-1 border border-[#2d3748] focus:outline-none">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <DetectionChart data={data.detectionTrend} />
        </div>

        {/* Top categories */}
        <div className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Top Detected Categories</h3>
            <button className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {data.topCategories.map(cat => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {CATEGORY_ICONS[cat.name] ?? <Eye size={14} className="text-[#8892a4]" />}
                    <span className="text-[#c9d1d9] text-sm">{cat.name}</span>
                  </div>
                  <span className="text-[#8892a4] text-sm font-mono">{cat.count.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-[#1a2332] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${(cat.count / maxCategory) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-5">
        {/* Heatmap */}
        <div className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-5">
          <h3 className="text-white font-semibold mb-1">Intrusion Activity Heatmap</h3>
          <p className="text-[#4a5568] text-xs mb-4">Peak intrusions noted between 02:00 – 04:00 AM</p>
          <div className="overflow-x-auto">
            <HeatmapGrid data={data.heatmapData} />
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#1e3050]" />
              <span className="text-[#4a5568] text-[10px]">LOW</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-blue-600" />
              <span className="text-[#4a5568] text-[10px]">HIGH</span>
            </div>
          </div>
        </div>

        {/* Recent flagged */}
        <div className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Recent VLM Flagged</h3>
          <div className="space-y-4">
            {flagged.map(event => (
              <div key={event.eventId} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1a2332] flex items-center justify-center flex-shrink-0">
                  {event.type === 'CRITICAL'
                    ? <Shield size={16} className="text-red-400" />
                    : <Package size={16} className="text-yellow-400" />
                  }
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{event.title}</p>
                  <p className="text-[#4a5568] text-xs">{event.cameraName}</p>
                  <button className="text-blue-400 text-xs mt-0.5 hover:text-blue-300 transition-colors">
                    Inference: {event.description.split('.')[0]}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full text-center text-blue-400 hover:text-blue-300 text-xs font-semibold uppercase tracking-wider transition-colors">
            Review All Alerts
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
