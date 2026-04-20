import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ComposedChart,
} from "recharts";
import { motion } from "framer-motion";
import { useMemo } from "react";
import type { Row } from "@/lib/datasets";
import { linreg, fmt } from "@/lib/stats";
import FancyTooltip from "./ChartTooltip";

type Props = {
  rows: Row[];
  unit: string;
  xLabel: string;
  yLabel: string;
};

export const ScatterChartCard = ({ rows, unit, xLabel, yLabel }: Props) => {
  const points = useMemo(
    () =>
      rows
        .filter((r) => Number.isFinite(r.primary) && r.secondary !== undefined && Number.isFinite(r.secondary))
        .map((r) => ({ x: r.secondary as number, y: r.primary, t: r.t })),
    [rows]
  );

  const reg = useMemo(() => linreg(points.map((p) => p.x), points.map((p) => p.y)), [points]);

  const line = useMemo(() => {
    if (!points.length || !Number.isFinite(reg.slope)) return [];
    let mn = Infinity;
    let mx = -Infinity;
    for (const p of points) {
      if (p.x < mn) mn = p.x;
      if (p.x > mx) mx = p.x;
    }
    return [
      { x: mn, y: reg.slope * mn + reg.intercept },
      { x: mx, y: reg.slope * mx + reg.intercept },
    ];
  }, [points, reg]);

  if (!points.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel p-5 grid place-items-center text-sm text-muted-foreground min-h-[280px]"
      >
        No paired values available for this dataset.
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="panel p-4 md:p-5"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="heading-display text-base md:text-lg text-foreground">Correlation</h3>
          <p className="text-xs text-muted-foreground">{xLabel} vs {yLabel} — linear fit</p>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="chip">slope <span className="num-mono ml-1 text-ocean-orange">{fmt.num(reg.slope, 3)}</span></span>
          <span className="chip">R² <span className="num-mono ml-1 text-ocean-blue">{fmt.num(reg.r2, 3)}</span></span>
        </div>
      </div>
      <div className="h-[280px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={undefined} margin={{ top: 10, right: 12, left: -8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 6" />
            <XAxis
              type="number"
              dataKey="x"
              name={xLabel}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(v) => v.toFixed(1)}
              label={{ value: `${xLabel} (${unit})`, position: "insideBottom", offset: -2, fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={yLabel}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(v) => v.toFixed(1)}
              width={42}
              label={{ value: yLabel, angle: -90, position: "insideLeft", offset: 16, fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <Tooltip cursor={{ strokeDasharray: "3 4", stroke: "hsl(var(--ocean-blue))" }} content={<FancyTooltip unit={unit} />} />
            <Scatter data={points} fill="hsl(var(--ocean-blue))" fillOpacity={0.55} shape="circle" isAnimationActive animationDuration={500} />
            <Line
              data={line}
              dataKey="y"
              stroke="hsl(var(--ocean-orange))"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              isAnimationActive={false}
              type="linear"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ScatterChartCard;
