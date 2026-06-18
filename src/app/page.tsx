import SmoothScroll from "@/components/layout/SmoothScroll";
import CustomCursor from "@/components/layout/CustomCursor";
import Preloader from "@/components/layout/Preloader";
import ScrollProgress from "@/components/layout/ScrollProgress";
import ThemePicker from "@/components/layout/ThemePicker";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Overview from "@/components/sections/Overview";
import Manifesto from "@/components/sections/Manifesto";
import About from "@/components/sections/About";
import Approach from "@/components/sections/Approach";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Writing from "@/components/sections/Writing";
import Contact from "@/components/sections/Contact";
import AgentWidget from "@/components/agent/AgentWidget";

export default function Home() {
  return (
    <SmoothScroll>
      <Preloader />
      <ScrollProgress />
      <ThemePicker />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Overview />
        <Manifesto />
        <About />
        <Approach />
        <Experience />
        <Projects />
        <Skills />
        <Writing />
        <Contact />
      </main>
      <Footer />
      <AgentWidget />
    </SmoothScroll>
  );
}
