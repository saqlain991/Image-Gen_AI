import { ImageGenerator } from "@/components/image-generator";
import { ImageGallery } from "@/components/image-gallery";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">AI Image Generator</h1>
          <p className="text-muted-foreground">
            Transform your ideas into stunning images using AI
          </p>
        </div>
        <ImageGenerator />
        {/* <ImageGallery /> */}
      </div>
    </div>
  );
}