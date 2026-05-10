"use client"

import { Header } from "@/components/landing/Header"
import { Hero } from "@/components/landing/Hero"
import { Features } from "@/components/landing/Features"
import { Workflows } from "@/components/landing/Workflows"
import { Capabilities } from "@/components/landing/Capabilities"
import { CTA } from "@/components/landing/CTA"
import { Pricing } from "@/components/landing/Pricing"
import { Footer } from "@/components/landing/Footer"

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Workflows />
        <Capabilities />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
