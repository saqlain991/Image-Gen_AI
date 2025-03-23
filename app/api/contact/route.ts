import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
import { PrismaClient } from "@prisma/client";
import { contactSchema } from '@/lib/validation/contact';
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = contactSchema.parse(body);

    await prisma.contact.create({
      data: validated,
    });

    return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
