'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpotlightRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TourSpotlightProps {
  selector: string;
  active: boolean;
}

export default function TourSpotlight({ selector, active }: TourSpotlightProps) {
  const [rect, setRect] = useState<SpotlightRect | null>(null);

  useEffect(() => {
    if (!active || !selector) {
      setRect(null);
      return;
    }

    const findElement = () => {
      const el = document.querySelector(selector);
      if (el) {
        const r = el.getBoundingClientRect();
        const pad = 8;
        setRect({
          x: r.left - pad,
          y: r.top - pad,
          width: r.width + pad * 2,
          height: r.height + pad * 2,
        });
      } else {
        setRect(null);
      }
    };

    findElement();
    const interval = setInterval(findElement, 500);
    window.addEventListener('resize', findElement);
    window.addEventListener('scroll', findElement, true);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', findElement);
      window.removeEventListener('scroll', findElement, true);
    };
  }, [selector, active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9998] pointer-events-none"
        >
          <svg className="w-full h-full">
            <defs>
              <mask id="tour-spotlight-mask">
                <rect width="100%" height="100%" fill="white" />
                {rect && (
                  <motion.rect
                    initial={{ opacity: 0 }}
                    animate={{
                      x: rect.x,
                      y: rect.y,
                      width: rect.width,
                      height: rect.height,
                      opacity: 1,
                    }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    rx={12}
                    fill="black"
                  />
                )}
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.7)"
              mask="url(#tour-spotlight-mask)"
              style={{ backdropFilter: 'blur(2px)' }}
            />
            {rect && (
              <motion.rect
                initial={{ opacity: 0 }}
                animate={{
                  x: rect.x - 2,
                  y: rect.y - 2,
                  width: rect.width + 4,
                  height: rect.height + 4,
                  opacity: 1,
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                rx={14}
                fill="none"
                stroke="rgba(167, 139, 250, 0.5)"
                strokeWidth={2}
              />
            )}
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useSpotlightPosition(selector: string, active: boolean) {
  const [pos, setPos] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  useEffect(() => {
    if (!active) { setPos(null); return; }

    const update = () => {
      const el = document.querySelector(selector);
      if (el) {
        const r = el.getBoundingClientRect();
        setPos({ x: r.left, y: r.top, width: r.width, height: r.height });
      }
    };

    update();
    const interval = setInterval(update, 500);
    return () => clearInterval(interval);
  }, [selector, active]);

  return pos;
}
