import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
    src: string;
    alt?: string;
    className?: string;
    containerClassName?: string;
    placeholderClassName?: string;
}

/**
 * LazyImage component that loads images only when they enter the viewport.
 * Shows a blur placeholder while loading for better UX.
 */
export default function LazyImage({
    src,
    alt = '',
    className = '',
    containerClassName = '',
    placeholderClassName = '',
}: LazyImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!imgRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '200px', // Start loading 200px before entering viewport
                threshold: 0,
            }
        );

        observer.observe(imgRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={imgRef}
            className={cn(
                'relative overflow-hidden bg-muted',
                containerClassName
            )}
        >
            {/* Placeholder with pulse animation */}
            <div
                className={cn(
                    'absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse transition-opacity duration-500',
                    isLoaded ? 'opacity-0' : 'opacity-100',
                    placeholderClassName
                )}
            />

            {/* Actual image - only load when in view */}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setIsLoaded(true)}
                    className={cn(
                        'transition-opacity duration-500',
                        isLoaded ? 'opacity-100' : 'opacity-0',
                        className
                    )}
                />
            )}
        </div>
    );
}

/**
 * Hook for preloading images
 */
export function useImagePreload(src: string) {
    useEffect(() => {
        const img = new Image();
        img.src = src;
    }, [src]);
}

/**
 * Preload multiple images
 */
export function preloadImages(srcs: string[]) {
    srcs.forEach((src) => {
        const img = new Image();
        img.src = src;
    });
}
