"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(400),
});

type GeneratedImage = {
  id: string;
  cloudinaryUrl: string;
  prompt: string;
  userName: string;
  userAvatar: string;
};

export function ImageGenerator() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/generate-image", {
        method: "POST",
        body: JSON.stringify({ prompt: values.prompt }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Image generated successfully!");
        form.reset();
        fetchImages(); // Re-fetch images after new generation
      } else {
        toast.error(data.error || "Failed to generate image");
      }
    } catch {
      toast.error("Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  };

   // Function to extract the first letter and capitalize it
   const getInitials = (name: string) => {
    const firstWord = name.split(" ")[0]; // Get first word of the name
    return firstWord.charAt(0).toUpperCase(); // Capitalize the first letter
  };

  if (!session) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <p className="text-muted-foreground">Please sign in to generate images</p>
        <Button className="mt-4" asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Describe the image you want to generate..."
                  className="h-24 resize-none"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Image
        </Button>
      </form>

      {/* //Here is the generated Image */}
      {images.length > 0 && (
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
                    <AvatarImage src={img.userAvatar || "/placeholder-avatar.png"} />
                    <AvatarFallback> {getInitials(img.userName || "User")}</AvatarFallback>
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
      )}
      <div className="flex justify-center items-center ">
      <Link href="showcase" target="_blank">
      <Button>View Other&apos;s Creativity</Button>
      </Link>
    </div>
    </Form>
  );
}
