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
import PortalLayout from '@/layout/PortalLayout.jsx';
import PortalPlaceholder from '@/pages/portal/placeholder.jsx';
import PortalOverview from '@/pages/portal/overview.jsx';
import PortalProperties from '@/pages/portal/properties.jsx';
import PortalCalendar from '@/pages/portal/calendar.jsx';
import PortalSlips from '@/pages/portal/slips.jsx';
import PortalInvoices from '@/pages/portal/invoices.jsx';
import PortalReports from '@/pages/portal/reports.jsx';
import PortalComplaints from '@/pages/portal/complaints.jsx';
import { PORTAL_MENUS } from '@/components/Portal/layout/PortalNav.jsx';

// 구현된 Portal 화면 (PORTAL_MENUS의 path 기준). 여기에 없는 메뉴는 자리 표시 화면이 나옴
const PORTAL_PAGES = {
  '': <PortalOverview />,
  properties: <PortalProperties />,
  calendar: <PortalCalendar />,
  slips: <PortalSlips />,
  invoices: <PortalInvoices />,
  reports: <PortalReports />,
  complaints: <PortalComplaints />,
};

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
          <Route path='/portal' element={<PortalLayout />}>
            {PORTAL_MENUS.map(({ path, label }) => (
              <Route
                key={label}
                index={!path}
                path={path || undefined}
                element={PORTAL_PAGES[path] ?? <PortalPlaceholder title={label} />}
              />
            ))}
          </Route>
          <Route path='/register' element={<Register />}/>
        </Routes>
      </Suspense>
    </>
  );
}