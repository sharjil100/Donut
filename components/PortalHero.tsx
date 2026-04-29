'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

const HERO_BASE = '/assets/donut-site/scene-01-portal-hero';

export default function PortalHero() {
  const reduceMotion = useReducedMotion();

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="hero" aria-label="Donut portal hero">

      {/* 1. Pink background — slow zoom-out */}
      <motion.div
        className="hero__bg"
        initial={reduceMotion ? false : { scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={
          reduceMotion ? { duration: 0 } : { duration: 1.8, ease }
        }
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

      {/* 2. Logo — scale + fade up with elastic settle, after donut lands */}
      <motion.div
        className="hero__logo"
        initial={reduceMotion ? false : { opacity: 0, y: 60, scale: 0.7 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                opacity: { duration: 0.8, delay: 1.1, ease },
                y: { type: 'spring', stiffness: 90, damping: 14, delay: 1.1 },
                scale: { type: 'spring', stiffness: 110, damping: 12, delay: 1.1 },
              }
        }
      >
        <Image
          src={`${HERO_BASE}/logo-white.png`}
          alt="Glazed"
          width={1200}
          height={400}
          priority
          sizes="(max-width: 768px) 96vw, 70vw"
          className="hero__logo-img"
        />
      </motion.div>

      {/* 3. Ground shadow — fades in as the donut nears its rest position */}
      <motion.div
        className="hero__shadow"
        initial={reduceMotion ? false : { opacity: 0, scaleX: 0.6 }}
        animate={{
          opacity: reduceMotion ? 1 : [0, 0.4, 1],
          scaleX: reduceMotion ? 1 : [0.6, 1.05, 1],
        }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 1.0, delay: 0.85, ease, times: [0, 0.6, 1] }
        }
      />

      {/* 4. Manual reflection — fades in last for a soft polish */}
      <motion.div
        className="hero__reflection-wrap"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 0.28 }}
        transition={
          reduceMotion ? { duration: 0 } : { duration: 1.0, delay: 1.4, ease }
        }
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

      {/* 5. Donut — drops from above with rotation, bouncy spring settle,
          then a gentle idle float. */}
      <motion.div
        className="hero__donut"
        initial={
          reduceMotion
            ? false
            : { x: '-50%', y: '-160%', opacity: 0, scale: 0.5, rotate: -180 }
        }
        animate={
          reduceMotion
            ? { x: '-50%', y: '-50%', opacity: 1, scale: 1, rotate: 0 }
            : {
                x: '-50%',
                y: ['-160%', '-50%', '-50%'],
                opacity: [0, 1, 1],
                scale: [0.5, 1, 1],
                rotate: [-180, 0, 0],
              }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                x: { duration: 0 },
                y: {
                  duration: 1.2,
                  ease: [0.34, 1.56, 0.64, 1],
                  times: [0, 0.7, 1],
                },
                opacity: { duration: 0.8, ease, times: [0, 0.6, 1] },
                scale: {
                  duration: 1.2,
                  ease: [0.34, 1.56, 0.64, 1],
                  times: [0, 0.7, 1],
                },
                rotate: { duration: 1.0, ease, times: [0, 0.7, 1] },
              }
        }
      >
        <motion.div
          animate={
            reduceMotion ? undefined : { y: [0, -10, 0] }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 4.2,
                  delay: 1.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
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

    </section>
  );
}
