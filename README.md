<div align="center">

# 🌊 Hydro Scope View

**Advanced Client-Side Oceanographic Data Analytics Dashboard**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)

> *Project by Team 2 — Data Analysis Method in Oceanography*

</div>

---

## 📖 Overview

**Hydro Scope View** is a high-performance, client-side dashboard engineered specifically for professional oceanographic data review. Built entirely without a backend, it enables researchers to instantly ingest heavy Excel/CSV datasets and perform real-time comparative analysis between **Observation**, **Satellite**, and **ERA5 Reanalysis** sources.

The architecture is optimized for scientific accuracy, featuring time-series overlays, directional wind vector tracking, and dynamic statistical engines.

## ✨ Core Capabilities

* **📈 Year-over-Year (YoY) SST Overlay:** Intelligently normalizes multi-year Sea Surface Temperature data (2003–2005) into unified 12-month axes, revealing precise seasonal variances.
* **🧭 Directional Dominance Analytics:** Real-time scatter plotting of ERA5 wind components (`u10` / `v10`) with crosshair quadrants to determine dominant wind vectors.
* **📊 Analyst-Grade Histograms:** Frequency distribution charts equipped with strict integer-bound binning logic, eliminating floating-point noise for rapid data legibility.
* **🗓️ Monthly Climatology Profiling:** Automated data grouping to render mean monthly SST and wind speed averages, acting as a spatial anchor for seasonal insights.
* **⚡ Zero-Latency Ingestion:** Utilizes `SheetJS` to parse and normalize complex spreadsheets directly inside the browser.

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + TypeScript | Component architecture & type-safe data handling |
| **Build Tool** | Vite | Lightning-fast HMR and optimized production bundling |
| **Data Visualization** | Recharts | WebGL-like rendering of heavy data arrays |
| **Styling & UI** | Tailwind CSS + Framer | Responsive utility classes and micro-interactions |
| **Data Parser** | SheetJS (`xlsx`) | Client-side spreadsheet parsing and data normalization |

## 🧠 Key Modules

* `src/pages/Index.tsx` — The orchestrator. Manages the main dashboard state, temporal filters, and grid layout.
* `src/lib/stats.ts` — The mathematical core. Handles integer histogram buckets, YoY temporal grouping, NRMSE calculations, and variance formulas.
* `src/components/dashboard/TimeSeriesChart.tsx` — Renders the complex SST temporal overlays and multi-variable wind series.
* `src/components/dashboard/MonthlyClimatologyCard.tsx` — Groups raw data into calculated monthly means for seasonal review.
* `src/components/dashboard/UploadButton.tsx` — The gateway. Securely reads and maps user CSV/Excel files into standardized `Row` objects.

## 🚀 Getting Started

Since the application is 100% client-side, setting up the development environment is incredibly straightforward.

### Prerequisites
* Node.js 18.0+ 
* npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone [https://github.com/YourUsername/hydro-scope-view.git](https://github.com/YourUsername/hydro-scope-view.git)

# 2. Navigate into the directory
cd hydro-scope-view

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
