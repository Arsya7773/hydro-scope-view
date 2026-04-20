import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { monthlyClimatology } from "@/lib/stats";
import type { Row } from "@/lib/datasets";

type Props = {
  rows: Row[];
  unit: string;
  label: string;
  title?: string;
};

export const MonthlyClimatologyCard = ({ rows, unit, label, title = "Monthly Climatology" }: Props) => {
  const data = useMemo(() => monthlyClimatology(rows), [rows]);
  const hasSecondary = data.some((d) => d.secondary !== null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="panel p-4 md:p-5"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="heading-display text-base md:text-lg text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">Mean monthly values for {label.toLowerCase()}</p>
        </div>
      </div>
      <div className="h-[300px] md:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 18 }}>
            <CartesianGrid strokeDasharray="3 6" vertical={false} />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
            <YAxis
              domain={[25, 32]}
              stroke="hsl(var(--muted-foreground))"
              width={42}
              label={{ value: unit, angle: -90, position: "insideLeft", offset: 10, fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--ocean-orange) / .08)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0].payload as any;
                return (
                  <div className="panel pointer-events-none px-3 py-2 animate-fade-in text-xs">
                    <div className="text-muted-foreground uppercase tracking-[0.2em] mb-1">{p.month}</div>
                    <div className="num-mono text-foreground">{label}: {p.primary?.toFixed(2)} {unit}</div>
                    {hasSecondary && p.secondary != null && (
                      <div className="num-mono text-foreground mt-1">Secondary: {p.secondary.toFixed(2)} {unit}</div>
                    )}
                  </div>
                );
              }}
            />
            {hasSecondary ? <Legend wrapperStyle={{ paddingTop: 8, fontSize: 11, justifyContent: "flex-end" }} /> : null}
            <Bar dataKey="primary" name={label} barSize={16} fill="hsl(22 96% 56%)" radius={[6, 6, 0, 0]} />
            {hasSecondary && <Bar dataKey="secondary" name="Secondary" barSize={16} fill="hsl(205 95% 58%)" radius={[6, 6, 0, 0]} />}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default MonthlyClimatologyCard;
