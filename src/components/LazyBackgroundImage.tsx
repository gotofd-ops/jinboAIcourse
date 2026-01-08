import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface LazyBackgroundImageProps {
    src?: string;
    className?: string;
    style?: CSSProperties;
    children?: React.ReactNode;
    /** Low quality placeholder - can be a tiny base64 image or gradient */
    placeholder?: string;
}

/**
 * LazyBackgroundImage component for background images that load lazily.
 * Uses native loading="lazy" approach with visibility detection.
 */
export default function LazyBackgroundImage({
    src,
    className = '',
    style = {},
    children,
    placeholder = 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
}: LazyBackgroundImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [shouldLoad, setShouldLoad] = useState(true); // Load immediately for active slides

    useEffect(() => {
        if (!shouldLoad || !src) return;

        const img = new Image();
        img.onload = () => setIsLoaded(true);
        img.onerror = () => setIsLoaded(true); // Fall back
        img.src = src;

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src, shouldLoad]);

    const backgroundStyle: CSSProperties = {
        ...style,
        backgroundImage: isLoaded && src ? `url(${src})` : placeholder,
        transition: 'background-image 0.3s ease-in-out',
    };

    return (
        <div className={cn(className)} style={backgroundStyle}>
            {children}
        </div>
    );
}
