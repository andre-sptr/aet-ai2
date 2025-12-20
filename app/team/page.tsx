import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';

export default async function TeamPage() {
  const team = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8">
           <ArrowLeft size={16} className="mr-2" /> Kembali ke Home
        </Link>
        
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Struktur Organisasi</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <div key={member.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all text-center border border-gray-100">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-inner">
                {member.photoUrl ? (
                  <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
              <p className="text-blue-600 text-sm font-medium mb-3">{member.position}</p>
              {member.bio && (
                <p className="text-gray-500 text-sm italic">"{member.bio}"</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}