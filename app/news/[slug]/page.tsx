import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsDetailPage(props: PageProps) {
  const params = await props.params;
  const { slug } = params;

  const news = await prisma.news.findUnique({
    where: { slug },
  });

  if (!news) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        
        {news.imageUrl && (
          <div className="w-full h-64 sm:h-96 relative">
            <img 
              src={news.imageUrl} 
              alt={news.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 sm:p-10">
          <Link href="/news" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Kembali ke Daftar Berita
          </Link>

          <header className="mb-8 border-b pb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {news.title}
            </h1>
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar size={16} className="mr-2" />
              <time>
                {new Date(news.createdAt).toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </time>
            </div>
          </header>

          <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed">
             <ReactMarkdown>{news.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </article>
  );
}