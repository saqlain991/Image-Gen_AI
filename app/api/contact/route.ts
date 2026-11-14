import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validation/contact';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = contactSchema.safeParse(body);
    if (!validated.success) return NextResponse.json({ error: 'Invalid contact details' }, { status: 400 });

    await db.contact.create({
      data: validated.data,
    });

    return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Could not send message' }, { status: 500 });
  }
}
