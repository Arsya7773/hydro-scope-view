import type { Row } from "@/lib/datasets";

export type Num = number;

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export function clean(values: (Num | null | undefined)[]): Num[] {
  const out: Num[] = [];
  for (const v of values) if (isNum(v)) out.push(v as number);
  return out;
}

export function mean(arr: Num[]): Num {
  if (!arr.length) return NaN;
  let s = 0;
  for (const v of arr) s += v;
  return s / arr.length;
}

export function variance(arr: Num[], sample = true): Num {
  if (arr.length < 2) return NaN;
  const m = mean(arr);
  let s = 0;
  for (const v of arr) s += (v - m) * (v - m);
  return s / (sample ? arr.length - 1 : arr.length);
}

export function std(arr: Num[], sample = true): Num {
  return Math.sqrt(variance(arr, sample));
}

export function min(arr: Num[]): Num {
  let m = Infinity;
  for (const v of arr) if (v < m) m = v;
  return m === Infinity ? NaN : m;
}

export function max(arr: Num[]): Num {
  let m = -Infinity;
  for (const v of arr) if (v > m) m = v;
  return m === -Infinity ? NaN : m;
}

export function pairClean(
  a: (Num | null | undefined)[],
  b: (Num | null | undefined)[]
): { a: Num[]; b: Num[] } {
  const oa: Num[] = [];
  const ob: Num[] = [];
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (isNum(a[i]) && isNum(b[i])) {
      oa.push(a[i] as number);
      ob.push(b[i] as number);
    }
  }
  return { a: oa, b: ob };
}

export function bias(predicted: Num[], observed: Num[]): Num {
  const { a, b } = pairClean(predicted, observed);
  if (!a.length) return NaN;
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] - b[i];
  return s / a.length;
}

export function rmse(predicted: Num[], observed: Num[]): Num {
  const { a, b } = pairClean(predicted, observed);
  if (!a.length) return NaN;
  let s = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    s += d * d;
  }
  return Math.sqrt(s / a.length);
}

export function nrmse(predicted: Num[], observed: Num[]): Num {
  const r = rmse(predicted, observed);
  const range = max(observed) - min(observed);
  if (!Number.isFinite(r) || !range) return NaN;
  return r / range;
}

export function linreg(xs: Num[], ys: Num[]) {
  const { a: x, b: y } = pairClean(xs, ys);
  const n = x.length;
  if (n < 2) return { slope: NaN, intercept: NaN, r2: NaN, n };
  const mx = mean(x);
  const my = mean(y);
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (x[i] - mx) * (y[i] - my);
    den += (x[i] - mx) * (x[i] - mx);
  }
  const slope = num / den;
  const intercept = my - slope * mx;
  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < n; i++) {
    const yp = slope * x[i] + intercept;
    ssRes += (y[i] - yp) ** 2;
    ssTot += (y[i] - my) ** 2;
  }
  const r2 = 1 - ssRes / ssTot;
  return { slope, intercept, r2, n };
}

export function histogram(values: Num[], bins = 24) {
  const v = clean(values);
  if (!v.length) return [] as { bin: number; mid: number; count: number; lo: number; hi: number }[];

  const lo = min(v);
  const hi = max(v);
  if (lo === hi) {
    const start = Math.floor(lo);
    return [{ bin: 0, lo: start, hi: start + 1, mid: start + 0.5, count: v.length }];
  }

  const start = Math.floor(lo);
  const end = Math.ceil(hi);
  const totalRange = Math.max(1, end - start);
  const step = Math.max(1, Math.ceil(totalRange / bins));
  const count = Math.max(1, Math.ceil(totalRange / step));
  const counts = new Array(count).fill(0) as number[];

  for (const x of v) {
    let i = Math.floor((x - start) / step);
    if (i >= count) i = count - 1;
    if (i < 0) i = 0;
    counts[i]++;
  }

  return counts.map((c, i) => {
    const blo = start + i * step;
    const bhi = blo + step;
    return { bin: i, lo: blo, hi: bhi, mid: (blo + bhi) / 2, count: c };
  });
}

