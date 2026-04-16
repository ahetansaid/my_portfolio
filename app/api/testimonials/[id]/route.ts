import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const testimonial = await prisma.testimonial.update({
    where: { id: Number(id) },
    data: {
      authorName: body.authorName,
      authorRole: body.authorRole ?? null,
      authorCompany: body.authorCompany ?? null,
      authorAvatar: body.authorAvatar ?? null,
      linkedinUrl: body.linkedinUrl ?? null,
      content: body.content,
      rating: Number(body.rating) || 5,
      isPublished: body.isPublished ?? false,
      sortOrder: body.sortOrder ?? 0,
    },
  });

  return NextResponse.json(testimonial);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const { id } = await params;
  await prisma.testimonial.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
