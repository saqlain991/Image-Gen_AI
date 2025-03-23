import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "9");

  const images = await db.image.findMany({
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const formatted = images.map((img:any) => ({
    id: img.id,
    cloudinaryUrl: img.cloudinaryUrl,
    prompt: img.prompt,
    userName: img.user?.name || "Anonymous",
    userAvatar: img.user?.image || "/placeholder-avatar.jpg",
  }));

  return NextResponse.json(formatted);
}
