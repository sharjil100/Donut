'use client';

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';

export type FlightStart = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type SceneContextValue = {
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  flying: boolean;
  flightStart: FlightStart | null;
  startFlight: (rect: FlightStart) => void;
  landed: boolean;
  setLanded: (v: boolean) => void;
};

const SceneContext = createContext<SceneContextValue | null>(null);

export function SceneProvider({ children }: { children: ReactNode }) {
  const [activeIndex, setActiveIndex] = useState(1);
  const [flying, setFlying] = useState(false);
  const [flightStart, setFlightStart] = useState<FlightStart | null>(null);
  const [landed, setLanded] = useState(false);

  const startFlight = (rect: FlightStart) => {
    if (flying) return;
    setFlightStart(rect);
    setLanded(false);
    setFlying(true);
  };

  return (
    <SceneContext.Provider
      value={{
        activeIndex,
        setActiveIndex,
        flying,
        flightStart,
        startFlight,
        landed,
        setLanded,
      }}
    >
      {children}
    </SceneContext.Provider>
  );
}

export function useScene(): SceneContextValue {
  const ctx = useContext(SceneContext);
  if (!ctx) {
    throw new Error('useScene must be used within a SceneProvider');
  }
  return ctx;
}
