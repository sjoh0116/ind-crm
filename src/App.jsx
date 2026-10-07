import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import GlobalStyles from '@/assets/js/GlobalStyles.js';

import TestHome from '@/pages/test.jsx';
import Register from '@/pages/account/register.jsx';
import CommercialInfo from '@/pages/commercial/information.jsx';
import CommercialPlan from '@/pages/commercial/plan.jsx';
import CommercialProperty from '@/pages/commercial/property.jsx';
import ResidentialInfo from '@/pages/residential/information.jsx';
import ResidentialPlan from '@/pages/residential/plan.jsx';
import ResidentialProperty from '@/pages/residential/property.jsx';
import TermsSign from '@/pages/sign.jsx';
import RegistrationComplete from '@/pages/complete.jsx';
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
            <Route path='/commercial/plan' element={<CommercialPlan />}/>
            <Route path='/commercial/property' element={<CommercialProperty />}/>
            <Route path='/commercial/sign' element={<TermsSign />}/>
            <Route path='/commercial/complete' element={<RegistrationComplete />}/>
            <Route path='/residential/information' element={<ResidentialInfo />}/>
            <Route path='/residential/plan' element={<ResidentialPlan />}/>
            <Route path='/residential/property' element={<ResidentialProperty />}/>
            <Route path='/residential/sign' element={<TermsSign />}/>
            <Route path='/residential/complete' element={<RegistrationComplete />}/>
          </Route>
          <Route path='/register' element={<Register />}/>
        </Routes>
      </Suspense>
    </>
  );
}