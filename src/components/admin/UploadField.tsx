"use client";
import { useState } from "react";
import { FileText, Loader2, Upload, X } from "lucide-react";

type Props = {
  label: string;
  value: string;
  folder: "products" | "posts" | "gallery" | "pages" | "site";
  accept?: string;
  onChange: (url: string) => void;
};

export default function UploadField({ label, value, folder, accept = "image/*", onChange }: Props) {
  const [uploading, setUploading] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const j = await r.json();
      if (r.ok && j.url) onChange(j.url);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const isPdf = value?.toLowerCase().endsWith(".pdf");

  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex flex-wrap items-center gap-3">
        {value && (
          <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            {isPdf ? (
              <div className="flex h-full items-center justify-center gap-1 text-xs font-semibold text-navy-900">
                <FileText className="h-5 w-5 text-brand-500" /> PDF
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" className="h-full w-full object-cover" />
            )}
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-1 right-1 grid h-5 w-5 place-items-center rounded-full bg-navy-950/80 text-white hover:bg-red-600"
              title="Remove"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="/uploads/..." className="input min-w-[200px] flex-1" />
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-navy-900 hover:bg-slate-100">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 text-brand-600" />}
            Upload
            <input type="file" accept={accept} onChange={onFile} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
}
