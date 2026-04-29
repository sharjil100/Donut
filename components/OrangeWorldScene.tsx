'use client';

import Image from 'next/image';
import { motion, MotionValue, type Variants } from 'framer-motion';

const ORANGE_BASE = '/assets/donut-site/scene-03-orange-world';

interface OrangeWorldSceneProps {
  /** Kept for compatibility with PortalTransition; no longer drives the headline. */
  progress?: MotionValue<number>;
}

const HEADLINE_LINES = ['DONUTS', 'COFFEE', '& MORE'];

const headlineContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.25,
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

export default function OrangeWorldScene(_props: OrangeWorldSceneProps) {
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
          section reaches the viewport. */}
      <motion.div
        className="orange-scene__headline"
        aria-label="Donuts, coffee and more"
        variants={headlineContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
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

      {/* 5. Product cluster — only the gentle idle float remains */}
      <div className="orange-scene__product">
        <motion.div
          className="orange-scene__product-float"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="orange-scene__product-shadow" aria-hidden />
          <Image
            src={`${ORANGE_BASE}/product-group.png`}
            alt="Donut donut product cluster"
            width={2200}
            height={1600}
            sizes="(max-width: 768px) 100vw, 60vw"
            className="orange-scene__product-img"
            priority
          />
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
