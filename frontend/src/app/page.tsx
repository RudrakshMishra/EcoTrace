'use client';

import { useScroll } from 'framer-motion';
import { useRef } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/landing/HeroSection';
import ClimateProblem from '../components/landing/ClimateProblem';
import DailyChoices from '../components/landing/DailyChoices';
import QuizMockup from '../components/landing/QuizMockup';
import OrbExperience from '../components/landing/OrbExperience';
import DashboardMockup from '../components/landing/DashboardMockup';
import ActionTracker from '../components/landing/ActionTracker';
import AiInsights from '../components/landing/AiInsights';
import CommunitySection from '../components/landing/CommunitySection';
import AuthSection from '../components/landing/AuthSection';
import FinalImpact from '../components/landing/FinalImpact';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Setup global page scroll tracking to link across boundaries (e.g. Hero -> Climate Problem)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <main 
      ref={containerRef} 
      className="min-h-screen bg-[#0A0F0D] text-[#E8F5E2] overflow-x-hidden relative"
    >
      {/* Floating navigation overlay */}
      <Navbar floating={true} />

      {/* 10-Section Cinematic Experience */}
      <HeroSection scrollYProgress={scrollYProgress} />
      <ClimateProblem scrollYProgress={scrollYProgress} />
      <DailyChoices />
      <QuizMockup />
      <OrbExperience scrollYProgress={scrollYProgress} />
      <DashboardMockup />
      <ActionTracker />
      <AiInsights />
      <CommunitySection />
      
      {/* Authentications portal - preserved & styled to match the cyber neon aesthetics */}
      <AuthSection />
      
      {/* Greener Earth climax reveal and footer */}
      <FinalImpact />
    </main>
  );
}
