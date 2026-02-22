import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Cargofly Official Brand Colors
                primary: {
                    DEFAULT: "#003399", // Navy Blue - Primary
                    dark: "#002060",    // Navy Blue 11
                    light: "#0044CE",   // Navy Blue 10
                },
                // Navy Blue Palette
                navy: {
                    DEFAULT: "#003399", // Official Navy Blue
                    900: "#003399",     // Primary Navy
                    800: "#0044CE",     // Navy Blue 10 (lighter)
                    700: "#002060",     // Navy Blue 11 (darker/depth)
                },
                // Cargofly Sky Blue Palette
                sky: {
                    DEFAULT: "#4196FF", // Cargofly Sky Blue
                    500: "#4196FF",     // Primary Sky Blue
                    400: "#81B7FF",     // Sky Blue 10 (lighter)
                    600: "#016FFF",     // Sky Blue 11 (darker)
                },
                // Cargofly Yellow Palette
                gold: {
                    DEFAULT: "#FFCA00", // Cargofly Yellow
                    50: "#FFFBEB",      // Very light yellow for backgrounds
                    100: "#FFF3C4",     // Light yellow
                    500: "#FFCA00",     // Primary Yellow (buttons)
                    400: "#FFD541",     // Yellow 10 (lighter/gradients)
                    600: "#BA9100",     // Yellow 11 (hover)
                },
                // Supporting Colors
                gray: {
                    dark: "#666666",    // Dark Gray - secondary text
                    light: "#CCCCCC",   // Light Grey - borders, disabled
                },
                // Glass effects
                glass: {
                    DEFAULT: "rgba(0, 51, 153, 0.4)", // Navy based glass
                    border: "rgba(255, 255, 255, 0.08)",
                },
                // Dashboard Surface Colors
                "surface-light": "#FFFFFF",
                "surface-dark": "#002060",  // Navy 11 for cards
                "background-light": "#F8FAFC",
                "background-dark": "#001A4D", // Deep navy for contrast
            },
            fontFamily: {
                display: ["var(--font-humanist)", "sans-serif"],
                body: ["var(--font-humanist)", "sans-serif"],
                sans: ["var(--font-humanist)", "sans-serif"],
            },
            fontSize: {
                xs: ['12px', { lineHeight: '16px' }],
                sm: ['14px', { lineHeight: '20px' }],
                base: ['18px', { lineHeight: '28px' }], // User requested 18px as the next step after 14px
                lg: ['20px', { lineHeight: '28px' }],
                xl: ['24px', { lineHeight: '32px' }],
                '2xl': ['32px', { lineHeight: '40px' }],
                '3xl': ['40px', { lineHeight: '48px' }],
                '4xl': ['48px', { lineHeight: '1' }],
                '5xl': ['60px', { lineHeight: '1' }],
            },
            spacing: {
                // Carbon Design System Spacing
                "spacing-01": "0.125rem", // 2px
                "spacing-02": "0.25rem",  // 4px
                "spacing-03": "0.5rem",   // 8px
                "spacing-04": "0.75rem",  // 12px
                "spacing-05": "1rem",     // 16px
                "spacing-06": "1.5rem",   // 24px
                "spacing-07": "2rem",     // 32px
                "spacing-08": "2.5rem",   // 40px
                "spacing-09": "3rem",     // 48px
                "spacing-10": "4rem",     // 64px
                "spacing-11": "5rem",     // 80px
                "spacing-12": "6rem",     // 96px
                "spacing-13": "10rem",    // 160px
            },
            animation: {
                "fade-slide-up": "fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                "text-reveal": "textReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                "glow-pulse": "glowPulse 2s ease-in-out infinite",
                shimmer: "shimmer 2s infinite",
                float: "parallaxFloat 6s ease-in-out infinite",
                "scroll-indicator": "scrollBounce 2s ease-in-out infinite",
                "scale-in": "scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            },
            keyframes: {
                fadeSlideUp: {
                    "0%": { opacity: "0", transform: "translateY(60px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                textReveal: {
                    "0%": { clipPath: "inset(0 100% 0 0)", opacity: "0" },
                    "100%": { clipPath: "inset(0 0 0 0)", opacity: "1" },
                },
                glowPulse: {
                    "0%, 100%": { boxShadow: "0 0 20px rgba(202, 138, 4, 0.4)" },
                    "50%": { boxShadow: "0 0 40px rgba(202, 138, 4, 0.8)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% center" },
                    "100%": { backgroundPosition: "200% center" },
                },
                parallaxFloat: {
                    "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
                    "50%": { transform: "translateY(-20px) rotate(2deg)" },
                },
                scaleIn: {
                    "0%": { opacity: "0", transform: "scale(0.9)" },
                    "100%": { opacity: "1", transform: "scale(1)" },
                },
                scrollBounce: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(10px)" },
                },
            },
        },
    },
    plugins: [],
};

export default config;
