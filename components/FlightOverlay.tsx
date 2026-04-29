'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useScene } from './SceneContext';
import { PRODUCTS } from '@/lib/products';

type Target = { left: number; top: number; width: number };

// Shared with .dp__landed-donut CSS so the in-flight handoff lands at
// the same spot the static donut renders. Donut enters from the top of
// the package opening, not the middle.
const LANDED_TOP_RATIO = 0.12;
const LANDED_WIDTH_RATIO = 0.55;

export default function FlightOverlay() {
  const { activeIndex, flying, flightStart, landed, setLanded } = useScene();
  const product = PRODUCTS[activeIndex];
  const reduceMotion = useReducedMotion();
  const [target, setTarget] = useState<Target | null>(null);
  const [unmount, setUnmount] = useState(false);

  useEffect(() => {
    if (!flying || !flightStart) return;

    const pkg = document.querySelector<HTMLElement>('.dp__package');
    if (pkg) {
      pkg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const measure = () => {
      const el = document.querySelector<HTMLElement>('.dp__package');
      if (!el) return;
      const r = el.getBoundingClientRect();
      setTarget({
        left: r.left + r.width / 2,
        top: r.top + r.height * LANDED_TOP_RATIO,
        width: r.width * LANDED_WIDTH_RATIO,
      });
    };

    const t = setTimeout(measure, reduceMotion ? 0 : 650);
    return () => clearTimeout(t);
  }, [flying, flightStart, reduceMotion]);

  // Once landed, wait one frame so the static donut paints before we
  // unmount the overlay — prevents a one-frame flicker.
  useEffect(() => {
    if (!landed) return;
    const id = requestAnimationFrame(() => setUnmount(true));
    return () => cancelAnimationFrame(id);
  }, [landed]);

  if (!flying || !flightStart || unmount) return null;

  const startLeft = flightStart.left;
  const startTop = flightStart.top;
  const startWidth = flightStart.width;

  const animateTo = target
    ? {
        translateX: target.left,
        translateY: target.top,
        width: target.width,
        rotate: -18,
      }
    : {
        translateX: startLeft,
        translateY: startTop,
        width: startWidth,
        rotate: 0,
      };

  return (
    <motion.div
      aria-hidden
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x: '-50%',
        y: '-50%',
        zIndex: 50,
        pointerEvents: 'none',
        willChange: 'transform, width',
      }}
      initial={{
        translateX: startLeft,
        translateY: startTop,
        width: startWidth,
        rotate: 0,
      }}
      animate={animateTo}
      transition={{
        duration: reduceMotion ? 0 : 0.95,
        ease: [0.55, 0, 0.35, 1],
      }}
      onAnimationComplete={() => {
        if (target) setLanded(true);
      }}
    >
      <Image
        src={product.src}
        alt=""
        width={product.width}
        height={product.height}
        sizes="40vw"
        priority
        draggable={false}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </motion.div>
  );
}
