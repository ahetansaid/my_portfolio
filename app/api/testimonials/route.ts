import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "1";
  const session = all ? await getSession() : null;

  const testimonials = await prisma.testimonial.findMany({
    where: all && session ? {} : { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(testimonials);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    authorName,
    authorRole,
    authorCompany,
    authorAvatar,
    linkedinUrl,
    content,
    rating,
    isPublished,
    sortOrder,
  } = body;

  if (!authorName || !content) {
    return NextResponse.json({ error: "Nom et contenu requis." }, { status: 400 });
  }

  const session = await getSession();

  const testimonial = await prisma.testimonial.create({
    data: {
      authorName,
      authorRole: authorRole ?? null,
      authorCompany: authorCompany ?? null,
      authorAvatar: authorAvatar ?? null,
      linkedinUrl: linkedinUrl ?? null,
      content,
      rating: Number(rating) || 5,
      isPublished: session ? isPublished ?? false : false,
      sortOrder: sortOrder ?? 0,
    },
  });

  return NextResponse.json(testimonial, { status: 201 });
}
