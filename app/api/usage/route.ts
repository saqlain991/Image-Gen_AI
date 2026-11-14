import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { DAILY_FREE_NEURONS } from "@/lib/image-models";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const now = new Date();
  const dayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const [usage, untrackedImages, yourImagesToday] = await Promise.all([
    db.image.aggregate({ where: { createdAt: { gte: dayStart } }, _sum: { estimatedNeurons: true } }),
    db.image.count({ where: { createdAt: { gte: dayStart }, estimatedNeurons: null } }),
    db.image.count({ where: { userId: user.id, createdAt: { gte: dayStart } } }),
  ]);

  return NextResponse.json({
    estimatedAppNeuronsToday: Math.round((usage._sum.estimatedNeurons || 0) * 100) / 100,
    freeNeuronsPerDay: DAILY_FREE_NEURONS,
    untrackedImages,
    yourImagesToday,
    resetsAt: new Date(dayStart.getTime() + 86_400_000).toISOString(),
    source: "app-estimate",
  }, { headers: { "Cache-Control": "no-store" } });
}
