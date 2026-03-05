'use client';

import dynamic from 'next/dynamic';

const TourOverlay = dynamic(() => import('./TourOverlay'), { ssr: false });
const TourProgressBar = dynamic(() => import('./TourProgressBar'), { ssr: false });

export default function TourProvider() {
  return (
    <>
      <TourProgressBar />
      <TourOverlay />
    </>
  );
}
