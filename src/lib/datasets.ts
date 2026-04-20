import raw from "@/data/datasets.json";

export type DatasetId = "windCompare" | "sst" | "windEra";

export type Row = {
  t: string;        // ISO date
  date: Date;
  primary: number;  // main series value
  secondary?: number; // optional comparison value
  extra?: Record<string, number>;
};

export type DatasetMeta = {
  id: DatasetId;
  title: string;
  subtitle: string;
  unit: string;
  primaryLabel: string;
  secondaryLabel?: string;
  /** Hourly raw values used for richer histograms (optional). */
  histogramSource?: number[];
};

export type Dataset = {
  meta: DatasetMeta;
  rows: Row[];
};

const r = raw as {
  windCompare: { t: string; obs: number | null; sat: number | null }[];
  sst: { t: string; sst: number }[];
  sstHourly: number[];
  windEra: { t: string; u10: number; v10: number; speed: number }[];
  windEraHourlySpeed: number[];
};

const toDate = (s: string) => new Date(s + "T00:00:00Z");

export const datasets: Record<DatasetId, Dataset> = {
  windCompare: {
    meta: {
      id: "windCompare",
      title: "Wind Speed — Observation vs Satellite",
      subtitle: "Monthly comparison • 1995 → 2014 • Laut Flores",
      unit: "m/s",
      primaryLabel: "Observation",
      secondaryLabel: "Satellite",
    },
    rows: r.windCompare.map((d) => ({
      t: d.t,
      date: toDate(d.t),
      primary: d.obs ?? NaN,
      secondary: d.sat ?? NaN,
    })),
  },
  sst: {
    meta: {
      id: "sst",
      title: "Sea Surface Temperature (ERA5)",
      subtitle: "Daily mean • 2003 → 2005 • Laut Flores (-6.5°, 118.25°)",
      unit: "°C",
      primaryLabel: "SST",
      histogramSource: r.sstHourly,
    },
    rows: r.sst.map((d) => ({
      t: d.t,
      date: toDate(d.t),
      primary: d.sst,
    })),
  },
  windEra: {
    meta: {
      id: "windEra",
      title: "Wind Speed (ERA5)",
      subtitle: "Daily mean • 2003 → 2005 • u10 / v10 components",
      unit: "m/s",
      primaryLabel: "Wind Speed",
      secondaryLabel: "u10 (zonal)",
      histogramSource: r.windEraHourlySpeed,
    },
    rows: r.windEra.map((d) => ({
      t: d.t,
      date: toDate(d.t),
      primary: d.speed,
      secondary: d.u10,
      extra: { u10: d.u10, v10: d.v10 },
    })),
  },
};

export const datasetList: DatasetMeta[] = [
  datasets.windCompare.meta,
  datasets.sst.meta,
  datasets.windEra.meta,
];
