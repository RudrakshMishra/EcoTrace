import Link from 'next/link';
import { Leaf, Globe, Mail, Heart } from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#0A0F0D] border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#39FF14] to-[#00E5A0] flex items-center justify-center">
              <Leaf className="w-4 h-4 text-[#0A0F0D] stroke-[2.5]" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-[#E8F5E2]">
              Eco<span className="text-[#39FF14]">Trace</span>
            </span>
          </Link>
          <p className="text-sm text-[#6B8F71] leading-relaxed max-w-xs">
            A real-time climate tech tracker helping individuals measure, understand, and offset their carbon footprint.
          </p>
        </div>

        {/* Product Links */}
        <div className="flex flex-col gap-3">
          <h4 className="font-display font-semibold text-[#E8F5E2] text-sm uppercase tracking-wider">Product</h4>
          <Link href="/dashboard" className="text-sm text-[#6B8F71] hover:text-[#39FF14] transition-colors w-fit">Dashboard</Link>
          <Link href="/quiz" className="text-sm text-[#6B8F71] hover:text-[#39FF14] transition-colors w-fit">Calculator Quiz</Link>
          <Link href="#" className="text-sm text-[#6B8F71] hover:text-[#39FF14] transition-colors w-fit">Offset Partners</Link>
        </div>

        {/* Legal & Docs */}
        <div className="flex flex-col gap-3">
          <h4 className="font-display font-semibold text-[#E8F5E2] text-sm uppercase tracking-wider">Resources</h4>
          <Link href="#" className="text-sm text-[#6B8F71] hover:text-[#39FF14] transition-colors w-fit">Privacy Policy</Link>
          <Link href="#" className="text-sm text-[#6B8F71] hover:text-[#39FF14] transition-colors w-fit">Terms of Service</Link>
          <Link href="#" className="text-sm text-[#6B8F71] hover:text-[#39FF14] transition-colors w-fit">API Reference</Link>
        </div>

        {/* Contact & Community */}
        <div className="flex flex-col gap-4">
          <h4 className="font-display font-semibold text-[#E8F5E2] text-sm uppercase tracking-wider">Connect</h4>
          <div className="flex gap-3">
            <Link href="https://github.com" target="_blank" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:text-[#39FF14] hover:bg-white/10 transition-all">
              <GithubIcon className="w-4 h-4" />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:text-[#39FF14] hover:bg-white/10 transition-all">
              <Globe className="w-4 h-4" />
            </Link>
            <Link href="mailto:info@ecotrace.org" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:text-[#39FF14] hover:bg-white/10 transition-all">
              <Mail className="w-4 h-4" />
            </Link>
          </div>
          <div className="text-xs text-[#6B8F71]">
            Contact: <span className="text-[#E8F5E2]">support@ecotrace.org</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#6B8F71]">
        <div className="italic text-center md:text-left max-w-md">
          &ldquo;The greatest threat to our planet is the belief that someone else will save it.&rdquo; <span className="text-[#E8F5E2] block md:inline font-medium">— Robert Swan</span>
        </div>
        <div className="flex items-center gap-1">
          <span>&copy; {new Date().getFullYear()} EcoTrace. Made with</span>
          <Heart className="w-3.5 h-3.5 text-[#FF4D4D] fill-[#FF4D4D] animate-pulse" />
          <span>for the Planet.</span>
        </div>
      </div>
    </footer>
  );
}
