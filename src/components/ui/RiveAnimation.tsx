'use client';

import React from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

interface RiveAnimationProps {
    src: string;
    artboard?: string;
    animations?: string | string[];
    autoplay?: boolean;
    className?: string;
    fit?: Fit;
    alignment?: Alignment;
}

export default function RiveAnimation({
    src,
    artboard,
    animations, // Default removed to allow Rive's default animation to play
    autoplay = true,
    className = "w-full h-full",
    fit = Fit.Contain,
    alignment = Alignment.Center,
}: RiveAnimationProps) {
    const { RiveComponent } = useRive({
        src,
        artboard,
        animations,
        autoplay,
        layout: new Layout({
            fit,
            alignment,
        }),
    });

    return (
        <div className={className}>
            <RiveComponent />
        </div>
    );
}
