import { useEffect, useState } from 'react';

// 화면 너비에 비례하는 배율. baseWidth에서 baseZoom이 되고, min~max 사이로 제한
// 기본값(Onboarding): 1920px에서 67% — 어느 너비에서든 1920 / 0.67 ≒ 2866px 폭으로 설계된 것처럼 보임
const getZoom = ({ baseWidth, baseZoom, min, max }) => {
  const zoom = (window.innerWidth / baseWidth) * baseZoom;
  return Math.min(max, Math.max(min, zoom));
};

export default function useViewportZoom({
  baseWidth = 1920,
  baseZoom = 0.67,
  min = 0.35,
  max = 1,
} = {}){
  const [zoom, setZoom] = useState(() => getZoom({ baseWidth, baseZoom, min, max }));

  useEffect(() => {
    const handleResize = () => setZoom(getZoom({ baseWidth, baseZoom, min, max }));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [baseWidth, baseZoom, min, max]);

  return zoom;
}
