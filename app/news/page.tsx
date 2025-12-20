import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Calendar, ArrowRight, Newspaper } from 'lucide-react';

export const revalidate = 0;

export default async function NewsPage() {
  const newsList = await prisma.news.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* --- HEADER SECTION --- */}
      <div className="bg-white border-b border-slate-200 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-6 group"
          >
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </Link>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Wawasan & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Berita Terkini</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Ikuti perkembangan terbaru, kegiatan, dan artikel informatif dari kami. 
              Disajikan untuk memberi inspirasi dan informasi bagi Anda.
            </p>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {newsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Newspaper size={40} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Berita</h3>
            <p className="text-slate-500 max-w-md">
              Saat ini kami belum mempublikasikan artikel apa pun. Silakan kembali lagi nanti untuk update terbaru.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsList.map((news) => (
              <Link 
                key={news.id} 
                href={`/news/${news.slug}`}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-56 w-full overflow-hidden bg-slate-200">
                  {news.imageUrl ? (
                    <img 
                      src={news.imageUrl} 
                      alt={news.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                      <Newspaper size={40} className="mb-2 opacity-50" />
                      <span className="text-xs font-medium uppercase tracking-wider">No Image</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="flex flex-col flex-grow p-6">
                  <div className="flex items-center text-xs font-medium text-slate-500 mb-4 space-x-2">
                    <span className="flex items-center bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                      <Calendar size={12} className="mr-1.5" />
                      {new Date(news.createdAt).toLocaleDateString('id-ID', { 
                        day: 'numeric', month: 'short', year: 'numeric' 
                      })}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {news.title}
                  </h2>

                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                    {news.summary || news.content.substring(0, 120) + '...'}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center text-blue-600 font-semibold text-sm group/link">
                    Baca Selengkapnya
                    <ArrowRight size={16} className="ml-2 transform group-hover/link:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}