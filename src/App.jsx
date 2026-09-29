import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import GlobalStyles from '@/assets/js/GlobalStyles.js';

import TestHome from '@/pages/test.jsx';
import Register from '@/pages/account/register.jsx';
import CommercialInfo from '@/pages/commercial/information.jsx';
import ResidentialInfo from '@/pages/residential/information.jsx';
import CommonLayout from '@/layout/CommonLayout.jsx'

export default function App() {

  return (
    <>
      <Suspense>
        <GlobalStyles />
        <Routes>
          <Route element={<CommonLayout />}>
            <Route path='/' element={<TestHome />}/>
            <Route path='/commercial/information' element={<CommercialInfo />}/>
            <Route path='/residential/information' element={<ResidentialInfo />}/>
          </Route>
          <Route path='/register' element={<Register />}/>
        </Routes>
      </Suspense>
    </>
  );
}