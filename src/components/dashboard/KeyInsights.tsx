import { motion } from "framer-motion";

type InsightPoint = {
  label: string;
  value: string;
  interpretation: string;
  icon: "correlation" | "precision" | "wind" | "trend";
};

type Props = {
  insights: InsightPoint[];
  delay?: number;
};

const ICONS = {
  correlation: "📊",
  precision: "🎯",
  wind: "💨",
  trend: "📈",
};

export const KeyInsights = ({ insights, delay = 0 }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="panel p-5 md:p-6 backdrop-blur-sm border border-ocean-blue/20"
      style={{
        backgroundImage: "radial-gradient(circle at top right, rgba(22, 96%, 56%, 0.05), transparent 80%)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <h3 className="heading-display text-base md:text-lg text-foreground">📌 Key Insights & Diagnostics</h3>
      </div>

      {insights.length === 0 ? (
        <p className="text-xs text-muted-foreground">Insights will appear as you filter and analyze the data.</p>
      ) : (
        <div className="space-y-3">
          {insights.map((insight, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: delay + 0.05 + idx * 0.04 }}
              className="rounded-lg border border-ocean-blue/15 bg-secondary/30 p-3 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0 mt-0.5">{ICONS[insight.icon]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-xs uppercase tracking-wider font-semibold text-ocean-orange">{insight.label}</span>
                    <span className="num-mono text-sm font-bold text-foreground">{insight.value}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{insight.interpretation}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default KeyInsights;
