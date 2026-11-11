import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { v2 as cloudinary } from "cloudinary";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { DAILY_FREE_NEURONS, DEFAULT_IMAGE_MODEL, getImageModel } from "@/lib/image-models";

type CloudflareImageResponse = {
  success?: boolean;
  result?: { image?: string };
  errors?: Array<{ code?: number; message?: string }>;
};

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Please sign in to generate an image" }, { status: 401 });
  }

  let body: { prompt?: unknown; modelId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof body?.prompt !== "string" || !body.prompt.trim() || body.prompt.trim().length > 400) {
    return NextResponse.json({ error: "Prompt must be between 1 and 400 characters" }, { status: 400 });
  }
  const model = getImageModel(body.modelId ?? DEFAULT_IMAGE_MODEL);
  if (!model) {
    return NextResponse.json({ error: "Choose an available image model" }, { status: 400 });
  }
  const prompt = body.prompt.trim();

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) {
    return NextResponse.json({ error: "Image service is not configured" }, { status: 503 });
  }

  try {
    const user = await db.user.findUnique({ where: { email: session.user.email }, select: { id: true, name: true, image: true } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const existing = await db.image.findUnique({
      where: { userId_prompt_modelId: { userId: user.id, prompt, modelId: model.id } },
    });
    if (existing) return NextResponse.json({ url: existing.cloudinaryUrl, modelId: model.id, reused: true });

    const today = new Date();
    const dayStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const used = await db.image.aggregate({ where: { createdAt: { gte: dayStart } }, _sum: { estimatedNeurons: true } });
    if (model.estimatedNeurons !== null && (used._sum.estimatedNeurons || 0) + model.estimatedNeurons > DAILY_FREE_NEURONS) {
      return NextResponse.json({ error: "The app's estimated Cloudflare free allowance is used for today. Try again after 00:00 UTC." }, { status: 429 });
    }

    const headers: Record<string, string> = { Authorization: `Bearer ${apiToken}` };
    let requestBody: string | FormData;
    if (model.format === "multipart") {
      const form = new FormData();
      form.set("prompt", prompt);
      for (const [key, value] of Object.entries(model.parameters)) form.set(key, String(value));
      requestBody = form;
    } else {
      headers["Content-Type"] = "application/json";
      requestBody = JSON.stringify({ prompt, ...model.parameters });
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${model.id}`,
      { method: "POST", headers, body: requestBody, cache: "no-store", signal: AbortSignal.timeout(120_000) }
    );
    const contentType = response.headers.get("content-type") || "";
    let imageDataUri: string | null = null;
    let payload: CloudflareImageResponse | null = null;
    if (contentType.includes("json")) {
      payload = (await response.json().catch(() => null)) as CloudflareImageResponse | null;
      const image = payload?.result?.image;
      if (response.ok && payload?.success && image) imageDataUri = image.startsWith("data:image/") ? image : `data:image/jpeg;base64,${image}`;
    } else if (response.ok && (contentType.startsWith("image/") || contentType.includes("octet-stream"))) {
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length) imageDataUri = `data:${contentType.startsWith("image/") ? contentType : "image/png"};base64,${bytes.toString("base64")}`;
    }

    if (!imageDataUri) {
      console.error("Cloudflare image generation failed", { model: model.id, status: response.status, errors: payload?.errors });
      const quotaReached = response.status === 429 || payload?.errors?.some((error) => error.code === 3036);
      const providerError = payload?.errors?.some((error) => error.code === 3043);
      return NextResponse.json({ error: quotaReached ? "Cloudflare's daily free quota is used. Try again after 00:00 UTC." : providerError ? "Cloudflare could not run this model right now. Try another model or retry later." : response.status === 401 || response.status === 403 ? "Cloudflare credentials or model access were rejected" : "Image service could not generate an image" }, { status: quotaReached ? 429 : 502 });
    }

    const uploaded = await cloudinary.uploader.upload(imageDataUri, { folder: "ai-generated" });
    await db.image.create({ data: {
      cloudinaryUrl: uploaded.secure_url, prompt, modelId: model.id,
      estimatedNeurons: model.estimatedNeurons,
      userId: user.id, userName: user.name || "", userAvatar: user.image || "",
    } });
    return NextResponse.json({ url: uploaded.secure_url, modelId: model.id, reused: false });
  } catch (error) {
    console.error("Error generating or uploading image:", error);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}
