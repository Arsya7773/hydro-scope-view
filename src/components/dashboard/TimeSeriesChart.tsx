import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ComposedChart,
} from "recharts";
import { motion } from "framer-motion";
import type { Row } from "@/lib/datasets";
import { groupSstByMonthDay } from "@/lib/stats";
import FancyTooltip from "./ChartTooltip";

type Props = {
  rows: Row[];
  unit: string;
  primaryLabel: string;
  secondaryLabel?: string;
  datasetId?: string;
  yAxisDomain?: [number, number];
  showVelocity?: boolean;
  overlayYoY?: boolean;
};

export const TimeSeriesChart = ({
  rows,
  unit,
  primaryLabel,
  secondaryLabel,
  yAxisDomain,
  showVelocity = false,
  overlayYoY = false,
}: Props) => {
  const data = overlayYoY ? groupSstByMonthDay(rows) : rows.map((r) => ({
    t: r.t,
    primary: Number.isFinite(r.primary) ? r.primary : null,
    secondary: r.secondary !== undefined && Number.isFinite(r.secondary) ? r.secondary : null,
    v10: r.extra?.v10 !== undefined && Number.isFinite(r.extra.v10) ? r.extra.v10 : null,
  }));

  const hasSecondary = !overlayYoY && data.some((d) => (d as any).secondary !== null);
  const hasV10 = showVelocity && !overlayYoY && data.some((d) => (d as any).v10 !== null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="panel p-4 md:p-5 lg:col-span-2"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="heading-display text-base md:text-lg text-foreground">
            {overlayYoY ? "SST Year‑Over‑Year" : "Time-Series"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {overlayYoY
              ? "2003 / 2004 / 2005 SST overlay by month-day"
              : showVelocity
              ? "Wind components with u10/v10"
              : "Smooth range comparison"}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] flex-wrap justify-end">
          <span className="chip"><span className="h-2 w-2 rounded-full bg-ocean-orange animate-pulse-dot" /> {primaryLabel}</span>
          {hasSecondary && secondaryLabel && (
            <span className="chip"><span className="h-2 w-2 rounded-full bg-ocean-blue animate-pulse-dot" /> {secondaryLabel}</span>
          )}
          {hasV10 && (
            <span className="chip"><span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse-dot" /> v10</span>
          )}
        </div>
      </div>
      <div className="h-[300px] md:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 16, left: -12, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 6" vertical={false} />
            <XAxis
              dataKey={overlayYoY ? "date" : "t"}
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
              tickFormatter={(value) => (overlayYoY ? String(value) : new Date(String(value)).toLocaleDateString(undefined, { month: "short", day: "2-digit" }))}
              stroke="hsl(var(--muted-foreground))"
              minTickGap={24}
            />
            <YAxis
              domain={yAxisDomain || "auto"}
              allowDataOverflow={!!yAxisDomain}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(v) => Number(v).toFixed(1)}
              width={48}
              label={{
                value: unit,
                angle: -90,
                position: "insideLeft",
                offset: 16,
                fill: "hsl(var(--muted-foreground))",
                fontSize: 11,
              }}
            />
            <Tooltip
              cursor={{ stroke: "hsl(var(--ocean-orange))", strokeOpacity: 0.5, strokeWidth: 1, strokeDasharray: "3 4" }}
              content={<FancyTooltip unit={unit} labelFormatter={(l) => String(l)} />}
            />
            <Legend wrapperStyle={{ justifyContent: "flex-end", fontSize: 11 }} />

            {overlayYoY ? (
              <>
                <Line
                  type="monotone"
                  dataKey="sst2003"
                  name="SST 2003"
                  stroke="hsl(12 94% 62%)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, stroke: "hsl(12 94% 62%)", strokeWidth: 2, fill: "hsl(var(--background))" }}
                  connectNulls
                  isAnimationActive
                  animationDuration={700}
                />
                <Line
                  type="monotone"
                  dataKey="sst2004"
                  name="SST 2004"
                  stroke="hsl(188 100% 57%)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, stroke: "hsl(188 100% 57%)", strokeWidth: 2, fill: "hsl(var(--background))" }}
                  connectNulls
                  isAnimationActive
                  animationDuration={700}
                />
                <Line
                  type="monotone"
                  dataKey="sst2005"
                  name="SST 2005"
                  stroke="hsl(145 100% 55%)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, stroke: "hsl(145 100% 55%)", strokeWidth: 2, fill: "hsl(var(--background))" }}
                  connectNulls
                  isAnimationActive
                  animationDuration={700}
                />
              </>
            ) : (
              <>
                <Line
                  type="monotone"
                  dataKey="primary"
                  name={primaryLabel}
                  stroke="hsl(var(--ocean-orange))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, stroke: "hsl(var(--ocean-orange))", strokeWidth: 2, fill: "hsl(var(--background))" }}
                  connectNulls
                  isAnimationActive
                  animationDuration={700}
                />
                {hasSecondary && (
                  <Line
                    type="monotone"
                    dataKey="secondary"
                    name={secondaryLabel}
                    stroke="hsl(var(--ocean-blue))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5, stroke: "hsl(var(--ocean-blue))", strokeWidth: 2, fill: "hsl(var(--background))" }}
                    connectNulls
                    isAnimationActive
                    animationDuration={700}
                  />
                )}
                {hasV10 && (
                  <Line
                    type="monotone"
                    dataKey="v10"
                    name="v10 (Meridional)"
                    stroke="hsl(188 100% 50%)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5, stroke: "hsl(188 100% 50%)", strokeWidth: 2, fill: "hsl(var(--background))" }}
                    connectNulls
                    isAnimationActive
                    animationDuration={700}
                  />
                )}
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default TimeSeriesChart;
