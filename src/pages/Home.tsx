import { useEffect, useState, useCallback, useMemo } from 'react';
import { defaultSlides, processSlides } from '@/lib/slides';
import SlideView from '@/components/SlideView';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Menu, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

export default function Home() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
  // Get initial state from environment variable, not hardcoded
  const [showAllSlides, setShowAllSlides] = useState(() => import.meta.env.VITE_INCLUDE_PDF_SLIDES === 'true');

  // Dynamic slides based on toggle
  const slides = useMemo(() => {
    return processSlides(showAllSlides);
  }, [showAllSlides]);

  const totalSlides = slides.length;

  // Extract Modules
  const modules = useMemo(() => {
    const mods: { name: string; fullName: string; startIndex: number; color: string }[] = [];
    const seen = new Set<string>();
    
    const colors = [
      "bg-primary",   // Hot Pink
      "bg-secondary", // Lemon Yellow
      "bg-accent",    // Electric Blue
      "bg-[#FF9F1C]", // Orange
      "bg-[#2EC4B6]", // Teal
      "bg-[#9B5DE5]", // Purple
      "bg-[#F15BB5]", // Pink
    ];

    let colorIdx = 0;

    slides.forEach((s, i) => {
      if (!seen.has(s.module)) {
        seen.add(s.module);
        mods.push({ 
          name: s.module.split('：')[0], // Short name for tooltip
          fullName: s.module,
          startIndex: i,
          color: colors[colorIdx % colors.length]
        });
        colorIdx++;
      }
    });
    return mods;
  }, [slides]);

  const currentModule = useMemo(() => {
    return modules.slice().reverse().find(m => currentSlideIndex >= m.startIndex);
  }, [currentSlideIndex, modules]);

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < totalSlides - 1) {
      setDirection(1);
      setCurrentSlideIndex(prev => prev + 1);
    }
  }, [currentSlideIndex, totalSlides]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setDirection(-1);
      setCurrentSlideIndex(prev => prev - 1);
    }
  }, [currentSlideIndex]);

  const jumpToSlide = (index: number) => {
    setDirection(index > currentSlideIndex ? 1 : -1);
    setCurrentSlideIndex(index);
  };

  // Reset slide index when toggle changes to avoid out-of-bounds
  useEffect(() => {
    if (currentSlideIndex >= totalSlides) {
      setCurrentSlideIndex(0);
      setDirection(0);
    }
  }, [totalSlides, currentSlideIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ': 
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          prevSlide();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <div className="bg-background min-h-screen text-foreground overflow-hidden selection:bg-primary selection:text-primary-foreground font-sans">
      
      {/* Local/Online Toggle - Only show in development */}
      {import.meta.env.VITE_INCLUDE_PDF_SLIDES === 'true' && (
        <div className="fixed top-6 right-6 z-50">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setShowAllSlides(prev => !prev)}
                  variant="default"
                  size="sm"
                  className="flex items-center gap-2 bg-white/90 backdrop-blur-md text-foreground hover:bg-white border-2 border-primary/20 shadow-lg"
                >
                  {showAllSlides ? (
                    <>
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-bold">本地版</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4" />
                      <span className="text-sm font-bold">在线版</span>
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-white/90 backdrop-blur-md text-foreground border-none shadow-xl font-bold">
                <p>{showAllSlides ? "切换到在线版" : "切换到本地版"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* Module Navigation Bar (Candy Dock) */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 p-2 px-4 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 shadow-lg hover:bg-white/30 transition-all duration-300">
        <TooltipProvider delayDuration={100}>
          {modules.map((mod, idx) => {
            const isActive = currentModule?.name === mod.name;
            return (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => jumpToSlide(mod.startIndex)}
                    className={cn(
                      "w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                      isActive ? `w-8 scale-110 ${mod.color}` : "bg-white/60 hover:bg-white"
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent 
                  side="bottom" 
                  className="bg-white/90 backdrop-blur-md text-foreground border-none shadow-xl font-display font-bold px-4 py-2 rounded-xl"
                >
                  <p>{mod.fullName}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>

      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={currentSlideIndex}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-full h-full absolute inset-0"
        >
          <SlideView 
            slide={slides[currentSlideIndex]} 
            isActive={true} 
          />
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-6 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-white/10 backdrop-blur-sm p-2 rounded-full px-6 border border-white/20">
         <Button 
            variant="ghost" 
            size="icon" 
            onClick={prevSlide} 
            disabled={currentSlideIndex === 0}
            className="hover:bg-white/20 text-foreground rounded-full"
         >
            <ChevronLeft className="w-6 h-6" />
         </Button>
         
         <span className="font-mono text-sm text-muted-foreground font-bold">
            {currentSlideIndex + 1} <span className="opacity-50">/</span> {totalSlides}
         </span>
         
         <Button 
            variant="ghost" 
            size="icon" 
            onClick={nextSlide} 
            disabled={currentSlideIndex === totalSlides - 1}
            className="hover:bg-white/20 text-foreground rounded-full"
         >
            <ChevronRight className="w-6 h-6" />
         </Button>
      </div>

      {/* Keyboard Hint Overlay (Only on first slide) */}
      {currentSlideIndex === 0 && (
         <div className="absolute bottom-8 right-8 text-xs font-mono text-muted-foreground/50 pointer-events-none hidden md:block animate-pulse">
            [Space] to Start
         </div>
      )}
    </div>
  );
}
