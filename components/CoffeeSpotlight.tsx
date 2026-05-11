'use client';

import Image from 'next/image';
import { useMemo, useCallback, useState, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import { PRODUCTS, N_PRODUCTS as N, type Product } from '@/lib/products';
import { useScene } from './SceneContext';

// Per-product slot widths — equalize visual size when each product is centered.
// Coffee is tall+narrow; donuts are square. Donuts get a wider center width so
// their visual height matches the coffee cup.
// Min values are intentionally low so the carousel scales gracefully on
// narrow phones; vw drives the desktop sizing.
const PRODUCT_SLOT_WIDTHS: Record<string, { center: string; side: string }> = {
  coffee: {
    center: 'clamp(150px, 22vw, 430px)',
    side: 'clamp(130px, 22vw, 360px)',
  },
  'donut-left': {
    center: 'clamp(190px, 30vw, 520px)',
    side: 'clamp(220px, 34vw, 620px)',
  },
  'donut-right': {
    center: 'clamp(190px, 30vw, 520px)',
    side: 'clamp(220px, 34vw, 620px)',
  },
};

// ---------- Donut SVG icon for marquee ----------
type DonutVariant = {
  dough: string;
  frosting: string;
  hole: string;
  sprinkles: string[];
};

const DONUT_VARIANTS: DonutVariant[] = [
  { dough: '#e3b07b', frosting: '#f37aa3', hole: '#f9e6cb', sprinkles: ['#fff', '#7cc9d6', '#f6c945'] },
  { dough: '#e3b07b', frosting: '#f4a035', hole: '#f9e6cb', sprinkles: ['#fff', '#f37aa3', '#5b3318'] },
  { dough: '#e3b07b', frosting: '#f6e6c5', hole: '#f9e6cb', sprinkles: ['#f37aa3', '#7cc9d6', '#f6c945'] },
  { dough: '#e3b07b', frosting: '#5b3318', hole: '#f9e6cb', sprinkles: ['#fff', '#f6c945', '#f37aa3'] },
  { dough: '#e3b07b', frosting: '#7cc9d6', hole: '#f9e6cb', sprinkles: ['#fff', '#f37aa3', '#5b3318'] },
];

function DonutIcon({
  variant,
  size = 40,
  rotate = 0,
}: {
  variant: DonutVariant;
  size?: number;
  rotate?: number;
}) {
  const [s1, s2, s3] = variant.sprinkles;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ transform: `rotate(${rotate}deg)`, flexShrink: 0 }}
      aria-hidden
    >
      <circle cx="50" cy="50" r="42" fill={variant.dough} />
      <path
        d="M 14 50
           C 14 28, 30 14, 50 14
           C 70 14, 86 28, 86 50
           C 84 56, 78 58, 72 54
           C 66 50, 60 52, 54 56
           C 48 60, 42 58, 36 54
           C 30 50, 24 52, 18 56
           C 14 56, 13 53, 14 50 Z"
        fill={variant.frosting}
      />
      <circle cx="50" cy="50" r="13" fill={variant.hole} />
      <rect x="32" y="28" width="2.6" height="6.2" rx="1.3" fill={s1} transform="rotate(25 33.3 31.1)" />
      <rect x="55" y="32" width="2.6" height="6.2" rx="1.3" fill={s2} transform="rotate(-30 56.3 35.1)" />
      <rect x="48" y="22" width="2.6" height="6.2" rx="1.3" fill={s3} transform="rotate(50 49.3 25.1)" />
      <rect x="40" y="36" width="2.6" height="6.2" rx="1.3" fill={s1} transform="rotate(-15 41.3 39.1)" />
      <rect x="62" y="44" width="2.6" height="6.2" rx="1.3" fill={s2} transform="rotate(20 63.3 47.1)" />
    </svg>
  );
}

function generateDonutStrip(count: number) {
  const list: { variant: DonutVariant; size: number; rotate: number }[] = [];
  for (let i = 0; i < count; i++) {
    list.push({
      variant: DONUT_VARIANTS[i % DONUT_VARIANTS.length],
      size: 36 + ((i * 7) % 9),
      rotate: ((i * 47) % 360) - 180,
    });
  }
  return list;
}

// ---------- Background doodle (greyscale line-art donut) ----------
function DoodleDonut({ size = 110 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke="#404040"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden
    >
      <ellipse cx="50" cy="50" rx="38" ry="36" />
      <ellipse cx="50" cy="50" rx="14" ry="13" />
      <path d="M 18 47 C 22 36, 32 28, 50 28 C 68 28, 78 36, 82 48" />
      <path d="M 28 39 C 32 36, 38 35, 44 36" opacity="0.7" />
      <line x1="34" y1="33" x2="36" y2="38" />
      <line x1="48" y1="24" x2="50" y2="29" />
      <line x1="60" y1="32" x2="58" y2="37" />
      <line x1="40" y1="44" x2="42" y2="48" opacity="0.7" />
      <line x1="56" y1="42" x2="58" y2="46" opacity="0.6" />
    </svg>
  );
}

