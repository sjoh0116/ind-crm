import { Outlet } from 'react-router-dom';

import Header from '@/layout/header.jsx'
import RegisterStep from '@/components/Register/RegisterSteps.jsx';

export default function CommonLayout(){
  return (
    <>
      <div>
        <Header />
        <RegisterStep />
        <Outlet />
      </div>
    </>
  )
}