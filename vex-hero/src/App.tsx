import AnimatedHeading from './components/AnimatedHeading';
import FadeIn from './components/FadeIn';

export default function App() {

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white flex flex-col font-sans">
      {/* 1. Full-Screen Raw Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
          type="video/mp4"
        />
      </video>

      {/* 2. Page Content Overlay */}
      <div className="relative z-10 flex-1 flex flex-col justify-between min-h-screen">
        
        {/* Navbar Layer */}
        <header className="w-full px-6 md:px-12 lg:px-16 pt-6">
          <div className="liquid-glass rounded-xl px-4 py-2.5 flex items-center justify-between border border-white/20">
            {/* Left Logo */}
            <a href="/" className="text-2xl font-semibold tracking-tight text-white select-none">
              VEX
            </a>

            {/* Center Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              {['Story', 'Investing', 'Building', 'Advisory'].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-sm font-medium text-white hover:text-gray-300 transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </nav>

            {/* Right Action Button */}
            <button className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
              Start a Chat
            </button>
          </div>
        </header>

        {/* Hero Content Grid (Bottom of Viewport) */}
        <div className="w-full px-6 md:px-12 lg:px-16 flex-1 flex flex-col justify-end pb-12 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-end gap-8">
            
            {/* Left Column: Heading, Subheading, Action Buttons */}
            <div className="flex flex-col text-left">
              {/* Heading Stagger Entrance */}
              <AnimatedHeading
                text="Shaping tomorrow&#10;with vision and action."
                initialDelay={200}
                charDelay={30}
                duration={500}
                className="text-white mb-4"
              />

              {/* Subheading Fade-In */}
              <FadeIn delay={800} duration={1000}>
                <p className="text-base sm:text-lg text-gray-300 mb-5 max-w-lg leading-relaxed">
                  We back visionaries and craft ventures that define what comes next.
                </p>
              </FadeIn>

              {/* Buttons Stagger Fade-In */}
              <FadeIn delay={1200} duration={1000}>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-250 cursor-pointer text-sm sm:text-base">
                    Start a Chat
                  </button>
                  <button className="liquid-glass border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-all duration-300 cursor-pointer text-sm sm:text-base">
                    Explore Now
                  </button>
                </div>
              </FadeIn>
            </div>

            {/* Right Column: Liquid Glass Tag Badge */}
            <div className="flex items-end justify-start lg:justify-end">
              <FadeIn delay={1400} duration={1000} className="w-full sm:w-auto">
                <div className="liquid-glass border border-white/20 px-6 py-3 rounded-xl w-full sm:w-auto text-left lg:text-right">
                  <span className="text-lg md:text-xl lg:text-2xl font-light text-white tracking-wide whitespace-nowrap block">
                    Investing. Building. Advisory.
                  </span>
                </div>
              </FadeIn>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