const DOODLES: { x: string; y: string; size: number; rotate: number }[] = [
  { x: '6%',  y: '22%', size: 96,  rotate: -16 },
  { x: '14%', y: '52%', size: 132, rotate: -10 },
  { x: '8%',  y: '78%', size: 88,  rotate: 30 },
  { x: '22%', y: '32%', size: 78,  rotate: 22 },
  { x: '24%', y: '70%', size: 110, rotate: -20 },
  { x: '36%', y: '18%', size: 86,  rotate: 8 },
  { x: '38%', y: '60%', size: 100, rotate: -14 },
  { x: '46%', y: '88%', size: 92,  rotate: 18 },
  { x: '52%', y: '24%', size: 76,  rotate: -8 },
  { x: '58%', y: '70%', size: 118, rotate: -22 },
  { x: '64%', y: '34%', size: 88,  rotate: 14 },
  { x: '70%', y: '88%', size: 96,  rotate: -18 },
  { x: '76%', y: '52%', size: 124, rotate: 10 },
  { x: '78%', y: '20%', size: 82,  rotate: 26 },
  { x: '88%', y: '38%', size: 96,  rotate: -12 },
  { x: '92%', y: '74%', size: 110, rotate: 16 },
  { x: '46%', y: '36%', size: 70,  rotate: 4 },
  { x: '32%', y: '90%', size: 78,  rotate: -28 },
];

// ---------- Arrow ----------
function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: direction === 'left' ? 'rotate(180deg)' : undefined }}
      aria-hidden
    >
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------- Slot config ----------
type SlotName = 'left' | 'center' | 'right';
const SLOT_ROTATE: Record<SlotName, number> = { left: -8, center: 0, right: 8 };

