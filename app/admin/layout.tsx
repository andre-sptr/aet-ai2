import AdminSidebar from './Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 md:ml-64 p-8 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}