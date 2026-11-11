"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Image from "next/image";
import img1 from "@/public/assets/image1.webp"

export function ImageGallery() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || "GUEST";

  const imagesPerRow = {
    GUEST: 2,
    FREE: 4,
    PRO: 8,
  }[userRole];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TODO: Implement image gallery with generated images */}
        <Card>
          <CardContent className="p-4">
            <div className="aspect-square relative overflow-hidden rounded-lg">
              <Image
                width={450}
                height={450}
                src={img1}
                alt="Generated image"
                className="object-cover"
              />
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.png" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">User Name</p>
                <p className="text-muted-foreground text-xs">Ironman coding in a laptop</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}