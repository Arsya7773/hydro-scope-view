import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        ocean: {
          orange: "hsl(var(--ocean-orange))",
          "orange-glow": "hsl(var(--ocean-orange-glow))",
          blue: "hsl(var(--ocean-blue))",
          "blue-glow": "hsl(var(--ocean-blue-glow))",
          ink: "hsl(var(--ocean-ink))",
          panel: "hsl(var(--ocean-panel))",
          line: "hsl(var(--ocean-line))",
        },
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(hsl(var(--ocean-line)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--ocean-line)) 1px, transparent 1px)",
        "gradient-orange": "linear-gradient(135deg, hsl(var(--ocean-orange)) 0%, hsl(var(--ocean-orange-glow)) 100%)",
        "gradient-blue": "linear-gradient(135deg, hsl(var(--ocean-blue)) 0%, hsl(var(--ocean-blue-glow)) 100%)",
      },
      boxShadow: {
        glow: "0 0 40px -10px hsl(var(--ocean-orange) / 0.45)",
        "glow-blue": "0 0 40px -10px hsl(var(--ocean-blue) / 0.5)",
        panel: "0 1px 0 0 hsl(var(--ocean-line)) inset, 0 24px 60px -30px rgb(0 0 0 / 0.7)",
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-in": { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "wave-line": { "0%": { backgroundPositionX: "390px" }, "100%": { backgroundPositionX: "0px" } },
        "pulse-dot": { "0%,100%": { transform: "scale(1)", opacity: "1" }, "50%": { transform: "scale(1.6)", opacity: ".55" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in .5s ease-out both",
        "wave-line": "wave-line 1s linear",
        "pulse-dot": "pulse-dot 1.6s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
