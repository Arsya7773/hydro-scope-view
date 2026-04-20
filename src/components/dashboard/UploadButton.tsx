import { useRef } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { CubeBadge } from "./CubeBadge";
import type { Row } from "@/lib/datasets";

type Props = {
  onLoaded: (rows: Row[], name: string) => void;
};

/**
 * Lets the user drop in any XLSX/CSV. We parse the first sheet client-side
 * with SheetJS and try to map common column names: time/date + one or two
 * numeric series. Missing/invalid rows are silently dropped.
 */
export const UploadButton = ({ onLoaded }: Props) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { cellDates: true });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
        defval: null,
      });
      if (!json.length) throw new Error("Empty sheet");

      const cols = Object.keys(json[0]);
      const lower = cols.map((c) => c.toLowerCase());
      const tIdx = lower.findIndex((c) =>
        ["time", "waktu", "date", "tanggal"].some((k) => c.includes(k))
      );
      if (tIdx < 0) throw new Error("No time/date column found");
      const numeric = cols.filter((_, i) => i !== tIdx).filter((c) =>
        json.slice(0, 20).some((r) => typeof r[c] === "number")
      );
      if (!numeric.length) throw new Error("No numeric column found");

      const tCol = cols[tIdx];
      const pCol = numeric[0];
      const sCol = numeric[1];

      const rows: Row[] = [];
      for (const r of json) {
        const tv = r[tCol];
        const d = tv instanceof Date ? tv : new Date(tv as string);
        if (!d || isNaN(+d)) continue;
        const primary = Number(r[pCol]);
        if (!Number.isFinite(primary)) continue;
        const secondary = sCol ? Number(r[sCol]) : NaN;
        rows.push({
          t: d.toISOString().slice(0, 10),
          date: d,
          primary,
          secondary: Number.isFinite(secondary) ? secondary : undefined,
        });
      }
      if (!rows.length) throw new Error("No valid rows parsed");
      rows.sort((a, b) => +a.date - +b.date);
      onLoaded(rows, file.name);
      toast.success(`Loaded ${rows.length.toLocaleString()} rows from ${file.name}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to parse file";
      toast.error(msg);
    }
  };

  return (
    <label className="cube-host group inline-flex items-center gap-3 cursor-pointer">
      <input
        ref={ref}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.currentTarget.value = "";
        }}
      />
      <span className="relative inline-flex items-center gap-2 rounded-xl border border-ocean-line bg-ocean-panel/80 px-4 py-2.5 text-sm font-medium text-foreground transition-all group-hover:border-ocean-orange/60 group-hover:shadow-glow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
        Upload / Change Data
      </span>
      <CubeBadge count={3} />
    </label>
  );
};

export default UploadButton;
