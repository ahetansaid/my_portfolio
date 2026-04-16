import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const bookings = await prisma.booking.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(bookings);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, company, phone, topic, message, preferredDate, duration } = body;

  if (!name || !email || !topic) {
    return NextResponse.json({ error: "Nom, email et sujet requis." }, { status: 400 });
  }

  const booking = await prisma.booking.create({
    data: {
      name,
      email,
      company: company ?? null,
      phone: phone ?? null,
      topic,
      message: message ?? null,
      preferredDate: preferredDate ? new Date(preferredDate) : null,
      duration: Number(duration) || 30,
    },
  });

  return NextResponse.json(booking, { status: 201 });
}
