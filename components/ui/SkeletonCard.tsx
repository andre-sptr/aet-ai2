'use client';

// =============================================
// Skeleton Screens Collection — AET AI
// Komponen reusable untuk loading states
// =============================================

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className = '' }: SkeletonTextProps) {
  const widths = ['w-full', 'w-5/6', 'w-4/5', 'w-3/4', 'w-2/3', 'w-1/2'];
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-3.5 skeleton rounded-full ${widths[i % widths.length]}`}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16' };
  return <div className={`${sizes[size]} skeleton rounded-full flex-shrink-0`} />;
}

// Skeleton untuk Message Bubble AI
export function SkeletonMessage() {
  return (
    <div className="flex gap-3 items-start animate-fade-in">
      <div className="w-8 h-8 skeleton rounded-full flex-shrink-0 mt-1" />
      <div className="flex flex-col gap-2 max-w-[75%] w-full">
        <div className="bg-white rounded-[22px] rounded-tl-none border border-slate-100 px-5 py-4 shadow-sm space-y-2.5">
          <div className="h-3.5 skeleton rounded-full w-full" />
          <div className="h-3.5 skeleton rounded-full w-5/6" />
          <div className="h-3.5 skeleton rounded-full w-4/6" />
          <div className="h-3.5 skeleton rounded-full w-3/5" />
        </div>
      </div>
    </div>
  );
}

// Skeleton untuk kartu mode chat di Landing Page
export function SkeletonChatMode() {
  return (
    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex flex-col items-start p-8 bg-white rounded-3xl border border-slate-100 shadow-sm"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="w-14 h-14 skeleton rounded-2xl mb-6" />
          <div className="h-5 skeleton rounded-full w-2/3 mb-3" />
          <div className="space-y-2 w-full mb-8">
            <div className="h-3.5 skeleton rounded-full w-full" />
            <div className="h-3.5 skeleton rounded-full w-4/5" />
          </div>
          <div className="h-3.5 skeleton rounded-full w-1/3" />
        </div>
      ))}
    </div>
  );
}

// Skeleton untuk stats section
export function SkeletonStats() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col items-center gap-2 p-4">
          <div className="h-8 skeleton rounded-lg w-16" />
          <div className="h-3 skeleton rounded-full w-20" />
        </div>
      ))}
    </div>
  );
}

// Default export — kartu umum
export default function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-3xl border border-slate-100 shadow-sm p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 skeleton rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-4 skeleton rounded-full w-1/2" />
          <div className="h-3 skeleton rounded-full w-1/3" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}
