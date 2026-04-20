import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ type: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { type } = await params;

  const doc = await prisma.document.findUnique({
    where: { type },
    select: {
      filename: true,
      mimeType: true,
      size: true,
      data: true,
      updatedAt: true,
    },
  });

  if (!doc) {
    return new Response("Document not found", { status: 404 });
  }

  const url = new URL(request.url);
  const download = url.searchParams.get("download") === "1";

  const headers = new Headers({
    "Content-Type": doc.mimeType,
    "Content-Length": doc.size.toString(),
    "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${encodeURIComponent(doc.filename)}"`,
    "Cache-Control": "public, max-age=0, must-revalidate",
    "Last-Modified": doc.updatedAt.toUTCString(),
  });

  const body = new Uint8Array(doc.data);
  return new Response(body, { headers });
}

export async function HEAD(_: NextRequest, { params }: Params) {
  const { type } = await params;

  const doc = await prisma.document.findUnique({
    where: { type },
    select: { mimeType: true, size: true, updatedAt: true },
  });

  if (!doc) {
    return new Response(null, { status: 404 });
  }

  return new Response(null, {
    status: 200,
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Length": doc.size.toString(),
      "Last-Modified": doc.updatedAt.toUTCString(),
    },
  });
}
