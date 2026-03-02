import Background from "@/components/Background";
import SmoothScroll from "@/components/SmoothScroll";
import HeroSection from "@/components/HeroSection";
import NoteSection from "@/components/NoteSection";
import ResponseSection from "@/components/ResponseSection";

export default function Home() {
  return (
    <SmoothScroll>
      <Background />
      <main className="content-layer">
        <HeroSection />

        <div style={{
          width: "100%", maxWidth: "500px", height: "1px", margin: "0 auto",
          background: "linear-gradient(to right, transparent, rgba(94,234,212,0.08), transparent)",
        }} />

        <NoteSection />

        <div style={{
          width: "100%", maxWidth: "500px", height: "1px", margin: "0 auto",
          background: "linear-gradient(to right, transparent, rgba(94,234,212,0.08), transparent)",
        }} />

        <ResponseSection />


      </main>
    </SmoothScroll>
  );
}
