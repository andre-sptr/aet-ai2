import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, MapPin, Calendar, Clock } from 'lucide-react';

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: 'asc' },
  });

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
           <Link href="/" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
             <ArrowLeft size={20} />
           </Link>
           <h1 className="text-3xl font-bold text-gray-900">Agenda Kegiatan</h1>
        </div>

        <div className="space-y-6">
          {events.length === 0 ? (
             <p className="text-gray-500">Belum ada kegiatan terjadwal.</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="flex flex-col md:flex-row bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="bg-blue-600 text-white p-6 flex flex-col items-center justify-center min-w-[120px] text-center">
                  <span className="text-4xl font-bold">{new Date(event.startDate).getDate()}</span>
                  <span className="text-sm uppercase font-semibold tracking-wider">
                    {new Date(event.startDate).toLocaleDateString('id-ID', { month: 'short' })}
                  </span>
                  <span className="text-xs opacity-80 mt-1">
                    {new Date(event.startDate).getFullYear()}
                  </span>
                </div>

                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      {new Date(event.startDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {event.location && (
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-1" />
                        {event.location}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600">{event.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}