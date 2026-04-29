'use client';

import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react';

const WrapperRefContext = createContext<RefObject<HTMLDivElement | null> | null>(null);

export function useTransitionWrapperRef() {
  return useContext(WrapperRefContext);
}

export default function TransitionStage({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  return (
    <WrapperRefContext.Provider value={wrapperRef}>
      <div ref={wrapperRef} className="transition-stage">
        {children}
      </div>
    </WrapperRefContext.Provider>
  );
}
