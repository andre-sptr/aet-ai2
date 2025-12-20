'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Newspaper, Calendar, Users, Home } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      isActive: pathname === '/admin',
    },
    {
      name: 'Berita',
      href: '/admin/news',
      icon: Newspaper,
      isActive: pathname.startsWith('/admin/news'),
    },
    {
      name: 'Kegiatan',
      href: '/admin/events',
      icon: Calendar,
      isActive: pathname.startsWith('/admin/events'),
    },
    {
      name: 'Struktur',
      href: '/admin/team',
      icon: Users,
      isActive: pathname.startsWith('/admin/team'),
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:block fixed h-full z-10 left-0 top-0">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-blue-600">AET Admin</h1>
      </div>
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 p-3 rounded-lg transition font-medium ${
              item.isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </Link>
        ))}

        <div className="pt-8 mt-8 border-t border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-50 rounded-lg transition"
          >
            <Home size={20} />
            <span>Lihat Website</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
}