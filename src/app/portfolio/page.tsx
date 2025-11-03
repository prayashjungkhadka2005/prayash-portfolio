"use client";

import Navbar from "@/features/portfolio/components/Navbar";
import ThemeToggle from "@/shared/components/ThemeToggle";
import DevToolbar from "@/features/portfolio/components/DevToolbar";
import Hero from "@/features/portfolio/sections/Hero";
import About from "@/features/portfolio/sections/About";
import Experience from "@/features/portfolio/sections/Experience";
import Skills from "@/features/portfolio/sections/Skills";
import Projects from "@/features/portfolio/sections/Projects";
import Contact from "@/features/portfolio/sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <ThemeToggle />
      <DevToolbar />
      <main className="pb-14 sm:pb-16">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </>
  );
}

