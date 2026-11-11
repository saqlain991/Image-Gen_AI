import Image from "next/image";
import { ArrowUpRight, Sparkles, WandSparkles } from "lucide-react";
import Link from "next/link";
import { ImageGenerator } from "@/components/image-generator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="page-shell">
      <div className="mx-auto max-w-6xl">
        <section className="grid items-center gap-10 pb-12 pt-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-20 lg:pt-10">
          <div className="flex flex-col items-start gap-6">
            <Badge variant="secondary" className="gap-2 px-3 py-1.5 text-xs font-medium"><Sparkles className="size-3.5" /> Powered by Cloudflare Workers AI</Badge>
            <h1 className="max-w-2xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Your ideas, <span className="text-primary">made visible.</span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              Describe what you imagine. Create an image in seconds, keep it in your gallery, and share it with the world.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg"><a href="#create"><WandSparkles /> Start creating</a></Button>
              <Button asChild size="lg" variant="outline"><Link href="/showcase">Explore images <ArrowUpRight /></Link></Button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-4 rounded-[2rem] bg-primary/10 blur-3xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[2rem] border bg-card p-2 shadow-xl">
              <Image
                src="/generated/greenhouse-sunrise.png"
                alt="Illustration of a greenhouse on a misty hillside at sunrise"
                width={1024}
                height={1024}
                priority
                className="aspect-[4/3] w-full rounded-[1.5rem] object-cover"
              />
              <div className="flex items-center gap-3 px-3 py-4 text-sm text-muted-foreground">
                <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-primary"><Sparkles className="size-4" /></span>
                A little inspiration for your next prompt
              </div>
            </div>
          </div>
        </section>

        <section id="create" className="scroll-mt-24 pb-10">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">The studio</p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Create something new</h2>
            </div>
            <p className="text-sm text-muted-foreground">Write a prompt and let the image take shape.</p>
          </div>
          <ImageGenerator />
        </section>
      </div>
    </div>
  );
}
