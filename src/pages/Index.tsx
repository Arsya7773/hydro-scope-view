import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import GooeyCursor from "@/components/GooeyCursor";
import UploadButton from "@/components/dashboard/UploadButton";
import Filters, { type FilterState } from "@/components/dashboard/Filters";
import KPI from "@/components/dashboard/KPI";
import TimeSeriesChart from "@/components/dashboard/TimeSeriesChart";
import ScatterChartCard from "@/components/dashboard/ScatterChartCard";
import HistogramCard from "@/components/dashboard/HistogramCard";
import MonthlyClimatologyCard from "@/components/dashboard/MonthlyClimatologyCard";
import WindDirectionAnalysis from "@/components/dashboard/WindDirectionAnalysis";
import { datasets, type Row, type DatasetMeta } from "@/lib/datasets";
import { mean, std, variance, min, max, nrmse, bias, rmse, clean } from "@/lib/stats";

const Index = () => {
  const [overrideRows, setOverrideRows] = useState<{ rows: Row[]; meta: DatasetMeta } | null>(null);
  const [filter, setFilter] = useState<FilterState>({ year: "all", month: "all" });

  // Helper function to filter and compute stats for any dataset
  const computeDatasetStats = (rows: Row[], currentFilter: FilterState) => {
    const yearMonthFiltered = rows.filter((r) => {
      if (currentFilter.year !== "all" && r.date.getUTCFullYear() !== currentFilter.year) return false;
      if (currentFilter.month !== "all" && r.date.getUTCMonth() + 1 !== currentFilter.month) return false;
      return true;
    });

    const n = yearMonthFiltered.length;
    if (!n) return { filtered: [], stats: null };
    const filtered = yearMonthFiltered;

    const p = clean(filtered.map((r) => r.primary));
    const s = clean(filtered.map((r) => (r.secondary ?? NaN) as number));
    const hasPair = filtered.some((r) => r.secondary !== undefined && Number.isFinite(r.secondary));

    return {
      filtered,
      stats: {
        primary: {
          mean: mean(p),
          min: min(p),
          max: max(p),
          variance: variance(p),
          std: std(p),
          n: p.length,
        },
        secondary: hasPair
          ? {
              mean: mean(s),
              min: min(s),
              max: max(s),
              variance: variance(s),
              std: std(s),
              n: s.length,
            }
          : null,
        nrmse: hasPair ? nrmse(filtered.map((r) => (r.secondary ?? NaN) as number), filtered.map((r) => r.primary)) : NaN,
        rmse: hasPair ? rmse(filtered.map((r) => (r.secondary ?? NaN) as number), filtered.map((r) => r.primary)) : NaN,
        bias: hasPair ? bias(filtered.map((r) => (r.secondary ?? NaN) as number), filtered.map((r) => r.primary)) : NaN,
      },
    };
  };

  // Compute stats for all three datasets
  const windCompareData = useMemo(() => computeDatasetStats(datasets.windCompare.rows, filter), [filter]);
  const sstData = useMemo(() => computeDatasetStats(datasets.sst.rows, filter), [filter]);
  const windEraData = useMemo(() => computeDatasetStats(datasets.windEra.rows, filter), [filter]);

  return (
    <>
      <GooeyCursor />
      <main className="min-h-screen text-foreground">
        {/* Subtle grid backdrop */}
        <div className="pointer-events-none fixed inset-0 grid-faint-bg opacity-[0.18]" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-8 space-y-8">
          {/* HEADER */}
          <header className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4"
              >
                <div className="relative">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-ocean-orange to-yellow-500 shadow-lg grid place-items-center ring-2 ring-ocean-orange/30">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12c2.5-3 5-3 7.5 0s5 3 7.5 0 5-3 7.5 0" />
                      <path d="M2 18c2.5-3 5-3 7.5 0s5 3 7.5 0 5-3 7.5 0" opacity=".6" />
                    </svg>
                  </div>
                  <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-ocean-blue shadow-lg shadow-ocean-blue/50 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-ocean-orange via-orange-500 to-yellow-400 leading-tight">
                    Hydro Scope View
                  </h1>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 font-medium">
                    Project by Team 2 — Data Analysis Method in Oceanography
                  </p>
                </div>
              </motion.div>

              <UploadButton
                onLoaded={(rows, name) => {
                  setOverrideRows({
                    rows,
                    meta: {
                      id: "windCompare",
                      title: name,
                      subtitle: `${rows.length.toLocaleString()} rows • parsed client-side`,
                      unit: "",
                      primaryLabel: "Primary",
                      secondaryLabel: rows.some((r) => r.secondary !== undefined) ? "Secondary" : undefined,
                    },
                  });
                  setFilter({ year: "all", month: "all" });
                }}
              />
            </div>
          </header>

          {/* GLOBAL FILTERS */}
          <div className="panel p-4 md:p-5">
            <h3 className="heading-display text-sm text-foreground mb-3">Global Filters</h3>
            <Filters
              rows={[...datasets.windCompare.rows, ...datasets.sst.rows, ...datasets.windEra.rows]}
              value={filter}
              onChange={setFilter}
            />
          </div>

          {/* SECTION 1: WIND SPEED - OBSERVATION VS SATELLITE */}
          {windCompareData.stats && (
            <section className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <h2 className="heading-display text-lg text-ocean-orange">Wind Speed — Observation vs Satellite</h2>
                <p className="text-xs text-muted-foreground mt-1">Monthly comparison • 1995 → 2014 • Laut Flores</p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                <KPI label="Max" primary={windCompareData.stats.primary.max} secondary={windCompareData.stats.secondary?.max} unit="m/s" tone="orange" digits={2} delay={0.12} />
                <KPI label="Min" primary={windCompareData.stats.primary.min} secondary={windCompareData.stats.secondary?.min} unit="m/s" tone="blue" digits={2} delay={0.14} />
                <KPI label="Mean" primary={windCompareData.stats.primary.mean} secondary={windCompareData.stats.secondary?.mean} unit="m/s" digits={3} delay={0.16} />
                <KPI label="Variance" primary={windCompareData.stats.primary.variance} secondary={windCompareData.stats.secondary?.variance} digits={3} delay={0.18} />
                <KPI label="Std. Dev" primary={windCompareData.stats.primary.std} secondary={windCompareData.stats.secondary?.std} unit="m/s" digits={3} delay={0.2} />
                <KPI
                  label="NRMSE"
                  primary={windCompareData.stats.nrmse}
                  hint={`RMSE ${windCompareData.stats.rmse.toFixed(3)} • Bias ${windCompareData.stats.bias.toFixed(3)}`}
                  digits={3}
                  tone="orange"
                  delay={0.22}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
                <TimeSeriesChart rows={windCompareData.filtered} unit="m/s" primaryLabel="Observation" secondaryLabel="Satellite" datasetId="windCompare" />
                <ScatterChartCard rows={windCompareData.filtered} unit="m/s" xLabel="Satellite" yLabel="Observation" />
                <div className="lg:col-span-2">
                  <HistogramCard rows={windCompareData.filtered} unit="m/s" label="Wind Speed" isPaired />
                </div>
              </div>
            </section>
          )}

          {/* SECTION 2: SEA SURFACE TEMPERATURE (ERA5) */}
          {sstData.stats && (
            <section className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
                <h2 className="heading-display text-lg text-ocean-orange">Sea Surface Temperature (ERA5)</h2>
                <p className="text-xs text-muted-foreground mt-1">Daily mean • 2003 → 2005 • Laut Flores (-6.5°, 118.25°)</p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                <KPI label="Max" primary={sstData.stats.primary.max} unit="°C" tone="orange" digits={2} delay={0.27} />
                <KPI label="Min" primary={sstData.stats.primary.min} unit="°C" tone="blue" digits={2} delay={0.29} />
                <KPI label="Mean" primary={sstData.stats.primary.mean} unit="°C" digits={3} delay={0.31} />
                <KPI label="Variance" primary={sstData.stats.primary.variance} digits={3} delay={0.33} />
                <KPI label="Std. Dev" primary={sstData.stats.primary.std} unit="°C" digits={3} delay={0.35} />
                <KPI label="Samples" primary={sstData.stats.primary.n} digits={0} delay={0.37} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
                <TimeSeriesChart rows={sstData.filtered} unit="°C" primaryLabel="SST" datasetId="sst" yAxisDomain={[25, 32]} overlayYoY />
                <MonthlyClimatologyCard rows={sstData.filtered} unit="°C" label="SST" title="Monthly SST Climatology" />
                <div className="lg:col-span-2">
                  <HistogramCard rows={sstData.filtered} unit="°C" label="SST" isPaired={false} />
                </div>
              </div>
            </section>
          )}

          {/* SECTION 3: WIND ERA5 (U10, V10 COMPONENTS) */}
          {windEraData.stats && (
            <section className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                <h2 className="heading-display text-lg text-ocean-orange">Wind Speed (ERA5) — U10 & V10 Components</h2>
                <p className="text-xs text-muted-foreground mt-1">Daily mean • 2003 → 2005 • u10 / v10 zonal & meridional components</p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                <KPI label="Max Wind Speed" primary={windEraData.stats.primary.max} unit="m/s" tone="orange" digits={2} delay={0.42} />
                <KPI label="Min Wind Speed" primary={windEraData.stats.primary.min} unit="m/s" tone="blue" digits={2} delay={0.44} />
                <KPI label="Mean Wind Speed" primary={windEraData.stats.primary.mean} unit="m/s" digits={3} delay={0.46} />
                <KPI label="Variance" primary={windEraData.stats.primary.variance} digits={3} delay={0.48} />
                <KPI label="Std. Dev" primary={windEraData.stats.primary.std} unit="m/s" digits={3} delay={0.5} />
                <KPI label="Samples" primary={windEraData.stats.primary.n} digits={0} delay={0.52} />
              </div>

              <div className="space-y-4">
                <WindDirectionAnalysis rows={windEraData.filtered} delay={0.55} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
                <TimeSeriesChart rows={windEraData.filtered} unit="m/s" primaryLabel="Wind Speed" secondaryLabel="u10" datasetId="windEra" showVelocity={true} />
                <div className="lg:col-span-2">
                  <HistogramCard rows={windEraData.filtered} unit="m/s" label="Wind Speed" isPaired={false} />
                </div>
              </div>
            </section>
          )}

          <footer className="pt-8 pb-8 text-center text-[11px] text-muted-foreground border-t border-ocean-line">
            Built client-side · SheetJS · Recharts · Framer Motion · Tailwind · TanStack Query ·{" "}
            <span className="text-foreground">Move your mouse — say hi to the gooey cursor</span>
          </footer>
        </div>
      </main>
    </>
  );
};

export default Index;
