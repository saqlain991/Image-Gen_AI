import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
  const limit = Math.min(24, Math.max(1, parseInt(searchParams.get("limit") || "9") || 9));

  const images = await db.image.findMany({
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const formatted = images.map((img) => ({
    id: img.id,
    cloudinaryUrl: img.cloudinaryUrl,
    prompt: img.prompt,
    modelId: img.modelId,
    userName: img.user?.name || "Anonymous",
    userAvatar: img.user?.image || "/placeholder-avatar.png",
  }));

  return NextResponse.json(formatted);
}
