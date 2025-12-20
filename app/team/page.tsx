import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, User, Briefcase, Users } from 'lucide-react';

export const revalidate = 0;

export default async function TeamPage() {
  const team = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' },
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
              Struktur & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Anggota Organisasi</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Tim solid <strong>Himpunan Mahasiswa AET PCR</strong>. 
              Berdedikasi menggerakkan visi, inovasi, dan kolaborasi demi kemajuan bersama.
            </p>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {team.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Users size={40} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Anggota</h3>
            <p className="text-slate-500 max-w-md">
              Data struktur organisasi belum ditambahkan. Silakan cek kembali nanti.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {team.map((member) => (
              <div 
                key={member.id} 
                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center relative"
              >
                <div className="h-24 w-full bg-gradient-to-r from-blue-50 to-cyan-50 absolute top-0 left-0 z-0" />

                <div className="relative z-10 mt-8 mb-4">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-200 mx-auto group-hover:scale-105 transition-transform duration-300">
                    {member.photoUrl ? (
                      <img 
                        src={member.photoUrl} 
                        alt={member.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <User size={48} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 w-full flex flex-col flex-grow relative z-10">
                  <h2 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {member.name}
                  </h2>
                  
                  <div className="flex items-center justify-center gap-1 text-sm font-semibold text-blue-600 mb-4 uppercase tracking-wide">
                    <Briefcase size={14} />
                    <span>{member.position}</span>
                  </div>

                  <div className="w-10 h-1 bg-slate-100 rounded-full mx-auto mb-4" />

                  {member.bio ? (
                    <p className="text-slate-500 text-sm leading-relaxed italic line-clamp-3">
                      "{member.bio}"
                    </p>
                  ) : (
                    <p className="text-slate-300 text-sm italic">
                      - Tidak ada bio -
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}