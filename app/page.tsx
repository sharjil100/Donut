import PortalTransition from '@/components/PortalTransition';
import CoffeeSpotlight from '@/components/CoffeeSpotlight';
import DeliveryPack from '@/components/DeliveryPack';
import { SceneProvider } from '@/components/SceneContext';
import TransitionStage from '@/components/TransitionStage';
import FlightOverlay from '@/components/FlightOverlay';

export default function Page() {
  return (
    <main>
      <PortalTransition />
      <SceneProvider>
        <TransitionStage>
          <CoffeeSpotlight />
          <DeliveryPack />
        </TransitionStage>
        <FlightOverlay />
      </SceneProvider>
    </main>
  );
}
