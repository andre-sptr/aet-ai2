import Link from 'next/link';
import { Newspaper, Calendar, Users, ArrowRight, ExternalLink } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const newsCount = await prisma.news.count();
  const eventsCount = await prisma.event.count();
  const teamCount = await prisma.teamMember.count();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
          <p className="text-gray-500 mt-2">Selamat datang kembali! Silahkan pilih menu untuk mengelola konten.</p>
        </div>
        <Link 
          href="/" 
          target="_blank" 
          className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline bg-blue-50 px-4 py-2 rounded-lg transition"
        >
          Lihat Website Publik <ExternalLink size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* KARTU 1: BERITA */}
        <Link href="/admin/news" className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
             <Newspaper size={100} className="text-blue-600" />
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Newspaper size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Berita</h2>
              <p className="text-sm text-gray-500">Artikel & Update</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{newsCount}</p>
              <p className="text-xs text-gray-400">Total Artikel</p>
            </div>
            <span className="flex items-center text-sm font-semibold text-blue-600 group-hover:translate-x-2 transition-transform">
              Kelola <ArrowRight size={16} className="ml-1" />
            </span>
          </div>
        </Link>

        {/* KARTU 2: KEGIATAN */}
        <Link href="/admin/events" className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
             <Calendar size={100} className="text-green-600" />
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors">
              <Calendar size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Kegiatan</h2>
              <p className="text-sm text-gray-500">Jadwal & Agenda</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{eventsCount}</p>
              <p className="text-xs text-gray-400">Total Kegiatan</p>
            </div>
            <span className="flex items-center text-sm font-semibold text-green-600 group-hover:translate-x-2 transition-transform">
              Kelola <ArrowRight size={16} className="ml-1" />
            </span>
          </div>
        </Link>

        {/* KARTU 3: STRUKTUR ORGANISASI */}
        <Link href="/admin/team" className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
             <Users size={100} className="text-purple-600" />
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Users size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Struktur</h2>
              <p className="text-sm text-gray-500">Anggota Organisasi</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{teamCount}</p>
              <p className="text-xs text-gray-400">Total Anggota</p>
            </div>
            <span className="flex items-center text-sm font-semibold text-purple-600 group-hover:translate-x-2 transition-transform">
              Kelola <ArrowRight size={16} className="ml-1" />
            </span>
          </div>
        </Link>
      </div>
      
      {/* Info Tambahan */}
      <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
        <h3 className="font-semibold text-blue-800 mb-2">Tips Pengelola:</h3>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Pastikan menekan tombol <strong>Publish</strong> pada berita agar muncul di halaman depan.</li>
          <li>Jangan lupa menghapus kegiatan yang sudah lama lewat atau tidak relevan.</li>
          <li>Gunakan fitur <strong>Urutan (Order)</strong> pada menu Struktur untuk mengatur siapa yang tampil paling atas.</li>
        </ul>
      </div>
    </div>
  );
}