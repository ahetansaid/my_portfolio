import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set(["cv-fr", "cv-en"]);
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = new Set(["application/pdf"]);

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const docs = await prisma.document.findMany({
    select: {
      id: true,
      type: true,
      filename: true,
      mimeType: true,
      size: true,
      uploadedAt: true,
      updatedAt: true,
    },
    orderBy: { type: "asc" },
  });
  return NextResponse.json(docs);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const formData = await request.formData();
  const type = formData.get("type");
  const file = formData.get("file");

  if (typeof type !== "string" || !ALLOWED_TYPES.has(type)) {
    return NextResponse.json(
      { error: `Type invalide. Valeurs attendues : ${[...ALLOWED_TYPES].join(", ")}` },
      { status: 400 }
    );
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant ou invalide." }, { status: 400 });
  }

  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      { error: `Format refusé. PDF uniquement (reçu : ${file.type}).` },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: `Fichier trop volumineux. Max 5 MB (reçu ${(file.size / 1_048_576).toFixed(2)} MB).` },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const doc = await prisma.document.upsert({
    where: { type },
    create: {
      type,
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      data: buffer,
    },
    update: {
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      data: buffer,
    },
    select: {
      id: true,
      type: true,
      filename: true,
      mimeType: true,
      size: true,
      uploadedAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(doc, { status: 201 });
}
