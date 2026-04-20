'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface DataPoint {
  time: string;
  human: number;
  vehicle: number;
}

export default function DetectionChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="time"
          tick={{ fill: '#4a5568', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval={2}
        />
        <YAxis
          tick={{ fill: '#4a5568', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ background: '#0d1117', border: '1px solid #1e2530', borderRadius: '8px', fontSize: '12px' }}
          labelStyle={{ color: '#8892a4' }}
        />
        <Legend
          wrapperStyle={{ fontSize: '11px', color: '#8892a4', paddingTop: '8px' }}
          formatter={(value) => value === 'human' ? 'Human Detection' : 'Vehicle Detection'}
        />
        <Line type="monotone" dataKey="human" stroke="#2563eb" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="vehicle" stroke="#4a5568" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
