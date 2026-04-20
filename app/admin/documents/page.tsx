"use client";

import { useEffect, useRef, useState } from "react";

type Document = {
  id: number;
  type: string;
  filename: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  updatedAt: string;
};

const SLOTS = [
  { type: "cv-fr", label: "CV — Français", flag: "🇫🇷" },
  { type: "cv-en", label: "CV — English", flag: "🇬🇧" },
] as const;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/admin/documents");
    if (res.ok) setDocs(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (type: string, file: File) => {
    setLoadingType(type);
    setError(null);
    setMessage(null);

    try {
      if (file.type !== "application/pdf") {
        throw new Error("Le fichier doit être au format PDF.");
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Le fichier dépasse 5 MB.");
      }

      const formData = new FormData();
      formData.append("type", type);
      formData.append("file", file);

      const res = await fetch("/api/admin/documents", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erreur lors de l'upload.");
      }

      setMessage(`✓ ${type.toUpperCase()} mis à jour avec succès.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoadingType(null);
    }
  };

  const handleDelete = async (type: string) => {
    if (!confirm(`Supprimer le document ${type.toUpperCase()} ?`)) return;
    setLoadingType(type);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/documents/${type}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression.");
      setMessage(`✓ ${type.toUpperCase()} supprimé.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-[hsl(var(--color-foreground))]">
          Documents
        </h1>
        <p className="mt-1 text-sm text-[hsl(var(--color-muted))]">
          Upload et gestion des fichiers PDF (CV FR + EN). Max 5 MB par fichier. Stockés en base
          de données.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {SLOTS.map((slot) => {
          const doc = docs.find((d) => d.type === slot.type);
          const loading = loadingType === slot.type;

          return (
            <DocumentSlot
              key={slot.type}
              slot={slot}
              doc={doc}
              loading={loading}
              onUpload={handleUpload}
              onDelete={handleDelete}
            />
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface-muted))]/40 p-5 text-xs text-[hsl(var(--color-muted))]">
        <p className="mb-2 font-semibold text-[hsl(var(--color-foreground))]">ℹ️ Comment ça marche</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Les fichiers PDF sont stockés directement dans la base PostgreSQL (Neon)</li>
          <li>Accessible publiquement via <code className="rounded bg-[hsl(var(--color-surface))] px-1">/api/documents/cv-fr</code></li>
          <li>La page publique <code className="rounded bg-[hsl(var(--color-surface))] px-1">/cv</code> détecte automatiquement les fichiers présents</li>
          <li>Remplace le PDF à tout moment — la page publique se met à jour immédiatement</li>
        </ul>
      </div>
    </div>
  );
}

function DocumentSlot({
  slot,
  doc,
  loading,
  onUpload,
  onDelete,
}: {
  slot: { type: string; label: string; flag: string };
  doc: Document | undefined;
  loading: boolean;
  onUpload: (type: string, file: File) => void;
  onDelete: (type: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File | null | undefined) => {
    if (!file) return;
    onUpload(slot.type, file);
  };

  return (
    <div className="rounded-2xl border border-[hsl(var(--color-surface-muted))] bg-[hsl(var(--color-surface))] p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-2xl">{slot.flag}</span>
        <div>
          <h2 className="font-display font-bold text-[hsl(var(--color-foreground))]">
            {slot.label}
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--color-muted))]">
            /api/documents/{slot.type}
          </p>
        </div>
        {doc && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            En ligne
          </span>
        )}
      </div>

      {doc ? (
        <div className="space-y-3">
          <div className="rounded-lg bg-[hsl(var(--color-surface-muted))]/60 p-3 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-[hsl(var(--color-foreground))] truncate">
                📄 {doc.filename}
              </span>
              <span className="text-[hsl(var(--color-muted))] shrink-0">
                {formatSize(doc.size)}
              </span>
            </div>
            <div className="mt-1 text-[hsl(var(--color-muted))]">
              Mis à jour le {formatDate(doc.updatedAt)}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={`/api/documents/${slot.type}`}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[hsl(var(--color-accent))]/30 bg-[hsl(var(--color-accent))]/10 px-3 py-1.5 text-xs font-semibold text-[hsl(var(--color-accent))] hover:bg-[hsl(var(--color-accent))]/20 transition"
            >
              👁 Consulter
            </a>
            <a
              href={`/api/documents/${slot.type}?download=1`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[hsl(var(--color-surface-muted))] px-3 py-1.5 text-xs font-semibold text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-surface-muted))] transition"
            >
              ⬇ Télécharger
            </a>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[hsl(var(--color-accent-warm))]/30 bg-[hsl(var(--color-accent-warm))]/10 px-3 py-1.5 text-xs font-semibold text-[hsl(var(--color-accent-warm))] hover:bg-[hsl(var(--color-accent-warm))]/20 transition disabled:opacity-60"
            >
              🔄 Remplacer
            </button>
            <button
              type="button"
              onClick={() => onDelete(slot.type)}
              disabled={loading}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition disabled:opacity-60"
            >
              🗑 Supprimer
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={`file-${slot.type}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
            dragOver
              ? "border-[hsl(var(--color-accent))] bg-[hsl(var(--color-accent))]/5"
              : "border-[hsl(var(--color-surface-muted))] hover:border-[hsl(var(--color-accent))]/50 hover:bg-[hsl(var(--color-surface-muted))]/40"
          }`}
        >
          <div className="text-3xl">📄</div>
          <div className="mt-2 text-sm font-semibold text-[hsl(var(--color-foreground))]">
            {loading ? "Upload en cours…" : "Déposer ou cliquer pour uploader"}
          </div>
          <div className="mt-1 text-[11px] text-[hsl(var(--color-muted))]">PDF uniquement · max 5 MB</div>
        </label>
      )}

      <input
        ref={inputRef}
        id={`file-${slot.type}`}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
