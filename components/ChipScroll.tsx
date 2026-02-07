"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const TOTAL_FRAMES = 240;

export default function ChipScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const { scrollYProgress } = useScroll();

  const currentFrame = useTransform(scrollYProgress, [0, 0.8], [0, TOTAL_FRAMES - 1]);

  // Preload all images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    const loadImage = (index: number) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        const frameNumber = String(index + 1).padStart(3, "0");
        img.src = `/images/frame/ezgif-frame-${frameNumber}.jpg`;
        
        img.onload = () => {
          loadedImages[index] = img;
          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
          resolve();
        };
        
        img.onerror = () => {
          console.error(`Failed to load frame ${frameNumber}`);
          resolve();
        };
      });
    };

    Promise.all(Array.from({ length: TOTAL_FRAMES }, (_, i) => loadImage(i)))
      .then(() => {
        setImages(loadedImages);
        setImagesLoaded(true);
      });
  }, []);

  // Render current frame to canvas
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderFrame = (frameIndex: number) => {
      const img = images[frameIndex];
      
      if (img && img.complete) {
        // Set canvas size to match viewport
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = canvas.offsetHeight * dpr;
        ctx.scale(dpr, dpr);

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate scaling to fit image while maintaining aspect ratio
        const canvasAspect = canvas.offsetWidth / canvas.offsetHeight;
        const imgAspect = img.width / img.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasAspect > imgAspect) {
          drawWidth = canvas.offsetWidth;
          drawHeight = drawWidth / imgAspect;
          offsetX = 0;
          offsetY = (canvas.offsetHeight - drawHeight) / 2;
        } else {
          drawHeight = canvas.offsetHeight;
          drawWidth = drawHeight * imgAspect;
          offsetX = (canvas.offsetWidth - drawWidth) / 2;
          offsetY = 0;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
    };

    // Draw initial frame
    renderFrame(0);

    const unsubscribe = currentFrame.on("change", (latest) => {
      const frameIndex = Math.round(latest);
      renderFrame(frameIndex);
    });

    return () => unsubscribe();
  }, [imagesLoaded, images, currentFrame]);

  // Text animations based on scroll progress
  const text1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.25, 0.35, 0.55], [0, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.55, 0.65, 0.85], [0, 1, 0]);
  const text4Opacity = useTransform(scrollYProgress, [0.85, 0.92, 1], [0, 1, 1]);

  if (!imagesLoaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black/90 font-semibold text-lg">Loading Experience</p>
          <p className="text-black/60 text-sm mt-2">{loadingProgress}%</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-white">
      {/* Sticky Canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center py-8">
        <div className="relative w-full max-w-6xl mx-auto px-6" style={{ height: "85vh", maxHeight: "800px" }}>
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Text Overlays */}
        <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto px-6">
          {/* Text 1: Opening */}
          <motion.div
            style={{ opacity: text1Opacity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center px-6 max-w-4xl">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-black/90 tracking-tight leading-tight">
                An Ecosystem designed to reward
              </h1>
            </div>
          </motion.div>

          {/* Text 2: Left aligned */}
          <motion.div
            style={{ opacity: text2Opacity }}
            className="absolute inset-0 flex items-center"
          >
            <div className="px-8 md:px-16 lg:px-24 max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-bold text-black/90 tracking-tight leading-tight">
                Responsible contribution
              </h2>
              <p className="text-lg md:text-xl text-black/60 mt-4 leading-relaxed">
                Building a foundation of trust through verified actions
              </p>
            </div>
          </motion.div>

          {/* Text 3: Right aligned */}
          <motion.div
            style={{ opacity: text3Opacity }}
            className="absolute inset-0 flex items-center justify-end"
          >
            <div className="px-8 md:px-16 lg:px-24 max-w-2xl text-right">
              <h2 className="text-4xl md:text-6xl font-bold text-black/90 tracking-tight leading-tight">
                Rewards are earned through measurable action, not promises
              </h2>
              <p className="text-lg md:text-xl text-black/60 mt-4 leading-relaxed">
                Every contribution is tracked, verified, and rewarded fairly
              </p>
            </div>
          </motion.div>

          {/* Text 4: CTA */}
          <motion.div
            style={{ opacity: text4Opacity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center px-6 max-w-3xl">
              <h2 className="text-5xl md:text-7xl font-bold text-black/90 tracking-tight leading-tight mb-8">
                One Individual, One Account
              </h2>
              <p className="text-xl md:text-2xl text-black/60 mb-10 leading-relaxed">
                Fair distribution starts with verified identity
              </p>
              <button className="px-8 py-4 bg-black text-white rounded-full text-lg font-semibold hover:bg-black/90 transition-all hover:scale-105 shadow-lg pointer-events-auto">
                Join the Ecosystem
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
