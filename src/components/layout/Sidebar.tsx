'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Video,
  Archive,
  BarChart2,
  Map,
  Settings,
  Eye,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/',            label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/live-feeds',  label: 'Live Feeds', icon: Video },
  { href: '/archives',    label: 'Archives',   icon: Archive },
  { href: '/analytics',   label: 'Analytics',  icon: BarChart2 },
  { href: '/map',         label: 'Map View',   icon: Map },
  { href: '/settings',    label: 'Settings',   icon: Settings },
];

interface SidebarProps {
  systemStatus?: { vlmActive: boolean; version: string; userName?: string; userRole?: string };
}

export default function Sidebar({ systemStatus }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-[#0d1117] border-r border-[#1e2530] flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#1e2530]">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <Eye size={18} className="text-white" />
        </div>
        <div>
          <span className="text-white font-bold text-base leading-tight">M.O.S.A.D.</span>
          <p className="text-[#4a5568] text-[10px] leading-tight">Surveillance AI</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-[#8892a4] hover:text-white hover:bg-[#1a2332]'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* System status */}
      <div className="px-4 py-4 border-t border-[#1e2530]">
        <p className="text-[#4a5568] text-[10px] uppercase tracking-wider mb-2 font-semibold">
          System Status
        </p>
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${systemStatus?.vlmActive ? 'bg-green-400' : 'bg-gray-500'}`} />
          <span className="text-[#8892a4] text-xs">
            {systemStatus?.vlmActive ? 'VLM Inference Active' : 'VLM Inactive'}
          </span>
        </div>
        <div className="h-1 bg-[#1e2530] rounded-full overflow-hidden">
          <div className="h-full w-3/5 bg-blue-600 rounded-full" />
        </div>
        <p className="text-[#4a5568] text-[10px] mt-2">
          {systemStatus?.version ?? 'v2.4.0 Patch 12'}
        </p>
      </div>

      {/* User */}
      <div className="px-4 py-3 border-t border-[#1e2530] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {(systemStatus?.userName ?? 'Admin User').charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-white text-xs font-medium truncate">
            {systemStatus?.userName ?? 'Admin User'}
          </p>
          <p className="text-[#4a5568] text-[10px] truncate">
            {systemStatus?.userRole ?? 'System Manager'}
          </p>
        </div>
      </div>
    </aside>
  );
}
