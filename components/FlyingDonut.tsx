'use client';

import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useState, type RefObject } from 'react';
import { useScene } from './SceneContext';
import { PRODUCTS, PRODUCT_CENTER_WIDTHS } from '@/lib/products';

interface FlyingDonutProps {
  wrapperRef: RefObject<HTMLDivElement | null>;
}

// Fixed CoffeeSpotlight-center position (matches the cs__slot--center layout).
const CS_LEFT = '50vw';
const CS_TOP = '56vh';
// Fixed package-opening position inside DeliveryPack.
const PACKAGE_LEFT = '20vw';
const PACKAGE_TOP = '38vh';

export default function FlyingDonut({ wrapperRef }: FlyingDonutProps) {
  const { activeIndex } = useScene();
  const product = PRODUCTS[activeIndex];

  // Visibility is purely intersection-based — true when ANY part of the
  // transition wrapper (CoffeeSpotlight + DeliveryPack) is in the viewport.
  // Nothing here reacts to scroll progress.
  const isInWrapper = useInView(wrapperRef, { amount: 0 });

  // Click-driven flight (one-way): false = at CS center, true = inside package.
  const [flying, setFlying] = useState(false);
  const handleClick = () => {
    if (!flying) setFlying(true);
  };

  const clickable = isInWrapper && !flying;

  const width =
    PRODUCT_CENTER_WIDTHS[product.id] ?? PRODUCT_CENTER_WIDTHS.coffee;

  return (
    <motion.div
      className="flying-donut"
      role="button"
      aria-label={flying ? 'Donut delivered' : 'Send donut to package'}
      tabIndex={clickable ? 0 : -1}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (clickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
      initial={{ left: CS_LEFT, top: CS_TOP, rotate: 0 }}
      animate={{
        left: flying ? PACKAGE_LEFT : CS_LEFT,
        top: flying ? PACKAGE_TOP : CS_TOP,
        rotate: flying ? 8 : 0,
      }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        x: '-50%',
        y: '-50%',
        width,
        zIndex: flying ? 2 : 5,
        visibility: isInWrapper ? 'visible' : 'hidden',
        pointerEvents: clickable ? 'auto' : 'none',
        cursor: clickable ? 'pointer' : 'default',
      }}
    >
      <Image
        key={product.id}
        src={product.src}
        alt={product.alt}
        width={product.width}
        height={product.height}
        sizes="(max-width: 768px) 50vw, 30vw"
        className="flying-donut-img"
        priority
        draggable={false}
      />
    </motion.div>
  );
}
