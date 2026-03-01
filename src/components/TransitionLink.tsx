'use client';

import Link from 'next/link';
import { useTransition } from '@/contexts/TransitionContext';
import { ComponentProps, ReactNode } from 'react';

interface TransitionLinkProps extends ComponentProps<typeof Link> {
    children: ReactNode;
    href: string;
}

export default function TransitionLink({ children, href, onClick, ...props }: TransitionLinkProps) {
    const { startExitAnimation } = useTransition();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        // If it has its own onClick, call it
        if (onClick) {
            onClick(e);
        }

        // Let default happen for external links or modified clicks
        if (
            href.startsWith('http') ||
            href.startsWith('mailto') ||
            href.startsWith('tel') ||
            e.ctrlKey ||
            e.metaKey ||
            e.shiftKey ||
            e.altKey ||
            e.button !== 0
        ) {
            return;
        }

        e.preventDefault();
        startExitAnimation(href);
    };

    return (
        <Link href={href} onClick={handleClick} {...props}>
            {children}
        </Link>
    );
}
