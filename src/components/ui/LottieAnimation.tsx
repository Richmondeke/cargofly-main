"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface LottieAnimationProps {
    src?: string;
    animationData?: any;
    loop?: boolean;
    autoplay?: boolean;
    className?: string;
    width?: number | string;
    height?: number | string;
}

export default function LottieAnimation({
    src,
    animationData: initialData,
    loop = true,
    autoplay = true,
    className,
    width,
    height,
}: LottieAnimationProps) {
    const [animationData, setAnimationData] = useState<any>(initialData);

    useEffect(() => {
        if (src) {
            fetch(src)
                .then((response) => response.json())
                .then((data) => setAnimationData(data))
                .catch((error) => console.error("Error loading Lottie animation:", error));
        }
    }, [src]);

    if (!animationData) {
        return <div className={`animate-pulse bg-current opacity-10 rounded-xl ${className}`} style={{ width, height }} />;
    }

    return (
        <div className={className} style={{ width, height }}>
            <Lottie
                animationData={animationData}
                loop={loop}
                autoplay={autoplay}
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
}
