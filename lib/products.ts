export const COFFEE_BASE =
  '/assets/donut-site/Scene 04 = coffee spotlight section';

export type Product = {
  id: string;
  src: string;
  alt: string;
  eyebrow: string;
  main: string;
  width: number;
  height: number;
};

export const PRODUCTS: Product[] = [
  {
    id: 'donut-left',
    src: `${COFFEE_BASE}/donut-side-left.png`,
    alt: 'Pink frosted donut',
    eyebrow: 'SOFT & FLUFFY',
    main: 'DONUTS',
    width: 1400,
    height: 1400,
  },
  {
    id: 'coffee',
    src: `${COFFEE_BASE}/coffee-hero.png`,
    alt: 'Iced coffee',
    eyebrow: 'REALLY GOOD',
    main: 'COFFEE',
    width: 1400,
    height: 1700,
  },
  {
    id: 'donut-right',
    src: `${COFFEE_BASE}/donut-side-right.png`,
    alt: 'Caramel drizzle donut',
    eyebrow: 'CRUNCHY Donut',
    main: 'TREATS',
    width: 1400,
    height: 1400,
  },
];

export const N_PRODUCTS = PRODUCTS.length;

/** Width each product uses when displayed at the centered hero slot.
 *  Reused so the FlyingDonut keeps the same size in CS center as it does
 *  when it lands inside the package. */
export const PRODUCT_CENTER_WIDTHS: Record<string, string> = {
  coffee: 'clamp(280px, 22vw, 430px)',
  'donut-left': 'clamp(340px, 30vw, 520px)',
  'donut-right': 'clamp(340px, 30vw, 520px)',
};
