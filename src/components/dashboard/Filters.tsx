import { useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type FilterState = {
  year: "all" | number;
  month: "all" | number; // 1-12
};

type Props = {
  rows: { date: Date }[];
  value: FilterState;
  onChange: (v: FilterState) => void;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const Filters = ({ rows, value, onChange }: Props) => {
  const years = useMemo(() => {
    const s = new Set<number>();
    for (const r of rows) s.add(r.date.getUTCFullYear());
    return Array.from(s).sort((a, b) => a - b);
  }, [rows]);

  return (
    <div className="panel p-4 md:p-5 flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5 min-w-[140px]">
          <label className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Year</label>
          <Select
            value={String(value.year)}
            onValueChange={(v) => onChange({ ...value, year: v === "all" ? "all" : Number(v) })}
          >
            <SelectTrigger className="w-[150px] bg-secondary/60 border-ocean-line">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All years</SelectItem>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[140px]">
          <label className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Month</label>
          <Select
            value={String(value.month)}
            onValueChange={(v) => onChange({ ...value, month: v === "all" ? "all" : Number(v) })}
          >
            <SelectTrigger className="w-[150px] bg-secondary/60 border-ocean-line">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All months</SelectItem>
              {MONTHS.map((m, i) => (
                <SelectItem key={m} value={String(i + 1)}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>


      </div>
    </div>
  );
};

export default Filters;
