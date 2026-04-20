import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Label } from "recharts";
import { motion } from "framer-motion";
import { useMemo } from "react";
import type { Row } from "@/lib/datasets";
import { linreg, clean } from "@/lib/stats";

type Props = {
  rows: Row[];
  delay?: number;
};

export const WindDirectionAnalysis = ({ rows, delay = 0 }: Props) => {
  const data = useMemo(() => {
    return rows
      .filter(
        (r) =>
          Number.isFinite(r.primary) &&
          r.extra?.u10 !== undefined &&
          Number.isFinite(r.extra.u10) &&
          r.extra.v10 !== undefined &&
          Number.isFinite(r.extra.v10)
      )
      .map((r) => ({
        u10: r.extra!.u10,
        v10: r.extra!.v10,
        t: r.t,
      }));
  }, [rows]);

  const regression = useMemo(() => {
    if (data.length < 2) return { slope: NaN, intercept: NaN, r2: NaN };
    const u10s = data.map((d) => d.u10);
    const v10s = data.map((d) => d.v10);
    return linreg(u10s, v10s);
  }, [data]);

  const quadrants = useMemo(() => {
    if (data.length === 0) return { ne: 0, nw: 0, sw: 0, se: 0 };
    let ne = 0,
      nw = 0,
      sw = 0,
      se = 0;
    for (const d of data) {
      if (d.u10 > 0 && d.v10 > 0) ne++;
      else if (d.u10 < 0 && d.v10 > 0) nw++;
      else if (d.u10 < 0 && d.v10 < 0) sw++;
      else if (d.u10 > 0 && d.v10 < 0) se++;
    }
    const total = data.length;
    return {
      ne: total > 0 ? ((ne / total) * 100).toFixed(1) : "0",
      nw: total > 0 ? ((nw / total) * 100).toFixed(1) : "0",
      sw: total > 0 ? ((sw / total) * 100).toFixed(1) : "0",
      se: total > 0 ? ((se / total) * 100).toFixed(1) : "0",
    };
  }, [data]);

  const u10Range = useMemo(() => {
    if (data.length === 0) return { min: -10, max: 10 };
    const u10s = clean(data.map((d) => d.u10));
    const minVal = Math.min(...u10s);
    const maxVal = Math.max(...u10s);
    const padding = (maxVal - minVal) * 0.15;
    return {
      min: Math.floor(minVal - padding),
      max: Math.ceil(maxVal + padding),
    };
  }, [data]);

  const v10Range = useMemo(() => {
    if (data.length === 0) return { min: -10, max: 10 };
    const v10s = clean(data.map((d) => d.v10));
    const minVal = Math.min(...v10s);
    const maxVal = Math.max(...v10s);
    const padding = (maxVal - minVal) * 0.15;
    return {
      min: Math.floor(minVal - padding),
      max: Math.ceil(maxVal + padding),
    };
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="panel p-4 md:p-5"
    >
      <div className="mb-3">
        <h3 className="heading-display text-base md:text-lg text-foreground">Wind Direction Analysis</h3>
        <p className="text-xs text-muted-foreground mt-1">u10 (Zonal) vs v10 (Meridional) components</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Scatter Plot */}
        <div className="lg:col-span-2 h-[300px] md:h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 16, left: -12, bottom: 40 }}>
              <defs>
                <radialGradient id="wind-scatter">
                  <stop offset="0%" stopColor="hsl(205 95% 58%)" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="hsl(205 95% 58%)" stopOpacity={0.3} />
                </radialGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" vertical={true} horizontalPoints={[0]} />
              <XAxis
                dataKey="u10"
                name="u10 (Zonal)"
                type="number"
                domain={[u10Range.min, u10Range.max]}
                stroke="hsl(var(--muted-foreground))"
                label={{ value: "u10 (Zonal Wind) [m/s]", position: "bottom", offset: 10, fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <YAxis
                dataKey="v10"
                name="v10 (Meridional)"
                type="number"
                domain={[v10Range.min, v10Range.max]}
                stroke="hsl(var(--muted-foreground))"
                label={{ value: "v10 (Meridional) [m/s]", angle: -90, position: "insideLeft", offset: 10, fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--ocean-blue) / 0.1)" }}
                contentStyle={{ backgroundColor: "hsl(var(--panel))", border: "1px solid hsl(var(--ocean-line))", borderRadius: "8px" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload as any;
                  return (
                    <div className="p-2 text-xs space-y-1">
                      <div className="text-muted-foreground">{new Date(d.t).toLocaleDateString()}</div>
                      <div className="num-mono text-foreground">u10: {d.u10.toFixed(2)} m/s</div>
                      <div className="num-mono text-foreground">v10: {d.v10.toFixed(2)} m/s</div>
                    </div>
                  );
                }}
              />
              {/* Crosshairs at origin */}
              <ReferenceLine x={0} stroke="hsl(22 96% 56% / 0.4)" strokeDasharray="3 4" strokeWidth={1.5} />
              <ReferenceLine y={0} stroke="hsl(22 96% 56% / 0.4)" strokeDasharray="3 4" strokeWidth={1.5} />
              <Scatter name="Wind Vectors" data={data} fill="hsl(205 95% 58%)" fillOpacity={0.7} shape="circle" />
              {/* Regression line */}
              {Number.isFinite(regression.slope) && (
                <Scatter
                  name="Trend"
                  data={[
                    { u10: u10Range.min, v10: regression.slope * u10Range.min + regression.intercept },
                    { u10: u10Range.max, v10: regression.slope * u10Range.max + regression.intercept },
                  ]}
                  line={{ stroke: "hsl(22 96% 56%)", strokeWidth: 2, strokeDasharray: "4 4" }}
                  shape="none"
                />
              )}
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Quadrant Stats */}
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Directional Dominance</div>

          <div className="grid grid-cols-2 gap-2">
            {/* NE */}
            <div className="rounded-lg bg-gradient-to-br from-sky-500/20 to-transparent p-3 text-center border border-sky-500/30">
              <div className="text-xs text-muted-foreground uppercase">NE</div>
              <div className="num-mono text-lg font-bold text-sky-400 mt-1">{quadrants.ne}%</div>
              <div className="text-[10px] text-muted-foreground mt-1">Northeast</div>
            </div>

            {/* NW */}
            <div className="rounded-lg bg-gradient-to-bl from-cyan-500/20 to-transparent p-3 text-center border border-cyan-500/30">
              <div className="text-xs text-muted-foreground uppercase">NW</div>
              <div className="num-mono text-lg font-bold text-cyan-400 mt-1">{quadrants.nw}%</div>
              <div className="text-[10px] text-muted-foreground mt-1">Northwest</div>
            </div>

            {/* SW */}
            <div className="rounded-lg bg-gradient-to-tr from-violet-500/20 to-transparent p-3 text-center border border-violet-500/30">
              <div className="text-xs text-muted-foreground uppercase">SW</div>
              <div className="num-mono text-lg font-bold text-violet-400 mt-1">{quadrants.sw}%</div>
              <div className="text-[10px] text-muted-foreground mt-1">Southwest</div>
            </div>

            {/* SE */}
            <div className="rounded-lg bg-gradient-to-tl from-orange-500/20 to-transparent p-3 text-center border border-orange-500/30">
              <div className="text-xs text-muted-foreground uppercase">SE</div>
              <div className="num-mono text-lg font-bold text-orange-400 mt-1">{quadrants.se}%</div>
              <div className="text-[10px] text-muted-foreground mt-1">Southeast</div>
            </div>
          </div>

          {/* Regression Stats */}
          {Number.isFinite(regression.slope) && (
            <div className="mt-4 pt-4 border-t border-ocean-line">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Correlation</div>
              <div className="space-y-1 text-[11px]">
                <div>
                  <span className="text-muted-foreground">Slope:</span>
                  <span className="num-mono text-foreground ml-2 font-semibold">{regression.slope.toFixed(3)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">R²:</span>
                  <span className="num-mono text-foreground ml-2 font-semibold">{regression.r2.toFixed(3)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WindDirectionAnalysis;
