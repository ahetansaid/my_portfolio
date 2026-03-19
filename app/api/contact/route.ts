import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const { name, email, subject, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Nom, email et message requis." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

  await prisma.contactMessage.create({
    data: { name, email, subject: subject ?? null, message },
  });

  return NextResponse.json({ ok: true });
}
