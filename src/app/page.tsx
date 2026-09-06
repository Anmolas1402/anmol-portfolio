import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { LiveProof } from "@/components/LiveProof";
import { Work } from "@/components/Work";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="noise relative">
        <Hero />
        <LiveProof />
        <Work />
        <About />
        <Experience />
      </main>
      <Contact />
    </>
  );
}
