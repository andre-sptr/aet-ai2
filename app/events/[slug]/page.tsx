import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ShareButton from './ShareButton';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

export default async function EventDetailPage(props: PageProps) {
  const params = await props.params;
  const { slug } = params;

  const event = await prisma.event.findUnique({
    where: { id: slug },
  });

  if (!event) {
    notFound();
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const processedContent = event.description
    ? event.description.replace(/(\r\n|\n|\r)/gm, '\n\n')
    : '';

  return (
    <article className="min-h-screen bg-slate-50 pb-20 font-sans">
      
      {/* --- HERO SECTION --- */}
      <div className="relative w-full h-[500px] bg-slate-900">
        {event.imageUrl ? (
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <span className="text-slate-500 font-medium">No Image Available</span>
          </div>
        )}
        
        <div className="absolute inset-0 flex flex-col justify-end pb-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
          <div className="max-w-4xl mx-auto w-full">
            <Link 
              href="/events" 
              className="inline-flex items-center text-slate-300 hover:text-white mb-6 transition-colors text-sm font-medium bg-white/10 backdrop-blur-md px-4 py-2 rounded-full w-fit"
            >
              <ArrowLeft size={16} className="mr-2" />
              Kembali ke Kegiatan
            </Link>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-slate-300 font-medium">
              <span className="flex items-center bg-blue-900/50 px-3 py-1 rounded-lg backdrop-blur-sm border border-blue-500/30">
                <Calendar size={16} className="mr-2 text-blue-400" />
                {new Date(event.startDate).toLocaleDateString('id-ID', { 
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
                })}
              </span>
              
              <span className="flex items-center bg-slate-800/50 px-3 py-1 rounded-lg backdrop-blur-sm border border-slate-600/30">
                <Clock size={16} className="mr-2 text-orange-400" />
                {formatTime(event.startDate)} {event.endDate && `- ${formatTime(event.endDate)}`} WIB
              </span>

              {event.location && (
                <span className="flex items-center bg-red-900/50 px-3 py-1 rounded-lg backdrop-blur-sm border border-red-500/30">
                  <MapPin size={16} className="mr-2 text-red-400" />
                  {event.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- KONTEN CONTAINER --- */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 -mt-20">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100">
          
          <div className="prose prose-lg prose-slate max-w-none">
            <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                p: ({node, ...props}) => <p className="text-slate-700 text-lg leading-relaxed mb-8" {...props} />,
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-slate-900 mt-12 mb-6" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-slate-800 mt-10 mb-4 border-b pb-2 border-slate-100" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-bold text-blue-700 mt-8 mb-3" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-8 space-y-2 text-slate-700 marker:text-blue-500" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-8 space-y-2 text-slate-700 marker:text-blue-500" {...props} />,
                li: ({node, ...props}) => <li className="pl-1" {...props} />,
                strong: ({node, ...props}) => <strong className="font-extrabold text-slate-900" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 bg-blue-50 py-4 px-6 italic text-slate-700 rounded-r-lg my-8" {...props} />,
                a: ({node, ...props}) => <a className="text-blue-600 font-semibold underline hover:text-blue-800 transition-colors" {...props} />,
                img: ({node, ...props}) => (
                    <img className="rounded-xl shadow-lg w-full my-8" {...props} alt="" />
                ),
                }}
            >
                {processedContent}
            </ReactMarkdown>
          </div>

          <hr className="my-10 border-slate-200" />
          
          <div className="text-center">
             <p className="text-slate-400 text-sm mb-3">Ajak temanmu hadir!</p>
             <div className="flex justify-center gap-3">
               <ShareButton />
             </div>
          </div>

        </div>
      </div>
    </article>
  );
}