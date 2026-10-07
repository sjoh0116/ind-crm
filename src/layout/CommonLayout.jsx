import { Outlet } from 'react-router-dom';

import Header from '@/layout/header.jsx'
import RegisterStep from '@/components/Register/RegisterSteps.jsx';
import { RegistrationProvider } from '@/context/RegistrationContext.jsx';

export default function CommonLayout(){
  return (
    <RegistrationProvider>
      <div>
        <Header />
        <RegisterStep />
        <Outlet />
      </div>
    </RegistrationProvider>
  )
}
