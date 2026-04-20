# Hydro Scope View

A focused oceanographic dashboard for Sea Surface Temperature (SST) and wind speed data analysis.

## Purpose

Hydro Scope View is a client-side React dashboard built for professional ocean data review. It compares observation, satellite, and ERA5 sources using time-series overlays, paired histograms, directional scatter analysis, and monthly climatology.

## Core Capabilities

- SST year-over-year overlay for 2003, 2004, and 2005
- Integer-bound histogram binning for analyst-grade frequency charts
- Wind speed comparison between observation and satellite data
- ERA5 wind component analysis including `u10` / `v10`
- Monthly climatology panel for SST seasonality
- Client-side Excel/CSV upload with SheetJS parsing

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Recharts
- Framer Motion
- SheetJS (`xlsx`)

## Key Modules

- `src/pages/Index.tsx`
  - Main dashboard state, filters, and layout
- `src/lib/stats.ts`
  - Statistical utilities, integer histogram buckets, and SST YoY grouping
- `src/components/dashboard/TimeSeriesChart.tsx`
  - SST overlay and wind-series rendering
- `src/components/dashboard/HistogramCard.tsx`
  - Frequency distribution rendering with integer range labels
- `src/components/dashboard/MonthlyClimatologyCard.tsx`
  - Mean monthly SST climatology bar chart
- `src/components/dashboard/UploadButton.tsx`
  - Client-side spreadsheet ingestion and normalization

## Data Processing

- Input datasets are normalized into `Row` objects with `t`, `date`, `primary`, and optional `secondary` fields.
- Filtering is applied by year, month, and slider range.
- Histograms use integer start/end boundaries and evenly spaced bins.
- SST time-series uses month-day grouping to overlay multi-year climate patterns.

## Installation

```bash
cd hydro-scope-view-main
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes

- This app is intentionally client-side only.
- No backend is required for dataset upload or chart rendering.
- The design is optimized for clean scientific presentation rather than narrative summaries.
