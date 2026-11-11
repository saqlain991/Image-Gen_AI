import Image from "next/image";
import { Download } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IMAGE_MODELS } from "@/lib/image-models";

export type GalleryImage = {
  id: string;
  cloudinaryUrl: string;
  prompt: string;
  userName?: string | null;
  modelId?: string;
};

export function ImageCard({ image, showAuthor = false }: { image: GalleryImage; showAuthor?: boolean }) {
  const downloadUrl = image.cloudinaryUrl.replace("/image/upload/", "/image/upload/fl_attachment/");
  const modelName = IMAGE_MODELS.find((model) => model.id === image.modelId)?.name;
  return (
    <Card className="group overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-lg">
      <CardContent className="p-2">
        <div className="overflow-hidden rounded-xl bg-muted">
          <Image
            src={image.cloudinaryUrl}
            alt={image.prompt}
            width={600}
            height={600}
            unoptimized
            className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-3 px-4 pb-4 pt-2">
        <div className="min-w-0">
          {showAuthor && <p className="text-xs font-medium text-primary">by {image.userName || "Creator"}</p>}
          <p className="truncate text-sm font-medium" title={image.prompt}>{image.prompt}</p>
          {modelName && <p className="mt-1 text-xs text-muted-foreground">{modelName}</p>}
        </div>
        <Button asChild variant="ghost" size="icon" aria-label="Download image" className="shrink-0">
          <a href={downloadUrl} download><Download /></a>
        </Button>
      </CardFooter>
    </Card>
  );
}
