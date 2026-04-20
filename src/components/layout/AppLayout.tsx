import Sidebar from './Sidebar';
import Header from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
  notificationCount?: number;
}

export default function AppLayout({ children, notificationCount }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#060d16] text-white">
      <Sidebar systemStatus={{ vlmActive: true, version: 'v2.4.0 Patch 12' }} />
      <Header notificationCount={notificationCount} />
      <main className="ml-[240px] pt-14 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
