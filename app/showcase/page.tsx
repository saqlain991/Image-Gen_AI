"use client";

import { useEffect, useState } from "react";
import { ImageGallery } from "@/components/image-gallery";
import { Button } from "@/components/ui/button";

export default function ShowcasePage() {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Image Showcase</h1>
          <p className="text-muted-foreground">
            Explore amazing AI-generated images created by our community
          </p>
        </div>

        <ImageGallery />

        {hasMore && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}