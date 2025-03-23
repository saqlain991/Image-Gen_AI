"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Download } from "lucide-react";

type ShowcaseImage = {
  id: string;
  cloudinaryUrl: string;
  prompt: string;
  userName: string;
  userAvatar: string;
};

export default function ShowcasePage() {
  const [images, setImages] = useState<ShowcaseImage[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch images from server with pagination
  const fetchImages = async (currentPage: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/showcase?page=${currentPage}&limit=9`);
      if (res.ok) {
        const data = await res.json();
        if (data.length === 0) setHasMore(false);
        setImages((prev) => [...prev, ...data]);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to fetch showcase images", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(page);
  }, [page]);

  const handleDownload = (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-generated-image.png";
    a.click();
  };

  // Function to extract the first letter and capitalize it
  const getInitials = (name: string) => {
    const firstWord = name.split(" ")[0]; // Get first word of the name
    return firstWord.charAt(0).toUpperCase(); // Capitalize the first letter
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Image Showcase</h1>
          <p className="text-muted-foreground">
            Explore amazing AI-generated images created by our community
          </p>
        </div>

        {/* Image Grid */}
        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img) => (
              <Card key={img.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="aspect-square relative rounded-lg overflow-hidden">
                    <Image
                      width={450}
                      height={450}
                      src={img.cloudinaryUrl}
                      alt="Generated"
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={img.userAvatar || "/placeholder-avatar.png"} />
                      <AvatarFallback>
                        {getInitials(img.userName || "User")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm max-w-[150px] truncate">
                      <p className="font-medium">{img.userName || "User"}</p>
                      <p className="text-muted-foreground text-xs truncate">{img.prompt}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDownload(img.cloudinaryUrl)}>
                    <Download className="h-5 w-5" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No images to display</p>
        )}

        {/* Pagination Load More */}
        {hasMore && (
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
