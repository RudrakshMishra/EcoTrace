'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Loader2, KeyRound, Mail, UserCheck } from 'lucide-react';
import { api } from '../../utils/api';
import { motion } from 'framer-motion';

export default function AuthSection() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'register') {
        if (!name || !email || !password) {
          throw new Error('All fields are required');
        }
        await api.register({ name, email, password });
        // Auto-login after registration
        const loginRes = await api.login({ email, password });
        localStorage.setItem('ecotrace_token', loginRes.accessToken);
        localStorage.setItem('ecotrace_user', JSON.stringify(loginRes.user));
        router.push('/dashboard');
      } else {
        if (!email || !password) {
          throw new Error('Email and password are required');
        }
        const loginRes = await api.login({ email, password });
        localStorage.setItem('ecotrace_token', loginRes.accessToken);
        localStorage.setItem('ecotrace_user', JSON.stringify(loginRes.user));
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="auth" className="relative min-h-screen w-full bg-[#0A0F0D] flex flex-col items-center justify-center overflow-hidden py-32 px-6">
      {/* Background gradients */}
      <div className="absolute top-[30%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#39FF14]/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#00E5A0]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full z-10 flex flex-col items-center">
        
        {/* Card Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="liquid-glass border border-white/10 rounded-3xl p-8 w-full shadow-2xl relative overflow-hidden"
        >
          {/* Neon side border highlight */}
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#39FF14] to-[#00E5A0]" />
          
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-3xl text-[#E8F5E2]">
              {authMode === 'login' ? 'Welcome Back' : 'Create Your Account'}
            </h2>
            <p className="text-xs text-[#6B8F71] mt-2 leading-relaxed">
              {authMode === 'login' 
                ? 'Sign in to access your carbon statistics, goals, and leaderboard rank.' 
                : 'Join EcoTrace today and track your progress permanently.'}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 p-4 rounded-xl text-xs font-semibold text-[#FF4D4D] text-left flex items-start gap-2"
            >
              <span className="mt-0.5">⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleAuthSubmit} className="flex flex-col gap-5">
            {authMode === 'register' && (
              <div className="flex flex-col gap-2 text-left">
                <label className="text-[10px] uppercase tracking-wider font-mono font-bold text-[#6B8F71] flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#39FF14]" />
                  <span>Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#162019] border border-white/5 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#39FF14] text-[#E8F5E2] placeholder-gray-600 transition-all focus:bg-[#111A14]"
                />
              </div>
            )}

            <div className="flex flex-col gap-2 text-left">
              <label className="text-[10px] uppercase tracking-wider font-mono font-bold text-[#6B8F71] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#39FF14]" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                placeholder="you@domain.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#162019] border border-white/5 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#39FF14] text-[#E8F5E2] placeholder-gray-600 transition-all focus:bg-[#111A14]"
              />
            </div>

            <div className="flex flex-col gap-2 text-left">
              <label className="text-[10px] uppercase tracking-wider font-mono font-bold text-[#6B8F71] flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#39FF14]" />
                <span>Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#162019] border border-white/5 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-[#39FF14] text-[#E8F5E2] placeholder-gray-600 transition-all focus:bg-[#111A14]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#39FF14] hover:bg-[#2ed60f] text-[#0A0F0D] font-bold text-xs py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(57,255,20,0.15)] mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{authMode === 'login' ? 'Login' : 'Create Account'}</span>
                  <Shield className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-[#6B8F71] border-t border-white/5 pt-6">
            {authMode === 'login' ? (
              <span>
                Don&apos;t have an account?{' '}
                <button onClick={() => setAuthMode('register')} className="text-[#39FF14] hover:underline font-semibold cursor-pointer">
                  Register here
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button onClick={() => setAuthMode('login')} className="text-[#39FF14] hover:underline font-semibold cursor-pointer">
                  Log in
                </button>
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
