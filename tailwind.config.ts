import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F2F7FB",
          100: "#E4EEF6",
          200: "#C5DCEA",
          300: "#9FC1D9",
          400: "#5FA8D3",
          500: "#3D82AC",
          600: "#2D6A8E",
          700: "#1B4965",
          800: "#132C42",
          850: "#0F2436",
          900: "#0B1B2B",
          950: "#060E18",
        },
        accent: {
          50: "#FFF6ED",
          100: "#FEF3EA",
          200: "#FBD8BD",
          300: "#F9B685",
          400: "#F58A45",
          500: "#F26A1B",
          600: "#D4560E",
          700: "#A8430A",
          800: "#9A3D08",
          900: "#6B2A05",
          950: "#3A1602",
        },
        gold: {
          100: "#F7F0DE",
          200: "#EBDDB8",
          300: "#D9C285",
          400: "#D4B263",
          500: "#C8A24A",
          600: "#A9873B",
        },
        neutral: {
          900: "#1C2733",
          700: "#55636F",
          500: "#8A9199",
          300: "#DDE3E8",
          100: "#F2F5F8",
        },
        semantic: {
          success: "#1F9D6B",
          warning: "#E0A800",
          danger: "#D14343",
          info: "#2D6A8E",
        },
        entity: {
          serma: "#1B4965",
          sbsGroup: "#2D6A8E",
          sbsLabo: "#1F9D6B",
          sbsIndustries: "#6B7A8F",
          sbsLogistik: "#E0A800",
          p2m: "#C0562F",
          pgt: "#7A5AA8",
        }
      },
      fontFamily: {
        title: ["Space Grotesk", "sans-serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "elev-1": "0 1px 2px rgba(11,27,43,0.08)",
        "elev-2": "0 4px 12px rgba(11,27,43,0.10)",
        "elev-3": "0 12px 32px rgba(11,27,43,0.16)",
      },
      borderRadius: {
        s: "4px",
        m: "8px",
        l: "16px",
      },
      maxWidth: {
        editorial: "1320px",
        reading: "760px",
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
