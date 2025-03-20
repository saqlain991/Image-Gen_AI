import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { prompt } = body;

    // Check user's generation limits
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const generationLimits = {
      GUEST: 2,
      FREE: 5,
      PRO: Infinity,
    };

    if (
      user.generationCount >= generationLimits[user.role] &&
      user.role !== "PRO"
    ) {
      return NextResponse.json(
        { message: "Generation limit reached" },
        { status: 403 }
      );
    }

    // Check for existing image with same prompt
    const existingImage = await db.image.findFirst({
      where: {
        userId: session.user.id,
        prompt,
      },
    });

    if (existingImage) {
      return NextResponse.json({ image: existingImage });
    }

    // Generate image using Nebius AI
    // TODO: Implement Nebius AI integration
    const imageBuffer = await generateImageWithNebius(prompt);

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(imageBuffer, {
      folder: "ai-generated",
    });

    // Save to database
    const image = await db.image.create({
      data: {
        cloudinaryUrl: uploadResponse.secure_url,
        prompt,
        userId: session.user.id,
        userName: session.user.name || "",
        userAvatar: session.user.image || "",
      },
    });

    // Update user's generation count
    await db.user.update({
      where: { id: session.user.id },
      data: { generationCount: { increment: 1 } },
    });

    return NextResponse.json({ image });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { message: "Failed to generate image" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where = userId ? { userId } : {};

    const images = await db.image.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    const total = await db.image.count({ where });

    return NextResponse.json({
      images,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { message: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

// TODO: Implement Nebius AI integration
async function generateImageWithNebius(prompt: string): Promise<string> {
  // Placeholder for Nebius AI implementation
  throw new Error("Nebius AI integration not implemented");
}