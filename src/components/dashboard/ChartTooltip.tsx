import type { TooltipProps } from "recharts";

type Datum = {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string;
  payload?: Record<string, unknown>;
};

type Props = TooltipProps<number, string> & {
  unit?: string;
  labelFormatter?: (l: unknown) => string;
};

export const FancyTooltip = ({ active, payload, label, unit, labelFormatter }: Props) => {
  if (!active || !payload || !payload.length) return null;
  const items = payload as unknown as Datum[];
  return (
    <div className="panel pointer-events-none px-3.5 py-2.5 min-w-[180px] animate-fade-in">
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {labelFormatter ? labelFormatter(label) : String(label ?? "")}
      </div>
      <div className="mt-1.5 space-y-1">
        {items.map((it, i) => (
          <div key={i} className="flex items-center justify-between gap-4 text-xs">
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ background: it.color ?? "#fff" }}
              />
              <span className="text-muted-foreground">{it.name ?? it.dataKey}</span>
            </span>
            <span className="num-mono text-foreground">
              {typeof it.value === "number" ? it.value.toFixed(3) : String(it.value)}
              {unit ? <span className="text-muted-foreground ml-1">{unit}</span> : null}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FancyTooltip;
