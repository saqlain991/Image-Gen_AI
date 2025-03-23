"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Download } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ProfileFetchImage = {
  id: string;
  cloudinaryUrl: string;
  prompt: string;
  userName: string;
  userAvatar: string;
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const [images, setImages] = useState<ProfileFetchImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Assuming you get this from your API

  // Fetch images from the database (API route)
   // Fetch images from database (API route)
   const fetchImages = async () => {
    try {
      const res = await fetch("/api/user-images");
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      } else {
        console.error("Failed to fetch images");
      }
    } catch (err) {
      console.error("Error fetching images", err);
    }
  };

  useEffect(() => {
    if (session) fetchImages();
  }, [session]);

   // Function to extract the first letter and capitalize it
   const getInitials = (name: string) => {
    const firstWord = name.split(" ")[0]; // Get first word of the name
    return firstWord.charAt(0).toUpperCase(); // Capitalize the first letter
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Account Details</h3>
              <p className="text-sm text-muted-foreground">
                Name: {session?.user?.name}
              </p>
              <p className="text-sm text-muted-foreground">
                Email: {session?.user?.email}
              </p>
              <p className="text-sm text-muted-foreground">
                Plan: {session?.user?.role}
              </p>
            </div>

            {session?.user?.role !== "PRO" && (
              <Button onClick={() => toast.success("Upgraded to Pro!")}>
                Upgrade to Pro
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Generated Images</h2>
          
          {/* Ensure images is an array and has content */}
          {Array.isArray(images) && images.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img) => (
                <Card key={img.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="aspect-square relative rounded-lg overflow-hidden">
                      <Image
                        width={450}
                        height={450}
                        src={img.cloudinaryUrl}
                        alt="Generated image"
                        className="object-cover w-full h-full pointer-events-none"
                        unoptimized
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={img.userAvatar || ""} />
                        <AvatarFallback>{getInitials(img.userName || "User")}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm max-w-[150px] truncate">
                        <p className="font-medium">{img.userName || "User"}</p>
                        <p className="text-muted-foreground text-xs truncate">{img.prompt}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href = img.cloudinaryUrl;
                        a.download = "generated-image.png";
                        a.click();
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p>No images found</p>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
