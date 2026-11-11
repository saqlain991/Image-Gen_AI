"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GalleryImage, ImageCard } from "@/components/image-card";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/user-images", { cache: "no-store" });
        if (!response.ok) throw new Error("Could not load images");
        const data = await response.json();
        if (!cancelled) setImages(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [status]);

  if (status === "loading") return <div className="page-shell mx-auto max-w-6xl"><Skeleton className="h-72 rounded-3xl" /></div>;

  if (status === "unauthenticated") {
    return <div className="page-shell mx-auto max-w-3xl"><div className="surface-card p-10 text-center"><h1 className="text-2xl font-semibold">Sign in to see your gallery</h1><Button asChild className="mt-5"><Link href="/login">Sign in</Link></Button></div></div>;
  }

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Your space</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">My gallery</h1>
            <p className="mt-3 text-muted-foreground">All the ideas you have brought to life.</p>
          </div>
          <Button asChild><Link href="/">Create another <ArrowRight /></Link></Button>
        </div>

        <div className="surface-card mb-10 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">{session?.user?.name || "Creator"}</p>
            <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
          </div>
          <div className="flex items-center gap-3 text-sm"><span className="rounded-full bg-secondary px-3 py-1 font-medium text-secondary-foreground">Cloudflare AI</span><span className="text-muted-foreground">{images.length} images</span></div>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((item) => <Skeleton key={item} className="aspect-square rounded-2xl" />)}</div>
        ) : error ? (
          <div className="surface-card p-10 text-center text-muted-foreground">Could not load your images. Refresh the page to try again.</div>
        ) : images.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{images.map((image) => <ImageCard key={image.id} image={image} />)}</div>
        ) : (
          <div className="surface-card flex flex-col items-center gap-4 p-12 text-center"><ImagePlus className="size-9 text-primary" /><h2 className="text-xl font-semibold">Your gallery is empty</h2><p className="text-sm text-muted-foreground">Create your first image to see it here.</p><Button asChild><Link href="/">Start creating</Link></Button></div>
        )}
      </div>
    </div>
  );
}
