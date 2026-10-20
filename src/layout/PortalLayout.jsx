import { Outlet } from 'react-router-dom';
import { styled } from 'styled-components';

import PortalHeader from '@/components/Portal/layout/PortalHeader.jsx';
import PortalBanner from '@/components/Portal/layout/PortalBanner.jsx';
import PortalNav from '@/components/Portal/layout/PortalNav.jsx';
import useViewportZoom from '@/hooks/useViewportZoom.js';
import { SAMPLE_CUSTOMER } from '@/pages/portal/sampleData.js';

// Portal 화면은 시안(1440px 기준, 글자 12~16px)의 수치를 그대로 쓰고, 여기서 한 번에 키운다.
// Onboarding과 같은 배율(1920px에서 67%)만 걸면 글자가 8~11px로 보여서 1.4배를 곱함
// → 1920px에서 메뉴 약 15px. 크기를 조절하려면 이 값만 바꾸면 됨
const PORTAL_SCALE = 1.4;

// Portal 파트 공통 레이아웃: 헤더 + 고객 배너 + 메뉴 + 각 화면(Outlet)
export default function PortalLayout(){
  const zoom = useViewportZoom() * PORTAL_SCALE;

  return (
    <PortalWrap style={{ zoom, '--zoom': zoom }}>
      <PortalHeader />
      <PortalBanner customer={SAMPLE_CUSTOMER} />
      <PortalNav />
      <main>
        <Outlet />
      </main>
    </PortalWrap>
  )
}

const PortalWrap = styled.div`
  min-height:calc(100vh / var(--zoom, 1));
  background:#fff;
  font-family:'Poppins', sans-serif;
  color:#000;
`
