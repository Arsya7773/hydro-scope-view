import { useMemo } from "react";
import * as Slider from "@radix-ui/react-slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type FilterState = {
  year: "all" | number;
  month: "all" | number; // 1-12
  range: [number, number]; // indices into the (year/month) filtered list
};

type Props = {
  rows: { date: Date }[];
  value: FilterState;
  onChange: (v: FilterState) => void;
  filteredCount: number;
  totalCount: number;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const Filters = ({ rows, value, onChange, filteredCount, totalCount }: Props) => {
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
            onValueChange={(v) => onChange({ ...value, year: v === "all" ? "all" : Number(v), range: [0, 1] })}
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
            onValueChange={(v) => onChange({ ...value, month: v === "all" ? "all" : Number(v), range: [0, 1] })}
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

        <div className="flex-1 min-w-[260px]">
          <label className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground flex justify-between">
            <span>Date Range</span>
            <span className="num-mono text-[10px] text-foreground/80">
              {filteredCount.toLocaleString()} / {totalCount.toLocaleString()} pts
            </span>
          </label>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-7 mt-2"
            min={0}
            max={1}
            step={0.001}
            value={value.range}
            onValueChange={(v) => onChange({ ...value, range: [v[0], v[1]] as [number, number] })}
          >
            <Slider.Track className="bg-ocean-line relative grow h-[3px] rounded-full">
              <Slider.Range className="absolute h-full rounded-full bg-gradient-orange" />
            </Slider.Track>
            <Slider.Thumb className="block w-4 h-4 rounded-full bg-ocean-orange shadow-glow ring-2 ring-background focus:outline-none focus-visible:ring-ocean-orange-glow" />
            <Slider.Thumb className="block w-4 h-4 rounded-full bg-ocean-blue shadow-glow-blue ring-2 ring-background focus:outline-none focus-visible:ring-ocean-blue-glow" />
          </Slider.Root>
        </div>
      </div>
    </div>
  );
};

export default Filters;
