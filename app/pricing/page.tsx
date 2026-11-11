import Link from "next/link";
import { ArrowRight, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DAILY_FREE_NEURONS, IMAGE_MODELS } from "@/lib/image-models";

export default function PricingPage() {
  return (
    <div className="page-shell">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Free usage</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Create within the daily allowance.</h1>
          <p className="mt-4 text-muted-foreground">Cloudflare Workers AI provides {DAILY_FREE_NEURONS.toLocaleString()} free neurons per account each day, shared by every model and every app using that account. The allowance resets at 00:00 UTC.</p>
        </div>
        <Card className="mb-8 rounded-3xl">
          <CardHeader><CardTitle>What you can use</CardTitle></CardHeader>
          <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
            <p className="flex gap-3"><Check className="size-5 shrink-0 text-primary" />Choose among supported hosted text to image models</p>
            <p className="flex gap-3"><Check className="size-5 shrink-0 text-primary" />Save and download your generated images</p>
            <p className="flex gap-3"><Check className="size-5 shrink-0 text-primary" />View this app’s estimated daily neuron use</p>
            <p className="flex gap-3"><Check className="size-5 shrink-0 text-primary" />Reuse the same prompt and model without another AI call</p>
          </CardContent>
        </Card>
        <h2 className="mb-4 text-2xl font-semibold">Available models</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {IMAGE_MODELS.map((model) => (
            <Card key={model.id} className="rounded-2xl">
              <CardHeader className="pb-3"><p className="text-xs font-semibold uppercase tracking-widest text-primary">{model.provider}</p><CardTitle className="text-lg">{model.name}</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{model.description}</p><p className="mt-3 text-sm font-medium">{model.estimatedNeurons === null ? "Neuron estimate unavailable" : `~${model.estimatedNeurons.toLocaleString()} neurons / image`}</p>{model.retiresOn && <p className="mt-2 text-xs text-muted-foreground">Planned retirement: November 20, 2026</p>}{model.availabilityNote && <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">{model.availabilityNote}</p>}</CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild><Link href="/">Start creating <ArrowRight /></Link></Button>
          <Button asChild variant="outline"><a href="https://developers.cloudflare.com/workers-ai/platform/pricing/" target="_blank" rel="noreferrer">Cloudflare pricing <ExternalLink /></a></Button>
        </div>
        <p className="mt-5 max-w-3xl text-sm text-muted-foreground">Estimates use the fixed image settings shown in this app. Cloudflare’s dashboard is authoritative for actual account usage, including requests made outside this app and requests that fail after inference.</p>
      </div>
    </div>
  );
}
