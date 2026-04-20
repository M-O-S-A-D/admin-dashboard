import type { ReactNode } from 'react';

interface StatsCardProps {
  label: string;
  value: string;
  subValue?: string;
  delta?: string;
  deltaPositive?: boolean;
  icon: ReactNode;
  iconBg?: string;
}

export default function StatsCard({
  label,
  value,
  subValue,
  delta,
  deltaPositive,
  icon,
  iconBg = 'bg-[#1a2332]',
}: StatsCardProps) {
  return (
    <div className="bg-[#0d1117] border border-[#1e2530] rounded-xl p-5 flex items-start justify-between">
      <div>
        <p className="text-[#8892a4] text-sm mb-1">{label}</p>
        <p className="text-white text-3xl font-bold leading-none mb-1">{value}</p>
        {delta && (
          <p className={`text-xs font-medium ${deltaPositive ? 'text-green-400' : 'text-red-400'}`}>
            {delta}
          </p>
        )}
        {subValue && <p className="text-[#4a5568] text-xs mt-1">{subValue}</p>}
      </div>
      <div className={`${iconBg} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
    </div>
  );
}
