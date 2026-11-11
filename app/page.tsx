import Link from "next/link";
import { ArrowDown, ArrowUpRight, Sparkles, Terminal } from "lucide-react";
import { ImageGenerator } from "@/components/image-generator";
import { Button } from "@/components/ui/button";

const shark = String.raw`                    /\
     .             /  \              .
        .         / /\ \       .
                 / /  \ \
      __________/ /    \ \________
   __/  _________/      \________  \__
  <____/   .   .      .   .   \______>
       \________________________/
          \  \  \    /  /  /
           \__\__\__/__/__/
               \______/`;

export default function Home() {
  return (
    <main className="home-experience">
      <div className="home-grid" aria-hidden="true" />
      <div className="home-shell">
        <section className="home-hero">
          <div className="home-copy">
            <div className="home-kicker"><Terminal className="size-4" /> IMAGE STUDIO <span>·</span> CLOUDFLARE AI</div>
            <h1>Make something<br /><span>from nothing.</span></h1>
            <p className="home-description">One thought. A few words. A whole new world.</p>
            <div className="home-actions">
              <Button asChild size="lg" className="home-primary"><a href="#create">Open the studio <ArrowDown /></a></Button>
              <Link href="/showcase" className="home-secondary">See what others made <ArrowUpRight /></Link>
            </div>
            <p className="home-model-note"><Sparkles className="size-3.5" /> Pick from Cloudflare’s image models in the studio</p>
          </div>
          <div className="shark-stage" aria-label="Animated ASCII shark swimming through a deep sea grid">
            <div className="shark-glow" />
            <div className="shark-label"><span>FIG. 01</span><span>ABYSSAL CREATION</span></div>
            <pre className="ascii-shark">{shark}</pre>
            <div className="shark-caption"><span>░░░░░░░░░░░░░░░░░░</span><span>SCANNING THE UNKNOWN</span></div>
            <span className="shark-coordinate">36° 09′ N&nbsp; 128° 22′ W</span>
          </div>
          <div className="home-scroll-cue"><span>01 — THE PROMPT</span><span className="scroll-line" />SCROLL TO CREATE</div>
        </section>

        <section id="create" className="home-studio scroll-mt-20">
          <div className="studio-heading">
            <div><p className="studio-index">02 / YOUR CANVAS</p><h2>Describe the impossible.</h2></div>
            <p>Choose a model. Write a prompt.<br />Let the machine dream.</p>
          </div>
          <ImageGenerator />
        </section>
      </div>
    </main>
  );
}
