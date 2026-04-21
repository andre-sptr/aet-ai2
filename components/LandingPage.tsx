'use client';

import { ChatModeConfig } from '@/types';
import { Code2, FileText, MessageCircle, Sparkles, Zap, Shield, ArrowRight, Instagram, Mail, MapPin, Facebook, Globe, Youtube, Menu, X, Bot, Cpu, Layers } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { SkeletonChatMode } from '@/components/ui/SkeletonCard';

interface LandingPageProps {
  onSelectMode: (mode: ChatModeConfig) => void;
}

const CHAT_MODES: ChatModeConfig[] = [
  {
    id: 'daily',
    title: 'Smart Companion',
    description: 'Diskusi interaktif untuk produktivitas sehari-hari, brainstorming, dan tanya jawab umum.',
    icon: 'message',
    systemInstruction: '',
    color: 'purple'
  },
  {
    id: 'report',
    title: 'Academic Writer',
    description: 'Analisis laporan, jurnal, dan penulisan PA terstruktur dengan gaya akademik presisi tinggi.',
    icon: 'file',
    systemInstruction: '',
    color: 'green'
  },
  {
    id: 'coding',
    title: 'Coding Expert',
    description: 'Debugging & penulisan kode Python, C++, HTML dengan penjelasan konsep yang mendalam.',
    icon: 'code',
    systemInstruction: '',
    color: 'blue'
  }
];

const STATS = [
  { value: '3', label: 'Mode AI', icon: Layers },
  { value: '12', label: 'Tools Aktif', icon: Cpu },
  { value: '∞', label: 'Percakapan', icon: Bot },
];

const NAV_LINKS = [
  { href: '/news', label: 'Berita' },
  { href: '/events', label: 'Kegiatan' },
  { href: '/team', label: 'Tim' },
];

