import { Outlet } from 'react-router-dom';

import Header from '@/layout/header.jsx'
import RegisterStep from '@/components/Register/RegisterSteps.jsx';
import { RegistrationProvider } from '@/context/RegistrationContext.jsx';
import useViewportZoom from '@/hooks/useViewportZoom.js';

export default function CommonLayout(){
  const zoom = useViewportZoom();

  return (
    <RegistrationProvider>
      {/* --zoom: 화면 크기(vw/vh) 기준 값을 배율만큼 되돌려야 하는 곳(모달 등)에서 사용 */}
      <div style={{ zoom, '--zoom': zoom }}>
        <Header />
        <RegisterStep />
        <Outlet />
      </div>
    </RegistrationProvider>
  )
}