export function pairedHistogram(values1: Num[], values2: Num[], bins = 24) {
  const v1 = clean(values1);
  const v2 = clean(values2);
  if (!v1.length && !v2.length) return [];

  const allVals = [...v1, ...v2];
  const lo = min(allVals);
  const hi = max(allVals);
  if (lo === hi) {
    const start = Math.floor(lo);
    return [
      {
        bin: 0,
        lo: start,
        hi: start + 1,
        mid: start + 0.5,
        observation: v1.length,
        satellite: v2.length,
        range: `${start} - ${start + 1}`,
      },
    ];
  }

  const start = Math.floor(lo);
  const end = Math.ceil(hi);
  const totalRange = Math.max(1, end - start);
  const step = Math.max(1, Math.ceil(totalRange / bins));
  const count = Math.max(1, Math.ceil(totalRange / step));
  const observationCounts = new Array(count).fill(0);
  const satelliteCounts = new Array(count).fill(0);

  for (const x of v1) {
    let i = Math.floor((x - start) / step);
    if (i >= count) i = count - 1;
    if (i < 0) i = 0;
    observationCounts[i]++;
  }
  for (const x of v2) {
    let i = Math.floor((x - start) / step);
    if (i >= count) i = count - 1;
    if (i < 0) i = 0;
    satelliteCounts[i]++;
  }

  return observationCounts.map((obs, i) => {
    const blo = start + i * step;
    const bhi = blo + step;
    return {
      bin: i,
      lo: blo,
      hi: bhi,
      mid: (blo + bhi) / 2,
      observation: obs,
      satellite: satelliteCounts[i],
      range: `${blo} - ${bhi}`,
    };
  });
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function groupSstByMonthDay(rows: Row[]) {
  const map = new Map<string, { date: string; month: number; day: number; sst2003: number | null; sst2004: number | null; sst2005: number | null }>();

  for (const r of rows) {
    if (!Number.isFinite(r.primary)) continue;
    const date = r.date;
    const year = date.getUTCFullYear();
    if (year !== 2003 && year !== 2004 && year !== 2005) continue;

    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const key = `${month}-${day}`;
    const label = `${MONTH_NAMES[month]} ${String(day).padStart(2, "0")}`;
    const entry = map.get(key) ?? {
      date: label,
      month,
      day,
      sst2003: null,
      sst2004: null,
      sst2005: null,
    };

    if (year === 2003) entry.sst2003 = r.primary;
    if (year === 2004) entry.sst2004 = r.primary;
    if (year === 2005) entry.sst2005 = r.primary;
    map.set(key, entry);
  }

  return Array.from(map.values()).sort((a, b) => a.month - b.month || a.day - b.day);
}

export function monthlyClimatology(rows: Row[]) {
  const months = MONTH_NAMES.map((label) => ({
    label,
    totalPrimary: 0,
    countPrimary: 0,
    totalSecondary: 0,
    countSecondary: 0,
  }));

  for (const r of rows) {
    const month = r.date.getUTCMonth();
    if (!Number.isFinite(r.primary)) continue;
    months[month].totalPrimary += r.primary;
    months[month].countPrimary += 1;

    if (Number.isFinite(r.secondary ?? NaN)) {
      months[month].totalSecondary += r.secondary ?? 0;
      months[month].countSecondary += 1;
    }
  }

  return months.map((m) => ({
    month: m.label,
    primary: m.countPrimary ? m.totalPrimary / m.countPrimary : NaN,
    secondary: m.countSecondary ? m.totalSecondary / m.countSecondary : null,
  }));
}

export const fmt = {
  num: (v: Num, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : "—"),
  pct: (v: Num, d = 1) => (Number.isFinite(v) ? (v * 100).toFixed(d) + "%" : "—"),
};
