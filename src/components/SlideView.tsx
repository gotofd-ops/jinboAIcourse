import type { Slide } from '@/types';
import { motion, type Variants } from 'framer-motion';
import { Quote, Sparkles, Hammer, Sigma } from 'lucide-react';
import { cn } from '@/lib/utils';
import LazyBackgroundImage from '@/components/LazyBackgroundImage';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

interface SlideViewProps {
  slide: Slide;
  isActive: boolean;
}

// Function to highlight numbers in text
const HighlightNumbers = ({ text }: { text: string }) => {
  const parts = text.split(/(\d+(?:[.,]\d+)?%?)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (/^(\d+(?:[.,]\d+)?%?)$/.test(part)) {
          return (
            <span key={i} className="font-display font-bold text-accent text-2xl mx-1 inline-block transform -rotate-2">
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

export default function SlideView({ slide, isActive }: SlideViewProps) {
  if (!isActive) return null;

  const isCover = slide.layoutType === 'cover';
  const isPdfPage = slide.layoutType === 'pdf';
  const isComparison = slide.layoutType === 'comparison';
  const isQr = slide.layoutType === 'qr';

  // Candy Style Variants
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 0.6
      }
    }
  };

  return (
    <div className={cn(
      "relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-background",
      isPdfPage ? "p-0" : "p-4 md:p-8" // Remove padding for PDF pages to maximize space
    )}>
      {/* Decorative Blobs - Hide on PDF pages for clarity */}
      {!isPdfPage && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </>
      )}

      {/* Main Card Container */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "w-full h-full bg-card shadow-2xl overflow-hidden flex flex-col relative z-10",
          isQr ? "items-center" : ([22, 24].includes(slide.id) ? "md:flex-row-reverse" : "md:flex-row"),
          isPdfPage ? "rounded-none border-none max-w-full" : "max-w-7xl md:h-[90%] rounded-[2rem] border-4 border-white"
        )}
      >
        {/* Module Label (Floating Pill) - Hide on PDF pages */}
        {!isCover && !isPdfPage && (
          <div className={cn(
            "absolute top-6 z-30 bg-secondary text-secondary-foreground px-6 py-2 rounded-full font-bold shadow-md transform",
            (isQr || ![22, 24].includes(slide.id)) ? "right-6 rotate-2" : "left-6 -rotate-2"
          )}>
            {slide.module.split('：')[0]}
          </div>
        )}

        {/* Logo - Present on every slide, move to opposite side of module label */}
        {!isPdfPage && (
          <div className={cn(
            "absolute top-6 z-40 bg-white/60 backdrop-blur-sm p-2 rounded-xl border border-white/40 shadow-sm",
            [22, 24].includes(slide.id) ? "right-6" : "left-6"
          )}>
            <img src="assets/logo.png" alt="Jinbo Logo" className="h-10 md:h-12 w-auto object-contain" />
          </div>
        )}

        {/* Layouts */}
        {isComparison ? (
          /* Teaching 1.0 vs 2.0 Comparison Layout */
          <div className="flex flex-col h-full p-4 md:p-12 w-full relative z-20">
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl md:text-5xl font-bold text-center mb-8 md:mb-12 text-primary"
            >
              {slide.title}
            </motion.h2>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-8 md:mb-12">
              {/* Card 1.0 */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-primary/10 border-4 border-primary rounded-[2rem] p-8 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 relative group"
              >
                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-mono font-bold">1950s - 2017</div>
                <div className="bg-primary text-white p-6 rounded-full mb-6 shadow-lg group-hover:rotate-12 transition-transform">
                  <Sigma size={48} />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-primary mb-4">1.0 冶金术</h3>
                <div className="text-xl md:text-2xl text-center text-foreground font-medium space-y-2">
                  <p>数学与算法</p>
                  <p className="text-base text-muted-foreground">Math & Algorithms</p>
                </div>
              </motion.div>

              {/* Card 2.0 */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-secondary/10 border-4 border-secondary rounded-[2rem] p-8 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 relative group"
              >
                <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-mono font-bold">2017 - 2024</div>
                <div className="bg-secondary text-secondary-foreground p-6 rounded-full mb-6 shadow-lg group-hover:-rotate-12 transition-transform">
                  <Hammer size={48} />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">2.0 打磨工具</h3>
                <div className="text-xl md:text-2xl text-center text-foreground font-medium space-y-2">
                  <p>架构与评测</p>
                  <p className="text-base text-muted-foreground">Architecture & Eval</p>
                </div>
              </motion.div>
            </div>

            {/* Bottom Insight */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="bg-accent text-white p-6 md:p-8 rounded-2xl text-center text-xl md:text-3xl font-bold shadow-xl transform -rotate-1 mx-auto max-w-4xl border-4 border-white"
            >
              " 但这两者，依然让普通人觉得遥远。"
            </motion.div>
          </div>
        ) : isCover ? (
          /* Cover Slide Layout */
          <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
            <LazyBackgroundImage
              src={slide.image}
              className="absolute inset-0 bg-cover bg-center z-0"
            />
            <div className="absolute inset-0 bg-primary/30 backdrop-blur-[2px] z-10" />

            <div className="relative z-20 text-center p-10 max-w-4xl bg-white/80 backdrop-blur-md rounded-[3rem] shadow-xl border-8 border-white transform hover:scale-[1.02] transition-transform duration-500">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Sparkles className="w-16 h-16 text-primary mx-auto mb-6" />
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold text-primary mb-4 drop-shadow-sm leading-tight">
                {slide.title}
              </h1>
              {slide.content && slide.content.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl md:text-3xl font-bold text-accent mt-2 py-2 px-8 bg-accent/10 rounded-full inline-block border-2 border-accent/20"
                >
                  {slide.content[0]}
                </motion.div>
              )}
              <div className="mt-10 animate-bounce text-muted-foreground font-mono">
                [ Press Space ]
              </div>
            </div>
          </div>
        ) : isPdfPage ? (
          /* PDF Fullscreen Layout */
          <div className="w-full h-full relative bg-black flex items-center justify-center">
            <LazyBackgroundImage
              src={slide.image}
              className="w-full h-full bg-contain bg-center bg-no-repeat"
            />
            {/* Minimal Overlay for Context */}
            <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
              <span className="text-white/90 font-display font-bold text-lg">{slide.title}</span>
            </div>
            <div className="absolute bottom-6 right-6 z-20 text-white/50 font-mono text-sm bg-black/30 px-3 py-1 rounded">
              #{slide.id.toString().padStart(2, '0')}
            </div>
          </div>
        ) : isQr ? (
          /* QR Code Focused Layout */
          <div className="flex flex-col h-full p-6 md:p-12 w-full items-center justify-center text-center bg-white relative z-20 overflow-y-auto custom-scrollbar">
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl md:text-5xl font-bold text-primary mb-6 md:mb-10"
            >
              {slide.title}
            </motion.h2>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="relative group mb-8 md:mb-12 flex-shrink-0"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-primary via-accent to-secondary rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative bg-white p-4 md:p-8 rounded-[2.5rem] border-8 border-white shadow-2xl flex items-center justify-center overflow-hidden">
                <img
                  src={slide.image}
                  alt="QR Code"
                  className="w-auto h-[40vh] md:h-[50vh] max-w-[80vw] object-contain"
                />
              </div>
            </motion.div>

            {/* Data Support Text below QR */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-4xl"
            >
              <div className="text-lg md:text-2xl font-bold text-foreground leading-relaxed bg-secondary/10 px-6 py-3 md:px-10 md:py-5 rounded-2xl border-2 border-secondary/20 shadow-sm mb-4">
                <HighlightNumbers text={slide.dataSupport} />
              </div>

              {slide.content && slide.content.length > 0 && (
                <div className="flex flex-col items-center space-y-1 md:space-y-3 mt-4">
                  {slide.content.map((item, idx) => (
                    <p key={idx} className="text-base md:text-xl text-muted-foreground font-medium italic">
                      — {item} —
                    </p>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        ) : (
          /* Standard Split Layout */
          <>
            {/* Left Image Section */}
            <div className="w-full md:w-[45%] h-64 md:h-full relative overflow-hidden bg-muted flex flex-col">
              {slide.video ? (
                /* Video layout */
                <div className="absolute inset-0 w-full h-full">
                  <iframe
                    src={`${slide.video}${slide.video.includes('?') ? '&' : '?'}autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&rel=0`}
                    className="w-full h-full border-0 scale-[1.3]"
                    allow="autoplay; encrypted-media"
                    title="Gemini Multimodal Demo"
                  />
                </div>
              ) : slide.images && slide.images.length === 2 ? (
                /* Multi-image layout (Stacked) */
                <>
                  <LazyBackgroundImage
                    src={slide.images[0]}
                    className="w-full h-1/2 bg-cover bg-center transition-transform duration-1000 hover:scale-105 border-b-2 border-white/20"
                  />
                  <LazyBackgroundImage
                    src={slide.images[1]}
                    className="w-full h-1/2 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                  />
                </>
              ) : (
                /* Single image layout */
                <LazyBackgroundImage
                  src={slide.image}
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
                />
              )}

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r pointer-events-none" />

              {/* Slide Number */}
              <div className="absolute bottom-6 left-6 text-white font-mono text-xl font-bold bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl z-20">
                #{slide.id.toString().padStart(2, '0')}
              </div>
            </div>

            {/* Right Content Section */}
            <div className="w-full md:w-[55%] h-full p-8 md:p-12 flex flex-col justify-center overflow-y-auto custom-scrollbar bg-white">

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold text-primary mb-8 leading-tight"
              >
                {slide.title}
              </motion.h2>

              {/* Data Bubble */}
              {slide.dataSupport && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="bg-secondary/20 border-2 border-secondary p-6 rounded-2xl mb-8 relative group hover:rotate-1 transition-transform"
                >
                  <div className="absolute -top-3 -right-3 bg-secondary text-white p-2 rounded-full shadow-md">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Data Insight</h3>
                  <div className="text-lg text-foreground font-medium leading-relaxed">
                    <HighlightNumbers text={slide.dataSupport} />
                  </div>
                </motion.div>
              )}

              {/* Chart Support */}
              {slide.chartData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="w-full h-[300px] mt-4 p-4 bg-secondary/5 rounded-3xl border-2 border-dashed border-secondary/20"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={slide.chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis
                        dataKey="year"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 14, fontWeight: 600 }}
                        dy={10}
                      />
                      <YAxis hide domain={[0, 'auto']} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '16px',
                          border: 'none',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                          padding: '12px'
                        }}
                        cursor={{ fill: 'transparent' }}
                      />
                      <Bar
                        dataKey="cost"
                        radius={[10, 10, 0, 0]}
                        barSize={60}
                        animationDuration={1500}
                      >
                        {slide.chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index === 0 ? '#6366F1' : '#EC4899'}
                            fillOpacity={0.8}
                          />
                        ))}
                        <LabelList
                          dataKey="label"
                          position="top"
                          style={{ fill: '#1E293B', fontWeight: 700, fontSize: 16 }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              )}

              {/* Spoken Content (Optional/Restored for specific slides) */}
              {slide.content && slide.content.length > 0 && (
                <div className="flex-1 space-y-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="relative pl-6 border-l-4 border-muted"
                  >
                    <Quote className="absolute -top-2 -left-3 bg-white text-muted-foreground w-6 h-6 p-1" />
                    {slide.content.map((paragraph, idx) => (
                      <p key={idx} className="text-lg text-muted-foreground leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </motion.div>
                </div>
              )}

            </div>
          </>
        )}
      </motion.div>

      {/* Progress Bar (Candy Style) */}
      <div className="absolute bottom-0 left-0 h-3 bg-muted w-full z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-accent to-secondary rounded-r-full shadow-[0_0_10px_rgba(255,105,180,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${(slide.id / 43) * 100}%` }}
        />
      </div>
    </div>
  );
}
