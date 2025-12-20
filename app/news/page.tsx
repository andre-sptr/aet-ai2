import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';

export default async function NewsPage() {
  const newsList = await prisma.news.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
           <Link href="/" className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition">
             <ArrowLeft size={20} className="text-gray-700" />
           </Link>
           <h1 className="text-3xl font-bold text-gray-900">Berita Terkini</h1>
        </div>

        {newsList.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">Belum ada berita yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsList.map((news) => (
              <Link 
                key={news.id} 
                href={`/news/${news.slug}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col h-full border border-gray-100"
              >
                <div className="h-48 bg-gray-200 w-full relative overflow-hidden">
                  {news.imageUrl ? (
                    <img 
                      src={news.imageUrl} 
                      alt={news.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <span>No Image</span>
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <div className="text-xs text-blue-600 font-semibold mb-2 uppercase tracking-wide">
                    {new Date(news.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {news.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                    {news.summary || news.content.substring(0, 100) + '...'}
                  </p>
                  <span className="text-blue-600 font-medium text-sm flex items-center mt-auto">
                    Baca Selengkapnya →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}