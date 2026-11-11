"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GalleryImage, ImageCard } from "@/components/image-card";

const pageSize = 9;

export default function ShowcasePage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(`/api/showcase?page=${page}&limit=${pageSize}`);
        if (!response.ok) throw new Error("Could not load images");
        const next: GalleryImage[] = await response.json();
        if (!cancelled) {
          setImages((previous) => page === 1 ? next : [...previous, ...next]);
          setHasMore(next.length === pageSize);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [page, retryKey]);

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Community gallery</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Made with imagination.</h1>
            <p className="mt-3 max-w-xl text-muted-foreground">Explore images created by the community. Every image began with a few words.</p>
          </div>
          <Button asChild><Link href="/">Create your own <ArrowRight /></Link></Button>
        </div>

        {loading && page === 1 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((item) => <Skeleton key={item} className="aspect-square rounded-2xl" />)}</div>
        ) : error && images.length === 0 ? (
          <div className="surface-card px-6 py-14 text-center">
            <p className="font-medium">We could not load the gallery.</p>
            <Button variant="outline" className="mt-4" onClick={() => setRetryKey((current) => current + 1)}>Try again</Button>
          </div>
        ) : images.length === 0 ? (
          <div className="surface-card flex flex-col items-center gap-4 px-6 py-14 text-center">
            <ImagePlus className="size-10 text-primary" />
            <div><h2 className="text-lg font-semibold">No images yet</h2><p className="text-sm text-muted-foreground">Be the first to share a creation.</p></div>
            <Button asChild><Link href="/">Start creating</Link></Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{images.map((image) => <ImageCard key={image.id} image={image} showAuthor />)}</div>
        )}

        {(hasMore || (error && images.length > 0)) && <div className="mt-8 flex justify-center"><Button variant="outline" disabled={loading} onClick={() => error ? setRetryKey((current) => current + 1) : setPage((current) => current + 1)}>{loading ? <Loader2 className="animate-spin" /> : null}{loading ? "Loading" : error ? "Try again" : "Load more"}</Button></div>}
      </div>
    </div>
  );
}
