import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/Hero";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-canvas">
      <Header dynamic={true} />
      <main className="flex-grow">
        <HeroSection />
      </main>
    </div>
  );
}
