import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as z from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  accessCode: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, accessCode } = registerSchema.parse(body);

    // Verify access code
    const validAccessCode = process.env.ACCESS_CODE;
    if (accessCode !== validAccessCode) {
      return NextResponse.json(
        { message: "Invalid access code" },
        { status: 403 }
      );
    }

    // Check if email exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "FREE",
      },
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}