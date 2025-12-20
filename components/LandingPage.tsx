'use client';

import { ChatModeConfig } from '@/types';
import { Code2, FileText, MessageCircle, Sparkles, Zap, Shield, ArrowRight, ExternalLink, Instagram, Mail, MapPin, Facebook, Globe, Youtube } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface LandingPageProps {
  onSelectMode: (mode: ChatModeConfig) => void;
}

const CHAT_MODES: ChatModeConfig[] = [
  {
    id: 'daily',
    title: 'Smart Companion',
    description: 'Diskusi interaktif untuk produktivitas sehari-hari.',
    icon: 'message',
    systemInstruction: '',
    color: 'purple'
  },
  {
    id: 'report',
    title: 'Academic Writer',
    description: 'Analisis laporan, jurnal, dan penulisan PA terstruktur.',
    icon: 'file',
    systemInstruction: '',
    color: 'green'
  },
  {
    id: 'coding',
    title: 'Coding Expert',
    description: 'Debugging & penulisan kode Python, C++, HTML dengan presisi tinggi.',
    icon: 'code',
    systemInstruction: '',
    color: 'blue'
  }
];

export default function LandingPage({ onSelectMode }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group">
            <Image 
              src="/favicon.ico" 
              alt="Logo AET" 
              width={56} 
              height={56} 
              className="w-14 h-14 object-contain" 
              unoptimized
            />
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none ">AET AI</h1>
              <p className="text-[14px] text-slate-500 font-medium tracking-wide">Himpunan Mahasiswa AET PCR</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="/news" className="hover:text-blue-600 transition-colors">
              Berita
            </Link>
            <Link href="/events" className="hover:text-blue-600 transition-colors">
              Kegiatan
            </Link>
            <Link href="/team" className="hover:text-blue-600 transition-colors">
              Struktur Organisasi
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Online
            </div>
          </div>
        </div>
      </nav>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] bg-blue-100/50 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-indigo-100/50 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-24 animate-fade-in px-4">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-4 py-1.5 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-slate-600">AET Intelligence System</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 whitespace-nowrap">
            Halo! Selamat Datang di <span className="text-[#0056D2] tracking-wider ml-3">AET AI</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Saya adalah asisten AI Himpunan Mahasiswa AET Politeknik Caltex Riau. Pilih salah satu kemampuan di bawah untuk memulai percakapan.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-lg border border-slate-100">
              <Zap className="w-4 h-4 text-blue-500" /> Fast Response
            </span>
            <span className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-lg border border-slate-100">
              <Shield className="w-4 h-4 text-green-500" /> Secure & Private
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {CHAT_MODES.map((mode, index) => {
            const icons = { code: Code2, file: FileText, message: MessageCircle };
            const Icon = icons[mode.icon as keyof typeof icons] || MessageCircle;
            
            return (
              <button
                key={mode.id}
                onClick={() => onSelectMode(mode)}
                className="group relative flex flex-col items-start p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 animate-slide-up text-left overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-${mode.color === 'blue' ? 'blue' : mode.color === 'green' ? 'emerald' : 'violet'}-50/50 to-transparent`} />

                <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 
                  ${mode.color === 'blue' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 
                    mode.color === 'green' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' : 
                    'bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white'}`}
                >
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="relative z-10 text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-900">
                  {mode.title}
                </h3>
                
                <p className="relative z-10 text-slate-500 leading-relaxed mb-8 flex-1">
                  {mode.description}
                </p>

                <div className="relative z-10 flex items-center gap-2 text-sm font-semibold text-slate-900 group-hover:gap-3 transition-all">
                  Mulai Chat <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto mt-32 px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-blue-100">
            Hubungi Kami
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Terhubung dengan AET PCR</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Dapatkan informasi terbaru seputar kegiatan himpunan dan program studi melalui saluran resmi kami.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a 
              href="https://tet.pcr.ac.id/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-6 bg-white rounded-3xl border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1">Website Resmi</h4>
              <p className="text-sm text-slate-500">tet.pcr.ac.id</p>
            </a>

            <a 
              href="https://www.youtube.com/@AETPCR"
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-6 bg-white rounded-3xl border border-slate-200 hover:border-red-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Youtube className="w-6 h-6 text-red-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1">YouTube Channel</h4>
              <p className="text-sm text-slate-500">AET PCR</p>
            </a>

            <a 
              href="https://www.instagram.com/aetpcr/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-6 bg-white rounded-3xl border border-slate-200 hover:border-pink-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Instagram className="w-6 h-6 text-pink-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1">Instagram</h4>
              <p className="text-sm text-slate-500">@aetpcr</p>
            </a>

            <a 
              href="https://facebook.com/aetpcr/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-6 bg-white rounded-3xl border border-slate-200 hover:border-indigo-600 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Facebook className="w-6 h-6 text-indigo-600" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1">Facebook</h4>
              <p className="text-sm text-slate-500">AET PCR</p>
            </a>
          </div>

          <div className="relative group h-full min-h-[400px]">
            <div className="absolute inset-0 bg-blue-500/5 rounded-[2.5rem] -rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
            <div className="relative h-full bg-white p-3 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.6202092674093!2d101.42609689999999!3d0.5709752!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5ab67086f2e89%3A0x65a24264fec306bb!2sPoliteknik%20Caltex%20Riau!5e0!3m2!1sid!2sid!4v1766210002355!5m2!1sid!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0, borderRadius: '1.5rem' }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[20%] hover:grayscale-0 transition-all duration-500"
              ></iframe>
              <div className="absolute bottom-6 right-6 left-auto bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-lg animate-fade-in w-fit max-w-[280px]">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="pr-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Lokasi Kami
                    </p>
                    <p className="text-sm font-bold text-slate-900 leading-tight">
                      Politeknik Caltex Riau, Pekanbaru
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 py-6 mt-20 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-black font-medium text-sm tracking-wide">
            &copy; {new Date().getFullYear()} Association of <span className="text-[#D32F2F]">Electro</span>nics Telecommunication
          </p>
          <p className="text-[#0056D2] font-semibold text-xs mt-2">
            Politeknik Caltex Riau
          </p>
        </div>
      </footer>
    </div>
  );
}