'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

const HERO_BASE = '/assets/donut-site/scene-01-portal-hero';

export default function PortalHero() {
  const reduceMotion = useReducedMotion();

  const transition = (delay = 0, duration = 1.2) =>
    reduceMotion
      ? { duration: 0 }
      : { duration, delay, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section className="hero" aria-label="Donut portal hero">

      {/* 1. Pink background */}
      <motion.div
        className="hero__bg"
        initial={{ scale: 1.04, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...transition(0, 1.6) }}
      >
        <Image
          src={`${HERO_BASE}/hero-pink-bg.png`}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={90}
          className="hero__bg-img"
        />
      </motion.div>

      {/* 2. Logo — behind donut so the donut overlaps its top */}
      <motion.div
        className="hero__logo"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transition(0.3, 1.1) }}
      >
        <Image
          src={`${HERO_BASE}/logo-white.png`}
          alt="Glazed"
          width={1200}
          height={400}
          priority
          sizes="(max-width: 768px) 88vw, 55vw"
          className="hero__logo-img"
        />
      </motion.div>

      {/* 3. Ground shadow ellipse under the donut */}
      <motion.div
        className="hero__shadow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...transition(0.5, 1.4) }}
      />

      {/* 4. Manual reflection */}
      <motion.div
        className="hero__reflection-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...transition(0.8, 1.2) }}
      >
        <Image
          src={`${HERO_BASE}/donut-portal.png`}
          alt=""
          width={2400}
          height={2400}
          sizes="(max-width: 768px) 78vw, 46vw"
          className="hero__reflection-img"
        />
      </motion.div>

      {/* 5. Donut */}
      <motion.div
        className="hero__donut"
        initial={{ x: '-50%', y: '-45%', opacity: 0, scale: 0.94 }}
        animate={{ x: '-50%', y: '-50%', opacity: 1, scale: 1 }}
        transition={{ ...transition(0.2, 1.3) }}
      >
        <Image
          src={`${HERO_BASE}/donut-portal.png`}
          alt="Frosted pink donut portal"
          width={2400}
          height={2400}
          priority
          sizes="(max-width: 768px) 90vw, 55vw"
          className="hero__donut-img"
        />
      </motion.div>

    </section>
  );
}
