'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Leaf, LogOut, User, Compass, Award, Target, LayoutDashboard, Calendar } from 'lucide-react';
import { api } from '../utils/api';

interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  floating?: boolean;
}

export default function Navbar({ activeTab, setActiveTab, floating = false }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check if user is logged in
    const storedUser = localStorage.getItem('ecotrace_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('ecotrace_token');
    localStorage.removeItem('ecotrace_user');
    setUser(null);
    router.push('/');
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const isDashboard = pathname === '/dashboard';

  const menuItems = [
    { label: 'Overview', value: 'overview', icon: LayoutDashboard },
    { label: 'Daily Tracker', value: 'tracker', icon: Calendar },
    { label: 'Kanban Plan', value: 'insights', icon: Compass },
    { label: 'Leaderboard', value: 'leaderboard', icon: Award },
    { label: 'My Goals', value: 'goals', icon: Target },
  ];

  const handleTabClick = (tabValue: string) => {
    if (setActiveTab) {
      setActiveTab(tabValue);
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'h-20 bg-[#0A0F0D]/70 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/20' 
          : floating
            ? 'h-26 pt-6 bg-transparent px-4 md:px-8 lg:px-12'
            : 'h-20 bg-transparent'
      }`}
    >
      <div
        className={`${
          !scrolled && floating
            ? 'max-w-7xl mx-auto liquid-glass rounded-xl px-4 py-2 flex items-center justify-between border border-white/20 h-14'
            : 'max-w-7xl mx-auto h-full px-6 flex items-center justify-between'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#39FF14] to-[#00E5A0] flex items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-transform group-hover:scale-105">
            <Leaf className="w-5 h-5 text-[#0A0F0D] stroke-[2.5]" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-[#E8F5E2] group-hover:text-[#39FF14] transition-colors">
            Eco<span className="text-[#39FF14]">Trace</span>
          </span>
        </Link>

        {/* Center Links (Tab selector if on Dashboard, otherwise static links) */}
        <div className="hidden md:flex items-center gap-1">
          {isDashboard && setActiveTab ? (
            menuItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => handleTabClick(item.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20 shadow-[0_0_15px_rgba(57,255,20,0.05)]'
                      : 'text-[#6B8F71] hover:text-[#E8F5E2] hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })
          ) : (
            <>
              <Link href="/" className={`px-4 py-2 text-sm font-medium ${pathname === '/' ? 'text-[#39FF14]' : 'text-[#6B8F71] hover:text-[#E8F5E2]'} transition-colors`}>
                Home
              </Link>
              <Link href="/dashboard" className={`px-4 py-2 text-sm font-medium ${pathname === '/dashboard' ? 'text-[#39FF14]' : 'text-[#6B8F71] hover:text-[#E8F5E2]'} transition-colors`}>
                Dashboard
              </Link>
              <Link href="/carbon-lens" className={`px-4 py-2 text-sm font-medium ${pathname === '/carbon-lens' ? 'text-[#39FF14] bg-[#39FF14]/10 rounded-xl' : 'text-[#6B8F71] hover:text-[#39FF14]'} transition-colors flex items-center gap-1.5`}>
                📊 CarbonLens
              </Link>
            </>
          )}
        </div>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[#162019] border border-white/5 py-1.5 px-3.5 rounded-xl">
                <User className="w-4 h-4 text-[#00E5A0]" />
                <span className="text-sm font-medium text-[#E8F5E2]">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#FF4D4D]/10 hover:text-[#FF4D4D] border border-white/5 flex items-center justify-center transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/#auth"
              className="bg-[#39FF14] hover:bg-[#2ed60f] text-[#0A0F0D] font-medium text-sm px-6 py-2.5 rounded-xl shadow-[0_0_20px_rgba(57,255,20,0.25)] hover:shadow-[0_0_25px_rgba(57,255,20,0.4)] transition-all font-display"
            >
              Start Free
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[#E8F5E2] hover:text-[#39FF14] transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`fixed left-0 w-full bg-[#0A0F0D]/95 backdrop-blur-lg border-t border-white/5 z-40 animate-fade-in flex flex-col p-6 justify-between md:hidden transition-all duration-300 ${
          scrolled ? 'top-20 h-[calc(100vh-80px)]' : floating ? 'top-26 h-[calc(100vh-104px)]' : 'top-20 h-[calc(100vh-80px)]'
        }`}>
          <div className="flex flex-col gap-3">
            {isDashboard && setActiveTab ? (
              menuItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => handleTabClick(item.value)}
                    className={`flex items-center gap-3 w-full p-4 rounded-xl text-left font-medium transition-all ${
                      active
                        ? 'bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/20'
                        : 'text-[#6B8F71] hover:text-[#E8F5E2] bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })
            ) : (
              <>
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full p-4 rounded-xl font-medium bg-white/5 text-[#E8F5E2] flex items-center gap-3"
                >
                  <Compass className="w-5 h-5 text-[#00E5A0]" />
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full p-4 rounded-xl font-medium bg-white/5 text-[#E8F5E2] flex items-center gap-3"
                >
                  <LayoutDashboard className="w-5 h-5 text-[#00E5A0]" />
                  Dashboard
                </Link>
                <Link
                  href="/carbon-lens"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full p-4 rounded-xl font-medium ${pathname === '/carbon-lens' ? 'bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/30' : 'bg-white/5 text-[#E8F5E2]'} flex items-center gap-3`}
                >
                  <span className="text-xl">📊</span>
                  CarbonLens Analytics
                </Link>
              </>
            )}
          </div>

          <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 bg-[#162019] p-3 rounded-xl border border-white/5">
                  <User className="w-5 h-5 text-[#00E5A0]" />
                  <span className="text-[#E8F5E2] font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-3 bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/20 font-medium rounded-xl flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                href="/#auth"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 bg-[#39FF14] text-[#0A0F0D] font-bold text-center rounded-xl font-display shadow-[0_0_20px_rgba(57,255,20,0.2)]"
              >
                Start Free
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
