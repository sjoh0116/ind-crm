import { useEffect, useState } from 'react';

// 1920px 너비에서 67%로 보이고, 화면 너비에 비례해 배율이 바뀜
// (어느 너비에서든 화면이 1920 / 0.67 ≒ 2866px 폭으로 설계된 것처럼 같은 비율로 보임)
const BASE_WIDTH = 1920;
const BASE_ZOOM = 0.67;
// 너무 작거나 커지지 않도록 제한 (약 1000px ~ 2866px 너비 구간에서 비례)
const MIN_ZOOM = 0.35;
const MAX_ZOOM = 1;

const getZoom = () => {
  const zoom = (window.innerWidth / BASE_WIDTH) * BASE_ZOOM;
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
};

export default function useViewportZoom(){
  const [zoom, setZoom] = useState(getZoom);

  useEffect(() => {
    const handleResize = () => setZoom(getZoom());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return zoom;
}
