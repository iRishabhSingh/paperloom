import { Inter } from "next/font/google";

// Components
import Hero from "@/components/Home/Hero";
import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";
import Benefits from "@/components/Home/Benefits";
import Features from "@/components/Home/Features";
import MobileNav from "@/components/Home/MobileNav";
import HowItWorks from "@/components/Home/HowItWorks";
import CTASection from "@/components/Home/CTASection";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function Home() {
  return (
    <div className={`${inter.variable} min-h-screen font-sans`}>
      {/* Navbar - Mobile Optimized */}
      <Navbar />

      {/* Hero Section - Enhanced */}
      <Hero />

      {/* Features Section - Theme Consistent Cards */}
      <Features />

      {/* How It Works - Theme Consistent Cards */}
      <HowItWorks />

      {/* Benefits Section */}
      <Benefits />

      {/* CTA Section */}
      <CTASection />

      {/* Footer - Mobile Optimized */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
