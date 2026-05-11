'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useScene } from './SceneContext';
import { PRODUCTS } from '@/lib/products';

const DELIVERY_BASE = '/assets/donut-site/scene-05-delivery-pack';

const STEPS = [
  {
    n: '1',
    title: 'ENTER POSTAL CODE',
    body: 'We deliver fresh donuts near you.',
  },
  {
    n: '2',
    title: 'PLACE YOUR ORDER',
    body: 'Choose your favorite donuts and coffee.',
  },
  {
    n: '3',
    title: 'DELIVERY',
    body: 'Your box arrives warm and ready.',
  },
];

export default function DeliveryPack() {
  const reduceMotion = useReducedMotion();
  const { activeIndex, landed } = useScene();
  const landedProduct = PRODUCTS[activeIndex];

  return (
    <section className="dp" aria-label="Crèmeau delivery pack">
      <div className="dp__stage">
        {/* Background */}
        <div className="dp__bg">
          <Image
            src={`${DELIVERY_BASE}/delivery-bg.png`}
            alt=""
            fill
            sizes="100vw"
            className="dp__bg-img"
            priority
          />
        </div>

        {/* Right-side copy */}
        <div className="dp__copy">
          <motion.h2
            className="dp__heading"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>Crèmeau</span>
            <span>DELIVERY</span>
          </motion.h2>

          <ol className="dp__steps">
            {STEPS.map((step, i) => (
              <motion.li
                key={step.n}
                className="dp__step"
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.55,
                  delay: 0.2 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <span className="dp__step-n">{step.n}</span>
                <div className="dp__step-text">
                  <h3 className="dp__step-title">{step.title}</h3>
                  <p className="dp__step-body">{step.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Package front — covers lower part of donut so it reads as "inside" */}
        <div className="dp__package">
          {landed && (
            <Image
              src={landedProduct.src}
              alt=""
              width={landedProduct.width}
              height={landedProduct.height}
              sizes="20vw"
              className="dp__landed-donut"
              aria-hidden
              draggable={false}
            />
          )}
          <Image
            src={`${DELIVERY_BASE}/package-front.png`}
            alt=""
            width={1400}
            height={1700}
            sizes="(max-width: 768px) 70vw, 36vw"
            className="dp__package-img"
            priority
          />
        </div>

        {/* Bottom decorative donut letters */}
        <div className="dp__bottom-letters" aria-hidden>
          <Image
            src={`${DELIVERY_BASE}/bottom-donut-letters.png`}
            alt=""
            width={2400}
            height={300}
            sizes="100vw"
            className="dp__bottom-letters-img"
          />
        </div>
      </div>
    </section>
  );
}
