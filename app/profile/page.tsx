"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageGallery } from "@/components/image-gallery";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/stripe", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to create checkout session");

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      toast.error("Failed to initiate upgrade");
    } finally {
      setIsLoading(false);
    }
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
              <Button onClick={handleUpgrade} disabled={isLoading}>
                Upgrade to Pro
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Generated Images</h2>
          <ImageGallery userId={session?.user?.id} />
        </div>
      </div>
    </div>
  );
}