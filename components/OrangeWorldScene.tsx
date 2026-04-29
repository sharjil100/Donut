'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  motion,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  type Variants,
} from 'framer-motion';

const ORANGE_BASE = '/assets/donut-site/scene-03-orange-world';

interface OrangeWorldSceneProps {
  /** Scroll progress through the portal section. Used to trigger entrance
      animations once the white reveal starts opening (~0.65). */
  progress?: MotionValue<number>;
}

const HEADLINE_LINES = ['DONUTS', 'COFFEE', '& MORE'];

const headlineContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.15,
    },
  },
};

const headlineCharVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function OrangeWorldScene({ progress }: OrangeWorldSceneProps) {
  // Trigger entrance animations when the portal scroll progress passes the
  // point where the white reveal starts opening, not on mount (the
  // orange-scene element is technically in the viewport throughout the
  // sticky portal section but hidden under the white layer).
  const [revealed, setRevealed] = useState(false);
  // Hook-safe fallback so we always have a MotionValue to subscribe to,
  // even when this component is rendered without a `progress` prop.
  const fallbackProgress = useMotionValue(0);
  useMotionValueEvent(progress ?? fallbackProgress, 'change', (v) => {
    if (!revealed && v > 0.65) setRevealed(true);
  });
  return (
    <div className="orange-scene" aria-label="Donut product world">
      {/* 1. Base orange background */}
      <div className="orange-scene__bg">
        <Image
          src={`${ORANGE_BASE}/orange-site-bg.png`}
          alt=""
          fill
          sizes="100vw"
          quality={90}
          className="orange-scene__bg-img"
        />
      </div>

      {/* 2. Center turquoise arch */}
      <div className="orange-scene__arch" aria-hidden>
        <Image
          src={`${ORANGE_BASE}/orange-arch-sky.png`}
          alt=""
          width={1800}
          height={1400}
          sizes="(max-width: 768px) 92vw, 48vw"
          className="orange-scene__arch-img"
        />
      </div>

      {/* 3. Headline — letter-by-letter typewriter, triggered when the
          white reveal opens (same trigger as the product cluster). */}
      <motion.div
        className="orange-scene__headline"
        aria-label="Donuts, coffee and more"
        variants={headlineContainerVariants}
        initial="hidden"
        animate={revealed ? 'visible' : 'hidden'}
      >
        {HEADLINE_LINES.map((line, lineIdx) => (
          <span key={lineIdx} className="orange-scene__headline-line">
            {[...line].map((ch, i) => (
              <motion.span
                key={i}
                className="orange-scene__headline-char"
                variants={headlineCharVariants}
                style={{ display: 'inline-block' }}
              >
                {ch === ' ' ? ' ' : ch}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.div>

      {/* 3b. Side punchlines — slide in from off-screen with a tilt
          when the white reveal opens. */}
      <motion.div
        className="orange-scene__punch orange-scene__punch--left"
        aria-hidden
        initial={{ opacity: 0, x: -260, rotate: -14 }}
        animate={
          revealed
            ? { opacity: 1, x: 0, rotate: -8 }
            : { opacity: 0, x: -260, rotate: -14 }
        }
        transition={{
          delay: 0.35,
          x: { type: 'spring', stiffness: 120, damping: 14 },
          rotate: { type: 'spring', stiffness: 110, damping: 12 },
          opacity: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        <span className="orange-scene__punch-eyebrow">Frosted</span>
        <span className="orange-scene__punch-main">with love</span>
        <span className="orange-scene__punch-sub">since 2021</span>
      </motion.div>

      <motion.div
        className="orange-scene__punch orange-scene__punch--right"
        aria-hidden
        initial={{ opacity: 0, x: 260, rotate: 14 }}
        animate={
          revealed
            ? { opacity: 1, x: 0, rotate: 8 }
            : { opacity: 0, x: 260, rotate: 14 }
        }
        transition={{
          delay: 0.55,
          x: { type: 'spring', stiffness: 120, damping: 14 },
          rotate: { type: 'spring', stiffness: 110, damping: 12 },
          opacity: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        <span className="orange-scene__punch-eyebrow">Brewed</span>
        <span className="orange-scene__punch-main">for the bold</span>
        <span className="orange-scene__punch-sub">sip · bite · smile</span>
      </motion.div>

      {/* 4. Side decor */}
      <div
        className="orange-scene__decor orange-scene__decor--left"
        aria-hidden
      >
        <Image
          src={`${ORANGE_BASE}/orange-decor-left.png`}
          alt=""
          fill
          sizes="(max-width: 768px) 96px, 14vw"
          className="orange-scene__decor-img orange-scene__decor-img--left"
        />
      </div>
      <div
        className="orange-scene__decor orange-scene__decor--right"
        aria-hidden
      >
        <Image
          src={`${ORANGE_BASE}/orange-decor-right.png`}
          alt=""
          fill
          sizes="(max-width: 768px) 96px, 14vw"
          className="orange-scene__decor-img orange-scene__decor-img--right"
        />
      </div>

      {/* 5. Product cluster — bounce-in entrance when the white reveal
          opens, then gentle idle float once landed. */}
      <div className="orange-scene__product">
        <motion.div
          initial={{ opacity: 0, y: 140, scale: 0.55, rotate: -6 }}
          animate={
            revealed
              ? { opacity: 1, y: 0, scale: 1, rotate: 0 }
              : { opacity: 0, y: 140, scale: 0.55, rotate: -6 }
          }
          transition={{
            opacity: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            y: { type: 'spring', stiffness: 110, damping: 11, mass: 0.9 },
            scale: { type: 'spring', stiffness: 130, damping: 10, mass: 0.9 },
            rotate: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] },
          }}
        >
          <motion.div
            className="orange-scene__product-float"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.0,
            }}
          >
            <span className="orange-scene__product-shadow" aria-hidden />
            <Image
              src={`${ORANGE_BASE}/product-group.png`}
              alt="Donut product cluster"
              width={2200}
              height={1600}
              sizes="(max-width: 768px) 100vw, 60vw"
              className="orange-scene__product-img"
              priority
            />
          </motion.div>
        </motion.div>
      </div>

      {/* 6. Mini logo */}
      <div className="orange-scene__logo" aria-label="Donut">
        Donut
      </div>

      {/* 7. Order pill button */}
      <motion.button
        type="button"
        className="orange-scene__order"
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
      >
        ORDER
      </motion.button>
    </div>
  );
}
