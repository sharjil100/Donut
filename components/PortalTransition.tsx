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
          <header className="hero__nav">
            <span className="hero__nav-brand">CRÈMEAU</span>
            <nav className="hero__nav-links">
              <a href="#menu">MENU</a>
              <a href="#about">ABOUT</a>
              <a href="#locations">LOCATIONS</a>
              <a href="#order">ORDER ONLINE</a>
            </nav>
            <a className="hero__nav-cta" href="#order">
              <span aria-hidden>🛍</span>
              ORDER NOW
            </a>
            <button type="button" className="hero__nav-burger" aria-label="Open menu">
              <span aria-hidden />
              <span aria-hidden />
              <span aria-hidden />
            </button>
          </header>
          <div className="hero__copy">
            <p className="hero__tagline">
              <span className="hero__tagline-mark" aria-hidden>~</span>
              Made to make you smile
              <span className="hero__tagline-mark" aria-hidden>~</span>
            </p>
            <h1 className="hero__logo">
              <span className="hero__logo-text">Crèmeau</span>
            </h1>
            <p className="hero__sub">DOUGHNUTS. DREAMS. DELICIOUS.</p>
            <p className="hero__body">
              Handcrafted doughnuts made with premium ingredients and a
              whole lot of love.
            </p>
            <a className="hero__cta" href="#menu">
              EXPLORE OUR MENU <span aria-hidden>→</span>
            </a>
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
      aria-label="Crèmeau portal scroll experience"
    >
      <div className="hero">
        {/* 1. Pink background — scroll-driven only; visible from frame 1
            so the sky is never blank during the donut entrance. */}
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

        {/* Top navigation bar */}
        <motion.header
          className="hero__nav"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="hero__nav-brand">CRÈMEAU</span>
          <nav className="hero__nav-links" aria-label="Primary">
            <a href="#menu">MENU</a>
            <a href="#about">ABOUT</a>
            <a href="#locations">LOCATIONS</a>
            <a href="#order">ORDER ONLINE</a>
          </nav>
          <a className="hero__nav-cta" href="#order">
            <span aria-hidden>🛍</span>
            ORDER NOW
          </a>
          <button
            type="button"
            className="hero__nav-burger"
            aria-label="Open menu"
          >
            <span aria-hidden />
            <span aria-hidden />
            <span aria-hidden />
          </button>
        </motion.header>

        {/* Left content column — scroll-driven fade + stagger entrance */}
        <motion.div
          className="hero__copy"
          style={{ y: logoY, opacity: logoOpacity }}
        >
          <motion.p
            className="hero__tagline"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="hero__tagline-mark" aria-hidden>~</span>
            Made to make you smile
            <span className="hero__tagline-mark" aria-hidden>~</span>
          </motion.p>

          <motion.h1
            className="hero__logo"
            initial={{ opacity: 0, y: 50, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              opacity: { duration: 0.7, delay: 1.05, ease: [0.22, 1, 0.36, 1] },
              y: { type: 'spring', stiffness: 90, damping: 14, delay: 1.05 },
              scale: { type: 'spring', stiffness: 110, damping: 11, delay: 1.05 },
            }}
          >
            <span className="hero__logo-text">Crèmeau</span>
          </motion.h1>

          <motion.p
            className="hero__sub"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.35, ease: [0.22, 1, 0.36, 1] }}
          >
            DOUGHNUTS. DREAMS. DELICIOUS.
          </motion.p>

          <motion.p
            className="hero__body"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            Handcrafted doughnuts made with premium ingredients and a whole lot of love.
          </motion.p>

          <motion.a
            className="hero__cta"
            href="#menu"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.65, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            EXPLORE OUR MENU <span aria-hidden>→</span>
          </motion.a>

          <motion.ul
            className="hero__features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.85, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Promise"
          >
            <li>
              <span className="hero__feature-icon" aria-hidden>🌿</span>
              PREMIUM<br />INGREDIENTS
            </li>
            <li>
              <span className="hero__feature-icon" aria-hidden>♥</span>
              MADE<br />WITH LOVE
            </li>
            <li>
              <span className="hero__feature-icon" aria-hidden>◯</span>
              FRESH DAILY<br />HANDCRAFTED
            </li>
          </motion.ul>
        </motion.div>

        {/* Mobile-only feature pill — sibling of copy column so it can
            span the full hero width as a glass card at the bottom. */}
        <motion.ul
          className="hero__features hero__features--mobile"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 1.85, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          <li>
            <span className="hero__feature-icon" aria-hidden>🌿</span>
            PREMIUM<br />INGREDIENTS
          </li>
          <li>
            <span className="hero__feature-icon" aria-hidden>♥</span>
            MADE<br />WITH LOVE
          </li>
          <li>
            <span className="hero__feature-icon" aria-hidden>◯</span>
            FRESH DAILY<br />HANDCRAFTED
          </li>
        </motion.ul>

        {/* Right-side circular badge */}
        <motion.div
          className="hero__badge"
          style={{ x: '-50%', y: '-50%' }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 110,
            damping: 12,
            delay: 1.95,
          }}
        >
          <span className="hero__badge-icon" aria-hidden>♡</span>
          <span className="hero__badge-line">ALWAYS</span>
          <span className="hero__badge-emph">FRESH</span>
          <span className="hero__badge-line">ALWAYS</span>
          <span className="hero__badge-emph">DELICIOUS</span>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="hero__scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.1 }}
          aria-hidden
        >
          <motion.span
            className="hero__scroll-chev"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            ⌄
          </motion.span>
          SCROLL TO DISCOVER
        </motion.div>

        {/* 3. Ground shadow — visible from the start; the gradient+blur
            live on this element directly so we don't wrap it. */}
        <motion.div className="hero__shadow" style={{ opacity: groundOpacity }} />

        {/* 4. Manual reflection — outer keeps scroll-driven opacity; inner
            fades in only after the donut has fully landed (donut entrance
            ends ~1.15s, so reflection waits until 1.5s). */}
        <motion.div
          className="hero__reflection-wrap"
          style={{ opacity: groundOpacity }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.9,
              delay: 1.5,
              ease: [0.22, 1, 0.36, 1],
            }}
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

        {/* 5. Donut — outer keeps -50%/-50% centering + scroll-driven scale.
            Inner div drops in from above with a half-spin and a bouncy
            settle, then runs a gentle idle float. */}
        <motion.div
          className="hero__donut"
          style={{
            x: '-50%',
            y: '-50%',
            scale: donutScale,
            opacity: donutOpacity,
          }}
        >
          <motion.div
            initial={{ y: '-110vh', rotate: -200, scale: 0.55, opacity: 0 }}
            animate={{ y: 0, rotate: 0, scale: 1, opacity: 1 }}
            transition={{
              y: { duration: 1.15, ease: [0.34, 1.56, 0.64, 1] },
              rotate: { duration: 1.15, ease: [0.22, 1, 0.36, 1] },
              scale: {
                duration: 1.15,
                ease: [0.34, 1.56, 0.64, 1],
              },
              opacity: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4.4,
                delay: 1.4,
                repeat: Infinity,
                ease: 'easeInOut',
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
          </motion.div>
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
