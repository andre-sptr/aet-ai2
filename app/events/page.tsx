import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, MapPin, Clock, Calendar, ArrowRight, Megaphone } from 'lucide-react';

export const revalidate = 0;

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: 'asc' },
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMonthAbbr = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', { month: 'short' }).toUpperCase();
  };

  const getDay = (date: Date) => {
    return new Date(date).getDate();
  };

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
              Agenda & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Kegiatan</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Jangan lewatkan berbagai momen penting dan kegiatan seru yang telah kami siapkan. 
              Bergabunglah dan jadilah bagian dari perjalanan kami.
            </p>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Megaphone size={40} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Kegiatan</h3>
            <p className="text-slate-500 max-w-md">
              Saat ini belum ada agenda kegiatan mendatang. Pantau terus halaman ini untuk pembaruan jadwal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
              >
                <div className="relative h-56 w-full overflow-hidden bg-slate-200">
                  {event.imageUrl ? (
                    <img 
                      src={event.imageUrl} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                      <Calendar size={40} className="mb-2 opacity-50" />
                      <span className="text-xs font-medium uppercase tracking-wider">Event</span>
                    </div>
                  )}
                  
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-2 min-w-[60px] text-center shadow-lg border border-slate-100 z-10">
                    <span className="block text-xs font-bold text-red-500 uppercase tracking-wider">
                      {getMonthAbbr(event.startDate)}
                    </span>
                    <span className="block text-2xl font-extrabold text-slate-800 leading-none mt-1">
                      {getDay(event.startDate)}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow p-6">
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center text-sm font-medium text-slate-600">
                      <Clock size={16} className="text-blue-600 mr-2" />
                      {formatTime(event.startDate)} WIB
                      {event.endDate && ` - ${formatTime(event.endDate)} WIB`}
                    </div>
                    {event.location && (
                      <div className="flex items-center text-sm font-medium text-slate-600">
                        <MapPin size={16} className="text-red-500 mr-2" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h2>

                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                    {event.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                     <span className="ml-auto text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded">
                        {new Date(event.startDate).getFullYear()}
                     </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}