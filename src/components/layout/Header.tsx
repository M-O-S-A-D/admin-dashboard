'use client';

import { useState } from 'react';
import { Bell, Settings, Search } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  notificationCount?: number;
}

export default function Header({ notificationCount = 0 }: HeaderProps) {
  const [query, setQuery] = useState('');

  return (
    <header className="fixed top-0 left-[240px] right-0 h-14 bg-[#0d1117] border-b border-[#1e2530] flex items-center px-5 gap-4 z-30">
      {/* Search */}
      <div className="flex-1 max-w-xl relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a5568]" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search: 'Red car in parking lot' or 'Person with bag'…"
          className="w-full bg-[#111827] border border-[#1e2530] rounded-lg pl-9 pr-4 py-2 text-sm text-[#8892a4] placeholder:text-[#4a5568] focus:outline-none focus:border-blue-500 focus:text-white transition-colors"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#4a5568] bg-[#1e2530] px-1.5 py-0.5 rounded">
          VLM AI
        </span>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Notifications */}
        <Link href="/events" className="relative p-2 rounded-lg hover:bg-[#1a2332] transition-colors">
          <Bell size={18} className="text-[#8892a4]" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </Link>

        {/* Settings */}
        <Link href="/settings" className="p-2 rounded-lg hover:bg-[#1a2332] transition-colors">
          <Settings size={18} className="text-[#8892a4]" />
        </Link>

        {/* User */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#1e2530]">
          <div className="text-right hidden sm:block">
            <p className="text-white text-xs font-medium">Admin User</p>
            <p className="text-[#4a5568] text-[10px]">System Manager</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
