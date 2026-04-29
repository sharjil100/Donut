'use client';

import Image from 'next/image';
import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion';
import OrangeWorldScene from './OrangeWorldScene';

const HERO_BASE = '/assets/donut-site/scene-01-portal-hero';
const PORTAL_BASE = '/assets/donut-site/scene-02-portal-transition';

export default function PortalTransition() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Pink background
  const bgScale = useTransform(scrollYProgress, [0, 0.45, 0.85], [1, 1.08, 1.18]);
  const bgBlurPx = useTransform(scrollYProgress, [0, 0.45, 0.85], [0, 4, 8]);
  const bgFilter = useMotionTemplate`blur(${bgBlurPx}px)`;
  const bgOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0]);

  // Logo — keep CSS translateX(-50%); only drive y + opacity
  const logoOpacity = useTransform(scrollYProgress, [0, 0.2, 0.45], [1, 1, 0]);
  const logoY = useTransform(scrollYProgress, [0, 0.45], [0, -40]);

  // Donut — same initial centering via x/y as PortalHero, scale up through transition
  const donutScale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.55, 0.85],
    [1, 1.12, 3.2, 9]
  );
  const donutOpacity = useTransform(scrollYProgress, [0.82, 0.95], [1, 0]);

  // Ground shadow + manual reflection — fade out once we start zooming in
  const groundOpacity = useTransform(scrollYProgress, [0, 0.25, 0.5], [1, 0.6, 0]);

  // Portal inner light — appears inside hole, expands
  const portalScale = useTransform(
    scrollYProgress,
    [0.4, 0.65, 0.9],
    [0.25, 1.6, 4]
  );
  const portalOpacity = useTransform(
    scrollYProgress,
    [0.4, 0.55, 0.82, 0.95],
    [0, 1, 1, 0]
  );

  // Warm CSS glow around hole
  const glowOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.55, 0.85],
    [0, 0.95, 0]
  );

  // Dark tunnel vignette
  const vignetteOpacity = useTransform(
    scrollYProgress,
    [0.45, 0.7, 0.92],
    [0, 0.7, 0]
  );

  // White circular reveal
  const whiteRadius = useTransform(scrollYProgress, [0.6, 0.85, 1], [0, 80, 160]);
  const whiteClip = useMotionTemplate`circle(${whiteRadius}% at 50% 50%)`;

  if (reduceMotion) {
    // Static hero only — identical to PortalHero settled state
    return (
      <section className="portal-section portal-section--reduced">
        <div className="hero">
          <div className="hero__bg">
            <Image
              src={`${HERO_BASE}/hero-pink-bg.png`}
              alt=""
              fill
              priority
              sizes="100vw"
              className="hero__bg-img"
            />
          </div>
          <div className="hero__logo">
            <Image
              src={`${HERO_BASE}/logo-white.png`}
              alt="Glazed"
              width={1200}
              height={400}
              priority
              sizes="(max-width: 768px) 88vw, 55vw"
              className="hero__logo-img"
            />
          </div>
          <div className="hero__shadow" />
          <div className="hero__reflection-wrap">
            <Image
              src={`${HERO_BASE}/donut-portal.png`}
              alt=""
              width={2400}
              height={2400}
              sizes="(max-width: 768px) 78vw, 46vw"
              className="hero__reflection-img"
            />
          </div>
          <div
            className="hero__donut"
            style={{ transform: 'translate(-50%, -50%)' }}
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
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="portal-section"
      aria-label="Donut portal scroll experience"
    >
      <div className="hero">
        {/* 1. Pink background */}
        <motion.div
          className="hero__bg"
          style={{ scale: bgScale, filter: bgFilter, opacity: bgOpacity }}
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

        {/* Warm portal glow centered on donut hole */}
        <motion.div
          className="portal-glow"
          style={{ opacity: glowOpacity }}
          aria-hidden
        />

        {/* 2. Logo — preserves translateX(-50%) via framer x */}
        <motion.div
          className="hero__logo"
          style={{ x: '-50%', y: logoY, opacity: logoOpacity }}
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

        {/* 3. Ground shadow */}
        <motion.div className="hero__shadow" style={{ opacity: groundOpacity }} />

        {/* 4. Manual reflection */}
        <motion.div
          className="hero__reflection-wrap"
          style={{ opacity: groundOpacity }}
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

        {/* Portal inner light — sits inside donut hole, behind donut */}
        <motion.div
          className="portal-inner"
          style={{ x: '-50%', y: '-50%', scale: portalScale, opacity: portalOpacity }}
          aria-hidden
        >
          <Image
            src={`${PORTAL_BASE}/portal-inner-light.png`}
            alt=""
            width={1600}
            height={1600}
            sizes="(max-width: 768px) 30vw, 18vw"
            className="portal-inner-img"
          />
        </motion.div>

        {/* 5. Donut — same -50%/-50% centering as PortalHero, plus scroll-driven scale */}
        <motion.div
          className="hero__donut"
          style={{
            x: '-50%',
            y: '-50%',
            scale: donutScale,
            opacity: donutOpacity,
          }}
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

        {/* Dark tunnel vignette */}
        <motion.div
          className="portal-vignette"
          style={{ opacity: vignetteOpacity }}
          aria-hidden
        />

        {/* Circular reveal — opens to scene 03 (orange world) */}
        <motion.div
          className="portal-white"
          style={{ clipPath: whiteClip, WebkitClipPath: whiteClip }}
        >
          <OrangeWorldScene progress={scrollYProgress} />
        </motion.div>
      </div>
    </section>
  );
}
