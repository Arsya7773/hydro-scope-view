import { motion } from "framer-motion";
import { fmt } from "@/lib/stats";

type Tone = "orange" | "blue" | "neutral";

type Props = {
  label: string;
  primary?: number;
  secondary?: number;
  value?: number; // For backward compatibility
  unit?: string;
  hint?: string;
  digits?: number;
  tone?: Tone;
  delay?: number;
};

const TONE: Record<Tone, string> = {
  orange: "from-ocean-orange/30 to-transparent text-ocean-orange",
  blue: "from-ocean-blue/30 to-transparent text-ocean-blue",
  neutral: "from-foreground/10 to-transparent text-foreground",
};

export const KPI = ({ label, primary, secondary, value, unit, hint, digits = 2, tone = "neutral", delay = 0 }: Props) => {
  // Support both old (value) and new (primary/secondary) props
  const primaryValue = primary ?? value;
  const hasDual = secondary !== undefined && Number.isFinite(secondary);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="panel cube-host relative overflow-hidden p-4 md:p-5"
    >
      <div className={`pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl opacity-60 ${TONE[tone]}`} />
      <div className="flex items-start justify-between">
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
        <span className="cube-tile" aria-hidden />
      </div>

      {hasDual ? (
        // Dual-value display
        <div className="mt-3 space-y-2">
          {/* Primary (Observation/Satellite) */}
          <div className="flex items-baseline gap-2">
            <span className="text-[10px] uppercase tracking-wider text-ocean-orange font-semibold">Obs</span>
            <span className="num-mono text-lg md:text-xl font-semibold text-foreground">{fmt.num(primaryValue, digits)}</span>
            {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
          </div>
          {/* Secondary (Satellite/ERA5) */}
          <div className="flex items-baseline gap-2">
            <span className="text-[10px] uppercase tracking-wider text-ocean-blue font-semibold">Sat</span>
            <span className="num-mono text-lg md:text-xl font-semibold text-foreground">{fmt.num(secondary, digits)}</span>
            {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
          </div>
        </div>
      ) : (
        // Single-value display
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="num-mono text-2xl md:text-3xl font-semibold text-foreground">{fmt.num(primaryValue, digits)}</span>
          {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
        </div>
      )}

      {hint && <div className="mt-2 text-[11px] text-muted-foreground/80">{hint}</div>}
    </motion.div>
  );
};

export default KPI;
