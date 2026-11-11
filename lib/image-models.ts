export const DAILY_FREE_NEURONS = 10_000;

export type ImageModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
  format: "json" | "multipart";
  parameters: Record<string, number>;
  estimatedNeurons: number | null;
  retiresOn?: string;
  availabilityNote?: string;
};

// Fixed settings make the per-image estimates comparable. Cloudflare can change
// pricing or actual usage; the dashboard remains the source of truth.
export const IMAGE_MODELS: ImageModel[] = [
  { id: "@cf/black-forest-labs/flux-1-schnell", name: "FLUX.1 Schnell", provider: "Black Forest Labs", description: "Fast, versatile images", format: "json", parameters: { steps: 4 }, estimatedNeurons: 43.2 },
  { id: "@cf/black-forest-labs/flux-2-klein-4b", name: "FLUX.2 Klein 4B", provider: "Black Forest Labs", description: "Fast, detailed results", format: "multipart", parameters: { width: 512, height: 512 }, estimatedNeurons: 26.05 },
  { id: "@cf/black-forest-labs/flux-2-klein-9b", name: "FLUX.2 Klein 9B", provider: "Black Forest Labs", description: "Higher detail, larger quota use", format: "multipart", parameters: { width: 1024, height: 1024 }, estimatedNeurons: 1363.64, availabilityNote: "Cloudflare returned an internal error for this model during validation; it may be temporarily unavailable." },
  { id: "@cf/black-forest-labs/flux-2-dev", name: "FLUX.2 Dev", provider: "Black Forest Labs", description: "Detailed, realistic images", format: "multipart", parameters: { width: 512, height: 512, steps: 20 }, estimatedNeurons: 750 },
  { id: "@cf/leonardo/phoenix-1.0", name: "Phoenix 1.0", provider: "Leonardo", description: "Strong prompt and text rendering", format: "json", parameters: { width: 512, height: 512, num_steps: 20 }, estimatedNeurons: 730 },
  { id: "@cf/leonardo/lucid-origin", name: "Lucid Origin", provider: "Leonardo", description: "Flexible, polished visuals", format: "json", parameters: { width: 512, height: 512, num_steps: 20 }, estimatedNeurons: 876 },
  { id: "@cf/lykon/dreamshaper-8-lcm", name: "DreamShaper 8 LCM", provider: "lykon", description: "Photorealistic legacy model", format: "json", parameters: { width: 512, height: 512, num_steps: 4 }, estimatedNeurons: null, retiresOn: "2026-11-20" },
  { id: "@cf/stabilityai/stable-diffusion-xl-base-1.0", name: "Stable Diffusion XL", provider: "Stability AI", description: "Classic diffusion model", format: "json", parameters: { width: 512, height: 512, num_steps: 20 }, estimatedNeurons: null, retiresOn: "2026-11-20" },
  { id: "@cf/bytedance/stable-diffusion-xl-lightning", name: "SDXL Lightning", provider: "ByteDance", description: "Quick diffusion images", format: "json", parameters: { width: 512, height: 512, num_steps: 4 }, estimatedNeurons: null, retiresOn: "2026-11-20" },
];

export const DEFAULT_IMAGE_MODEL = IMAGE_MODELS[0].id;

export function getImageModel(id: unknown) {
  return IMAGE_MODELS.find((model) => model.id === id && (!model.retiresOn || Date.now() < Date.parse(`${model.retiresOn}T00:00:00Z`)));
}