export default function LandingPage({ onSelectMode }: LandingPageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer untuk Stats
  useEffect(() => {
    const node = statsRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Tutup drawer saat resize > md
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setIsNavOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const modeColorMap = {
    blue: {
      bg: 'bg-blue-50', text: 'text-blue-600',
      hoverBg: 'group-hover:bg-blue-600', hoverText: 'group-hover:text-white',
      glow: 'group-hover:shadow-blue-200/60',
      gradient: 'from-blue-50/60',
      badge: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    green: {
      bg: 'bg-emerald-50', text: 'text-emerald-600',
      hoverBg: 'group-hover:bg-emerald-600', hoverText: 'group-hover:text-white',
      glow: 'group-hover:shadow-emerald-200/60',
      gradient: 'from-emerald-50/60',
      badge: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    purple: {
      bg: 'bg-violet-50', text: 'text-violet-600',
      hoverBg: 'group-hover:bg-violet-600', hoverText: 'group-hover:text-white',
      glow: 'group-hover:shadow-violet-200/60',
      gradient: 'from-violet-50/60',
      badge: 'bg-violet-50 text-violet-600 border-violet-100',
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">

      {/* === BACKGROUND DECORATION === */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-[25%] -right-[15%] w-[80vw] h-[80vw] rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(59,130,246,0.08) 50%, transparent 70%)',
            animation: 'float 12s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-[30%] -left-[15%] w-[60vw] h-[60vw] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
            animation: 'float 16s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
            animation: 'float 10s ease-in-out infinite 2s',
          }}
        />
      </div>

      {/* === NAVBAR === */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-premium shadow-sm shadow-slate-200/50 py-0'
            : 'bg-transparent py-2'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 h-[68px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/10 rounded-xl blur-md scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Image
                src="/favicon.ico"
                alt="Logo AET"
                width={44}
                height={44}
                className="relative w-11 h-11 object-contain transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">AET AI</h1>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide leading-tight">Himpunan Mahasiswa AET PCR</p>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative hover:text-blue-600 transition-colors duration-200 group/link"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-blue-600 rounded-full transition-all duration-300 group-hover/link:w-full" />
              </Link>
            ))}
          </div>

          {/* Right: Status + Hamburger */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-xs font-semibold">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              Online
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-600"
              aria-label="Toggle Navigation"
            >
              {isNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isNavOpen && (
          <>
            <div
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsNavOpen(false)}
            />
            <div className="absolute top-full right-0 left-0 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-xl z-50 md:hidden nav-drawer">
              <div className="flex flex-col p-4 gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsNavOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-semibold hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2 px-4 py-2 text-emerald-700 text-xs font-semibold">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  System Online
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* === HERO SECTION === */}
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 pt-32 pb-12 lg:pt-40 lg:pb-16">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16 animate-fade-in">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm px-4 py-1.5 rounded-full mb-7 animate-slide-up" style={{ animationDelay: '0ms' }}>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-semibold text-slate-600 tracking-wide">Powered by Google Gemini AI</span>
          </div>

          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-5 leading-[1.1] animate-slide-up"
            style={{ animationDelay: '60ms' }}
          >
            Halo! Selamat Datang di{' '}
            <span
              className="gradient-text"
              style={{
                backgroundImage: 'linear-gradient(135deg, #0056D2 0%, #4F46E5 50%, #7C3AED 100%)',
              }}
            >
              AET AI
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="text-base sm:text-lg text-slate-500 mb-9 leading-relaxed max-w-2xl animate-slide-up"
            style={{ animationDelay: '120ms' }}
          >
            Asisten AI Himpunan Mahasiswa AET Politeknik Caltex Riau. Pilih mode di bawah untuk memulai percakapan cerdas Anda.
          </p>

          {/* Feature Pills */}
          <div
            className="flex flex-wrap justify-center gap-2.5 text-xs font-semibold text-slate-500 animate-slide-up"
            style={{ animationDelay: '180ms' }}
          >
            {[
              { icon: Zap, label: 'Fast Response', color: 'text-blue-500' },
              { icon: Shield, label: 'Secure & Private', color: 'text-emerald-500' },
              { icon: Sparkles, label: 'Gemini Powered', color: 'text-violet-500' },
            ].map(({ icon: Icon, label, color }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/80 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
              >
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* === MODE CARDS (with Skeleton) === */}
        {!isLoaded ? (
          <SkeletonChatMode />
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-7">
            {CHAT_MODES.map((mode, index) => {
              const icons = { code: Code2, file: FileText, message: MessageCircle };
              const Icon = icons[mode.icon as keyof typeof icons] || MessageCircle;
              const colors = modeColorMap[mode.color as keyof typeof modeColorMap];

              return (
                <button
                  key={mode.id}
                  id={`chat-mode-${mode.id}`}
                  onClick={() => onSelectMode(mode)}
                  className={`group relative flex flex-col items-start p-7 bg-white rounded-3xl border border-slate-100 shadow-sm 
                    hover:shadow-xl hover:-translate-y-1.5 ${colors.glow}
                    transition-all duration-300 animate-scale-in text-left overflow-hidden`}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {/* Hover gradient background */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${colors.gradient} to-transparent`} />

                  {/* Mode badge */}
                  <div className={`relative z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-5 border ${colors.badge}`}>
                    AI Mode
                  </div>

                  {/* Icon */}
                  <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 shadow-sm
                    ${colors.bg} ${colors.text} ${colors.hoverBg} ${colors.hoverText}`}>
                    <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <h3 className="relative z-10 text-lg font-bold text-slate-900 mb-2 group-hover:text-slate-900">
                    {mode.title}
                  </h3>

                  <p className="relative z-10 text-sm text-slate-500 leading-relaxed mb-7 flex-1">
                    {mode.description}
                  </p>

                  <div className="relative z-10 flex items-center gap-2 text-sm font-bold text-slate-800 group-hover:gap-3 transition-all duration-200">
                    Mulai Chat
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* === STATS SECTION === */}
        <div ref={statsRef} className="mt-14 mb-4">
          <div className={`grid grid-cols-3 gap-4 max-w-lg mx-auto transition-all duration-700 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {STATS.map(({ value, label, icon: Icon }, i) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <Icon className="w-4 h-4 text-blue-500 mb-0.5" />
                <span className="text-2xl font-bold text-slate-900">{value}</span>
                <span className="text-[11px] text-slate-500 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === HUBUNGI KAMI SECTION === */}
      <div className="relative z-10 max-w-7xl mx-auto mt-16 px-5 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-blue-100">
            <Mail className="w-3.5 h-3.5" />
            Hubungi Kami
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Terhubung dengan AET PCR</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base leading-relaxed">
            Dapatkan informasi terbaru seputar kegiatan himpunan melalui saluran resmi kami.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Social Cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { href: 'https://tet.pcr.ac.id/', Icon: Globe, name: 'Website Resmi', sub: 'tet.pcr.ac.id', hoverBorder: 'hover:border-blue-400', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', glow: 'hover:shadow-blue-100' },
              { href: 'https://www.youtube.com/@AETPCR', Icon: Youtube, name: 'YouTube', sub: 'AETPCR', hoverBorder: 'hover:border-red-400', iconBg: 'bg-red-50', iconColor: 'text-red-600', glow: 'hover:shadow-red-100' },
              { href: 'https://www.instagram.com/aetpcr/', Icon: Instagram, name: 'Instagram', sub: '@aetpcr', hoverBorder: 'hover:border-pink-400', iconBg: 'bg-pink-50', iconColor: 'text-pink-600', glow: 'hover:shadow-pink-100' },
              { href: 'https://facebook.com/aetpcr/', Icon: Facebook, name: 'Facebook', sub: 'AET PCR', hoverBorder: 'hover:border-indigo-400', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', glow: 'hover:shadow-indigo-100' },
            ].map(({ href, Icon, name, sub, hoverBorder, iconBg, iconColor, glow }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group p-5 bg-white rounded-2xl border border-slate-200 ${hoverBorder} hover:shadow-xl ${glow} transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-0.5">{name}</h4>
                <p className="text-xs text-slate-500">{sub}</p>
              </a>
            ))}
          </div>

          {/* Map */}
          <div className="relative group h-full min-h-[350px]">
            <div className="absolute inset-0 bg-blue-500/5 rounded-[2.5rem] -rotate-1 group-hover:rotate-0 transition-transform duration-500" />
            <div className="relative h-full bg-white p-3 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.6202092674093!2d101.42609689999999!3d0.5709752!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5ab67086f2e89%3A0x65a24264fec306bb!2sPoliteknik%20Caltex%20Riau!5e0!3m2!1sid!2sid!4v1766210002355!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '1.5rem', minHeight: '320px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[15%] hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-white/50 shadow-lg animate-fade-in w-fit max-w-[260px]">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Lokasi Kami</p>
                    <p className="text-xs font-bold text-slate-900 leading-tight">Politeknik Caltex Riau, Pekanbaru</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === FOOTER === */}
      <footer className="relative z-10 py-8 mt-20 border-t border-slate-100 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-700 font-medium text-sm tracking-wide">
            &copy; {new Date().getFullYear()} Association of{' '}
            <span className="text-[#D32F2F] font-bold">Electro</span>nics Telecommunication
          </p>
          <p className="text-[#0056D2] font-semibold text-xs mt-1.5">
            Politeknik Caltex Riau
          </p>
        </div>
      </footer>
    </div>
  );
}