// ---------- Component ----------
export default function CoffeeSpotlight() {
  const { activeIndex, setActiveIndex, flying, startFlight } = useScene();
  const centerImgRef = useRef<HTMLImageElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // Trigger the spin/tilt entrance only when the section actually scrolls
  // into view, not on initial page mount (the user is in the hero then,
  // and would miss the animation entirely).
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });
  // direction = 0 → first reveal (use spin entrance);
  // direction = -1 → LEFT pressed, items shift leftward;
  // direction = +1 → RIGHT pressed, items shift rightward.
  const [direction, setDirection] = useState(0);
  const reduceMotion = useReducedMotion();
  const donuts = useMemo(() => generateDonutStrip(60), []);

  // Arrow direction per user spec:
  //   LEFT  → right donut → center, center bottle → left.
  //   RIGHT → left donut → center, center bottle → right.
  const goLeft = useCallback(() => {
    setDirection(-1);
    setActiveIndex((i) => (i + 1) % N);
  }, []);
  const goRight = useCallback(() => {
    setDirection(1);
    setActiveIndex((i) => (i - 1 + N) % N);
  }, []);

  const leftIdx = (activeIndex - 1 + N) % N;
  const rightIdx = (activeIndex + 1) % N;
  const active = PRODUCTS[activeIndex];

  const slots: { name: SlotName; product: Product }[] = [
    { name: 'left',   product: PRODUCTS[leftIdx] },
    { name: 'center', product: active },
    { name: 'right',  product: PRODUCTS[rightIdx] },
  ];

  return (
    <section ref={sectionRef} className="cs" aria-label="Really good coffee spotlight">
      {/* Subtle paper grain */}
      <div className="cs__grain" aria-hidden />

      {/* Background doodles — many subtle greyscale line-art donuts */}
      <div className="cs__doodles" aria-hidden>
        {DOODLES.map((d, i) => (
          <span
            key={i}
            className="cs__doodle"
            style={{
              left: d.x,
              top: d.y,
              transform: `translate(-50%, -50%) rotate(${d.rotate}deg)`,
            }}
          >
            <DoodleDonut size={d.size} />
          </span>
        ))}
      </div>

      {/* Top moving badge strip — full width */}
      <div className="cs__strip" aria-hidden>
        <motion.div
          className="cs__strip-track"
          animate={reduceMotion ? undefined : { x: ['0%', '-50%'] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 14, repeat: Infinity, ease: 'linear' }
          }
        >
          {[...donuts, ...donuts].map((d, i) => (
            <DonutIcon key={i} {...d} />
          ))}
        </motion.div>
      </div>

      {/* Headline — dynamic copy per active product */}
      <div className="cs__headline">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            className="cs__headline-inner"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -14 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="cs__headline-eyebrow">{active.eyebrow}</span>
            <span className="cs__headline-main">{active.main}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pink pedestal — flat saucer behind the cup base */}
      <div className="cs__pedestal" aria-hidden />

      {/* Carousel slots — all three (left, center, right) render inline so
          the center scrolls with the section instead of being pinned to
          the viewport. */}
      <div className="cs__stage">
        {slots.map(({ name, product }) => {
          const isCenter = name === 'center';
          const hideForFlight = isCenter && flying;
          const slotRotate = SLOT_ROTATE[name];
          const isCoffee = product.id === 'coffee';
          const slotWidth =
            PRODUCT_SLOT_WIDTHS[product.id][isCenter ? 'center' : 'side'];

          // First-mount spin entrance per product (no opacity fade — only
          // rotation animates so the entrance feels like a hard appear + spin).
          const spinInitial =
            isCoffee
              ? { rotate: 8, opacity: 1, x: '0%' }
              : product.id === 'donut-left'
              ? { rotate: -368, opacity: 1, x: '0%' }
              : { rotate: -352, opacity: 1, x: '0%' };

          // Variants depend on slot rotate so the rotate stays put while
          // x and opacity drive the slide.
          const slideVariants: Variants = {
            enter: (dir: number) => ({
              x: dir > 0 ? '-140%' : '140%',
              opacity: 0,
              rotate: slotRotate,
            }),
            center: {
              x: '0%',
              opacity: 1,
              rotate: slotRotate,
            },
            exit: (dir: number) => ({
              x: dir > 0 ? '140%' : '-140%',
              opacity: 0,
              rotate: slotRotate,
            }),
          };

          return (
            <motion.div
              key={name}
              className={`cs__slot cs__slot--${name}`}
              style={{
                width: slotWidth,
                visibility: hideForFlight ? 'hidden' : undefined,
                pointerEvents: isCenter && !flying ? 'auto' : undefined,
                cursor: isCenter && !flying ? 'pointer' : undefined,
              }}
              onClick={
                isCenter && !flying
                  ? () => {
                      const el = centerImgRef.current;
                      if (!el) return;
                      const r = el.getBoundingClientRect();
                      startFlight({
                        left: r.left + r.width / 2,
                        top: r.top + r.height / 2,
                        width: r.width,
                        height: r.height,
                      });
                    }
                  : undefined
              }
              role={isCenter && !flying ? 'button' : undefined}
              aria-label={
                isCenter && !flying ? 'Send product to package' : undefined
              }
            >
              <AnimatePresence
                mode="wait"
                custom={direction}
                initial={true}
              >
                <motion.div
                  key={product.id}
                  custom={direction}
                  className={`cs__slot-product cs__slot-product--${
                    isCenter ? 'center' : 'side'
                  }`}
                  initial={
                    reduceMotion
                      ? false
                      : direction === 0
                      ? spinInitial
                      : 'enter'
                  }
                  animate={
                    direction === 0
                      ? inView || reduceMotion
                        ? { rotate: slotRotate, opacity: 1, x: '0%' }
                        : spinInitial
                      : 'center'
                  }
                  exit={reduceMotion ? undefined : 'exit'}
                  variants={slideVariants}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : direction === 0
                      ? isCoffee
                        ? { type: 'spring', stiffness: 90, damping: 9, mass: 1, delay: 0.5 }
                        : { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.4 }
                      : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
                  }
                >
                  <Image
                    ref={isCenter ? centerImgRef : undefined}
                    src={product.src}
                    alt={isCenter ? product.alt : ''}
                    width={1400}
                    height={isCoffee ? 1700 : 1400}
                    sizes={
                      isCenter
                        ? '(max-width: 768px) 50vw, 28vw'
                        : '(max-width: 768px) 70vw, 34vw'
                    }
                    className="cs__slot-img"
                    priority={isCenter}
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Arrows */}
      <motion.button
        type="button"
        onClick={goLeft}
        aria-label="Previous product"
        className="cs__arrow cs__arrow--left"
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.94 }}
      >
        <ArrowIcon direction="left" />
      </motion.button>
      <motion.button
        type="button"
        onClick={goRight}
        aria-label="Next product"
        className="cs__arrow cs__arrow--right"
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.94 }}
      >
        <ArrowIcon direction="right" />
      </motion.button>

      <p className="cs__support">freshly brewed daily · since 2021</p>
    </section>
  );
}
