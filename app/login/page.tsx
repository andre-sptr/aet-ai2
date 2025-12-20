'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.message || 'Login gagal. Silakan coba lagi.');
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem. Periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-white/50 overflow-hidden backdrop-blur-sm">
        <div className="bg-white p-8 pb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-6 shadow-sm ring-1 ring-blue-100">
            <Lock size={32} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Portal</h1>
        </div>

        <div className="p-8 pt-0">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-lg flex items-start animate-in fade-in slide-in-from-top-1">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none placeholder:text-gray-400"
                placeholder="Masukkan username"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none placeholder:text-gray-400"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk Dashboard</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
          <p className="text-black font-medium text-sm tracking-wide">
            &copy; {new Date().getFullYear()} Association of <span className="text-[#D32F2F]">Electro</span>nics Telecommunication
          </p>
          <p className="text-[#0056D2] font-semibold text-xs mt-2">
            Politeknik Caltex Riau
          </p>
        </div>
      </div>
    </div>
  );
}