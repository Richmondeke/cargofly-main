'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AskCargoflyWidget from "@/components/AskCargoflyWidget";
import { cn } from "@/lib/utils";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith('/dashboard');

    if (isDashboard) {
        // Dashboard has its own layout, don't wrap with Navbar/Footer
        return <>{children}</>;
    }

    return (
        <div className={cn((pathname === '/' || pathname === '/b') && "bg-[#003399] bg-motif min-h-screen")}>
            <Navbar />
            <main>{children}</main>
            <Footer isLanding={pathname === '/' || pathname === '/b'} />
            <AskCargoflyWidget />
        </div>
    );
}
