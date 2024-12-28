"use client";

import { About } from "../components/landing/About";
import { Cta } from "../components/landing/Cta";
import { FAQ } from "../components/landing/FAQ";
import { Features } from "../components/landing/Features";
import { Footer } from "../components/landing/Footer";
import { Hero } from "../components/landing/Hero";
import { HowItWorks } from "../components/landing/HowItWorks";
import { Newsletter } from "../components/landing/Newsletter";
import { Pricing } from "../components/landing/Pricing";
import { ScrollToTop } from "../components/landing/ScrollToTop";
import { Services } from "../components/landing/Services";
import { Testimonials } from "../components/landing/Testimonials";

export default function Landing(): JSX.Element {
  return (
    <>
      <Hero />
      <About />
      <HowItWorks />
      <Features />
      <Services />
      <Cta />
      <Testimonials />
      <Pricing />
      <Newsletter />
      <FAQ />
      <Footer />
      <ScrollToTop />
    </>
  );
}