import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { histogram, pairedHistogram } from "@/lib/stats";
import { type Row } from "@/lib/datasets";
import FancyTooltip from "./ChartTooltip";

type Props = {
  rows: Row[];
  unit: string;
  label: string;
  bins?: number;
  isPaired?: boolean;
};

export const HistogramCard = ({ rows, unit, label, bins = 24, isPaired = false }: Props) => {
  const data = useMemo(() => {
    if (isPaired) {
      // Paired histogram: observation vs satellite
      const primaryVals = rows.map((r) => r.primary);
      const secondaryVals = rows.map((r) => (r.secondary ?? NaN) as number);
      const h = pairedHistogram(primaryVals, secondaryVals, bins);
      return h.map((b) => ({
        bin: `${b.lo.toFixed(1)}`,
        mid: b.mid,
        observation: b.observation,
        satellite: b.satellite,
        range: `${b.lo.toFixed(2)} – ${b.hi.toFixed(2)} ${unit}`,
      }));
    } else {
      // Single histogram: just primary values
      const primaryVals = rows.map((r) => r.primary);
      const h = histogram(primaryVals, bins);
      return h.map((b) => ({
        bin: `${Math.round(b.lo)}`,
        mid: b.mid,
        count: b.count,
        range: `${Math.round(b.lo)} – ${Math.round(b.hi)} ${unit}`,
      }));
    }
  }, [rows, bins, unit, isPaired]);

  const maxC = useMemo(() => {
    if (isPaired) {
      return data.reduce((m, d) => Math.max(m, (d as any).observation + (d as any).satellite), 0);
    } else {
      return data.reduce((m, d) => Math.max(m, (d as any).count), 0);
    }
  }, [data, isPaired]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="panel p-4 md:p-5"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="heading-display text-base md:text-lg text-foreground">Distribution</h3>
          <p className="text-xs text-muted-foreground">Frequency of {label.toLowerCase()} values</p>
        </div>
        <span className="chip">{rows.length.toLocaleString()} samples</span>
      </div>
      <div className="h-[280px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 6" vertical={false} />
            <XAxis 
              dataKey="range" 
              stroke="hsl(var(--muted-foreground))" 
              interval={Math.max(0, Math.floor(data.length / 8) - 1)}
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              width={40}
              label={{ value: "Frequency (Count)", angle: -90, position: "insideLeft", offset: 10, fontSize: 10 }}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--ocean-orange) / .08)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0].payload as any;
                if (isPaired) {
                  return (
                    <div className="panel pointer-events-none px-3 py-2 animate-fade-in space-y-1">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{p.range}</div>
                      <div className="num-mono text-orange-500 text-sm">
                        Obs: {p.observation?.toLocaleString() ?? "0"} <span className="text-muted-foreground text-xs">samples</span>
                      </div>
                      <div className="num-mono text-ocean-blue text-sm">
                        Sat: {p.satellite?.toLocaleString() ?? "0"} <span className="text-muted-foreground text-xs">samples</span>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="panel pointer-events-none px-3 py-2 animate-fade-in">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{p.range}</div>
                      <div className="num-mono mt-1 text-foreground">{p.count?.toLocaleString() ?? "0"} <span className="text-muted-foreground text-xs">samples</span></div>
                    </div>
                  );
                }
              }}
            />
            {isPaired ? (
              <>
                <Bar dataKey="observation" radius={[4, 4, 0, 0]} fillOpacity={0.8} isAnimationActive animationDuration={650} fill="hsl(22 96% 56%)">
                  {data.map((_, i) => (
                    <Cell key={`obs-${i}`} fill="hsl(22 96% 56% / 0.85)" />
                  ))}
                </Bar>
                <Bar dataKey="satellite" radius={[4, 4, 0, 0]} fillOpacity={0.8} isAnimationActive animationDuration={650} fill="hsl(205 95% 58%)">
                  {data.map((_, i) => (
                    <Cell key={`sat-${i}`} fill="hsl(205 95% 58% / 0.85)" />
                  ))}
                </Bar>
              </>
            ) : (
              <Bar dataKey="count" radius={[6, 6, 2, 2]} fillOpacity={0.85} isAnimationActive animationDuration={650}>
                {data.map((d, i) => {
                  const t = maxC ? (d as any).count / maxC : 0;
                  // Blend orange -> blue based on bin position for a wave look
                  const hue = 22 + (205 - 22) * (i / Math.max(1, data.length - 1));
                  const color = `hsl(${hue} 90% ${52 - t * 8}%)`;
                  return <Cell key={i} fill={color} />;
                })}
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default HistogramCard;
