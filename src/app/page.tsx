import { PinsProvider } from "@/components/PinsProvider";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { PhysicsPills } from "@/components/PhysicsPills";
import { LiveProof } from "@/components/LiveProof";
import { WhatIDo } from "@/components/WhatIDo";
import { Work } from "@/components/Work";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <PinsProvider>
      <Nav />
      <main className="noise relative">
        <Hero />
        <PhysicsPills />
        <LiveProof />
        <WhatIDo />
        <Work />
        <About />
        <Experience />
        <Testimonials />
      </main>
      <Contact />
    </PinsProvider>
  );
}
