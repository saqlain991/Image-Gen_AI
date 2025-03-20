import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";
import OpenAI from "openai";

const prisma = new PrismaClient();
const client = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: process.env.NEBIUS_API_KEY!,
});

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const session = await getServerSession(authOptions);
    
    // Check if userEmail exists, otherwise return an error
    const userEmail = session?.user?.email;
    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 });
    }

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Check if the image already exists
    const existingImage = await prisma.image.findFirst({
      where: { prompt },
    });

    if (existingImage) {
      return NextResponse.json({ url: existingImage.cloudinaryUrl });
    }

    // Generate image using Nebius AI API
    const response = await client.images.generate({
      model: "black-forest-labs/flux-dev",
      response_format: "url",
      prompt,
    });

    // Ensure that the image URL is a valid string before proceeding
    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
    }

    // Upload the image to Cloudinary
    const cloudinaryUploadResponse = await cloudinary.uploader.upload(imageUrl, {
      folder: "ai-generated",
    });

    // Get user from the database based on email
    const user = await prisma.user.findUnique({
      where: { email: userEmail }, // Use userEmail here
    });

    // If no user is found, return an error
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Save the image URL to the database
    await prisma.image.create({
      data: {
        cloudinaryUrl: cloudinaryUploadResponse.secure_url,
        prompt,
        userId: user?.id || null,
        userName: user?.name || "",
        userAvatar: user?.image || "",
      },
    });

    return NextResponse.json({ url: cloudinaryUploadResponse.secure_url });
  } catch (error) {
    console.error("Error generating or uploading image:", error);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}
