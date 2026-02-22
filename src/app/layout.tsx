import type { Metadata } from 'next';
import localFont from "next/font/local";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

const humanist = localFont({
  src: "./fonts/Humanist521BT.ttf",
  variable: "--font-humanist",
  display: "swap",
});

// We can remove Inter/Outfit/Manrope since we are using custom fonts now.
// However, tailwind config might still reference '--font-outfit' etc. 
// We should align the variable names. 
// Tailwind config says: 
// display: ["var(--font-outfit)", "var(--font-inter)", ...]
// body: ["var(--font-manrope)", "var(--font-inter)", ...]

// Let's use the variable names expected by Tailwind Config OR update Tailwind Config.
// Updating layout only is safer if we use the same variable names.
// BUT, 'kabel.ttf' is likely the 'display' font (Kabel) and 'Humanist' is body.

// Let's map Kabel to --font-outfit (display) and Humanist to --font-manrope (body) for minimal config churn, 
// OR better: use consistent naming and expect to update Tailwind config if needed. 
// Given the previous tailwind config change, let's just stick to standard descriptive vars and update tailwind config next if needed.
// Actually, earlier I updated tailwind config to use 'outfit' and 'manrope'. 
// I will reuse those variable names to avoid breaking the config immediately, 
// OR I will simply use '--font-display' and '--font-body' and ensure tailwind config uses those.

// Wait, checking tailwind.config.ts content again...
// fontFamily: {
//    display: ["var(--font-outfit)", ...],
//    body: ["var(--font-manrope)", ...]
// }
//
// I will use those variable names for the local fonts to "trick" it, or better yet, I should update the variable names in the replacement to match the INTENT.
// Actually, the cleanest way is:
// Define: variable: "--font-kabel" and "--font-humanist"
// And in the className: `${kabel.variable} ${humanist.variable}`
// And THEN update tailwind config to use these variables.
//
// PROPOSAL: Since I can't update tailwind config in this same tool call (file lock/simplicity),
// I will modify Layout to use the NEW variables, and I'll do a second edit to tailwind config.


export const metadata: Metadata = {
  title: "Cargofly | Caverton Cargo Division - Premium Aviation Logistics",
  description:
    "The pinnacle of West African aviation logistics. Premium cargo services, real-time tracking, and white-glove delivery for discerning clients worldwide.",
  keywords: [
    "cargo",
    "logistics",
    "aviation",
    "shipping",
    "premium freight",
    "West Africa",
    "Caverton",
    "air cargo",
    "express delivery",
  ],
  authors: [{ name: "Caverton Group" }],
  openGraph: {
    title: "Cargofly | Premium Aviation Logistics",
    description:
      "Where luxury meets logistics. Premium cargo services for discerning clients.",
    type: "website",
    locale: "en_US",
    siteName: "Cargofly",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cargofly | Premium Aviation Logistics",
    description:
      "Where luxury meets logistics. Premium cargo services for discerning clients.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${humanist.variable}`}>
      <head>
        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />

        <meta name="referrer" content="strict-origin-when-cross-origin" />
        {/* Material Symbols for dashboard icons */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        {/* Inter font for dashboard */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white dark:bg-navy-900 text-navy-900 dark:text-white transition-colors duration-300 font-body antialiased">
        <AuthProvider>
          <ThemeProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

