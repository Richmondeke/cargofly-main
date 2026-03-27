"use client";

import Hero from "@/components/Hero";
import PromoSection from "@/components/PromoSection";
import TagMarquee from "@/components/TagMarquee";
import TrustSection from "@/components/TrustSection";
import BlogSection from "@/components/BlogSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Promo Card Section */}
      <PromoSection />

      {/* Infinite Tag Marquee */}
      <TagMarquee />
      <TrustSection />

      <BlogSection />

      {/* Footer will be auto-attached by layout, but we need to ensure it blends.
          Since the footer has its own bg-navy-900, it might contrast slightly with #003399.
          For this task, we assume the footer component handles itself, but we ensure the page background 
          doesn't leak white gaps. */}
    </main>
  );
}
