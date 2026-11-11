"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, ImagePlus, Loader2, Sparkles, WandSparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { GalleryImage, ImageCard } from "@/components/image-card";
import { DEFAULT_IMAGE_MODEL, IMAGE_MODELS } from "@/lib/image-models";

const formSchema = z.object({ prompt: z.string().trim().min(1, "Describe your image first").max(400), modelId: z.string() });
const ideas = ["A city floating above the clouds", "A cozy cabin under the northern lights", "A robot tending a wild garden"];
const providers = Array.from(new Set(IMAGE_MODELS.map((model) => model.provider)));

type Usage = {
  estimatedAppNeuronsToday: number;
  freeNeuronsPerDay: number;
  untrackedImages: number;
  yourImagesToday: number;
  resetsAt: string;
};

export function ImageGenerator() {
  const { status } = useSession();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [retiredIds, setRetiredIds] = useState<string[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "", modelId: DEFAULT_IMAGE_MODEL },
  });
  const promptLength = form.watch("prompt").length;
  const selectedModel = IMAGE_MODELS.find((model) => model.id === form.watch("modelId")) || IMAGE_MODELS[0];

  useEffect(() => {
    setRetiredIds(IMAGE_MODELS.filter((model) => model.retiresOn && Date.now() >= Date.parse(`${model.retiresOn}T00:00:00Z`)).map((model) => model.id));
  }, []);

  const fetchUsage = useCallback(async () => {
    try {
      const response = await fetch("/api/usage", { cache: "no-store" });
      if (response.ok) setUsage(await response.json());
    } catch { /* Usage is supplementary; generation still handles service errors. */ }
  }, []);

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch("/api/user-images", { cache: "no-store" });
      if (!response.ok) throw new Error("Could not load your images");
      setImages(await response.json());
    } catch {
      toast.error("Could not load your images");
    } finally {
      setIsLoadingImages(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      void fetchImages();
      void fetchUsage();
    }
    else setIsLoadingImages(false);
  }, [status, fetchImages, fetchUsage]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Image generation failed");
      toast.success(data.reused ? "Showing your existing image for this model and prompt" : "Your image is ready");
      form.setValue("prompt", "");
      await fetchImages();
      await fetchUsage();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image generation failed");
    } finally {
      setIsGenerating(false);
    }
  }

  if (status === "loading") {
    return <Skeleton className="h-64 w-full rounded-3xl" />;
  }

  if (status !== "authenticated") {
    return (
      <Card className="rounded-3xl border-dashed bg-card/80 shadow-sm">
        <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary"><ImagePlus className="size-7" /></span>
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-semibold">Your canvas is waiting</h3>
            <p className="max-w-md text-sm text-muted-foreground">Sign in to turn a prompt into an image and keep your creations together.</p>
          </div>
          <div className="flex gap-3">
            <Button asChild><Link href="/login">Sign in <ArrowRight /></Link></Button>
            <Button asChild variant="outline"><Link href="/register">Create account</Link></Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <Card className="overflow-hidden rounded-3xl shadow-sm">
        <CardHeader className="border-b bg-secondary/30 px-5 py-5 sm:px-8">
          <CardTitle className="flex items-center gap-2 text-lg"><WandSparkles className="size-5 text-primary" /> Text to image</CardTitle>
          <CardDescription>Be specific about the subject, setting, colors, and mood.</CardDescription>
        </CardHeader>
        <CardContent className="p-5 sm:p-8">
          <div className="mb-7 rounded-2xl border bg-secondary/20 p-4 sm:p-5">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div><p className="text-sm font-semibold">Cloudflare free allowance</p><p className="text-xs text-muted-foreground">Shared across this app and other uses of the same Cloudflare account. Resets at 00:00 UTC.</p></div>
              <p className="text-sm font-semibold tabular-nums">{usage ? `${Math.round(usage.estimatedAppNeuronsToday).toLocaleString()} / ${usage.freeNeuronsPerDay.toLocaleString()}` : "Loading…"} neurons</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${usage ? Math.min(100, usage.estimatedAppNeuronsToday / usage.freeNeuronsPerDay * 100) : 0}%` }} /></div>
            <p className="mt-2 text-xs text-muted-foreground">App estimate only; Cloudflare Dashboard shows actual account usage. {usage ? `You created ${usage.yourImagesToday} image${usage.yourImagesToday === 1 ? "" : "s"} today.` : ""}{usage?.untrackedImages ? ` ${usage.untrackedImages} earlier image${usage.untrackedImages === 1 ? " has" : "s have"} no estimate.` : ""}</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <FormField control={form.control} name="modelId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Image model</FormLabel>
                  <FormControl>
                    <select {...field} disabled={isGenerating} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      {providers.map((provider) => <optgroup key={provider} label={provider}>
                        {IMAGE_MODELS.filter((model) => model.provider === provider).map((model) => <option key={model.id} value={model.id} disabled={retiredIds.includes(model.id)}>{model.name}{model.retiresOn ? " · retires Nov 20" : ""}</option>)}
                      </optgroup>)}
                    </select>
                  </FormControl>
                  <p className="text-xs text-muted-foreground">{selectedModel.description}. {selectedModel.estimatedNeurons === null ? "Neuron estimate unavailable" : `About ${selectedModel.estimatedNeurons.toLocaleString()} neurons per image`}. {selectedModel.retiresOn ? "Cloudflare plans to retire this model on November 20, 2026." : ""}</p>
                  {selectedModel.availabilityNote && <p className="text-xs text-amber-700 dark:text-amber-300">{selectedModel.availabilityNote}</p>}
                  <FormMessage />
                </FormItem>
              )} />
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between gap-3"><FormLabel>Your prompt</FormLabel><span className="text-xs text-muted-foreground">{promptLength}/400</span></div>
                    <FormControl>
                      <Textarea
                        placeholder="A tiny glass greenhouse on a misty mountain at sunrise…"
                        className="min-h-32 resize-y bg-background text-base"
                        disabled={isGenerating}
                        aria-invalid={!!form.formState.errors.prompt}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-wrap gap-2" aria-label="Prompt ideas">
                {ideas.map((idea) => (
                  <Button key={idea} type="button" variant="secondary" size="sm" disabled={isGenerating} onClick={() => form.setValue("prompt", idea, { shouldValidate: true })} className="h-auto whitespace-normal text-left">
                    {idea}
                  </Button>
                ))}
              </div>
              <Button type="submit" size="lg" disabled={isGenerating} className="w-full sm:w-auto sm:self-start">
                {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
                {isGenerating ? "Creating your image…" : "Generate image"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <section aria-labelledby="recent-images-heading">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 id="recent-images-heading" className="text-2xl font-semibold tracking-tight">Your recent images</h3>
            <p className="text-sm text-muted-foreground">The latest images you have created.</p>
          </div>
          <Button asChild variant="outline" size="sm"><Link href="/profile">View all <ArrowRight /></Link></Button>
        </div>
        {isLoadingImages ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Skeleton className="aspect-square rounded-2xl" /><Skeleton className="aspect-square rounded-2xl" /><Skeleton className="aspect-square rounded-2xl" /></div>
        ) : images.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{images.slice(0, 6).map((image) => <ImageCard key={image.id} image={image} />)}</div>
        ) : (
          <div className="surface-card p-10 text-center text-sm text-muted-foreground">Your first creation will appear here.</div>
        )}
      </section>
    </div>
  );
}
