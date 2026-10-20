import { useState } from 'react';
import { styled } from 'styled-components';

import UpcomingService from '@/components/Portal/overview/UpcomingService.jsx';
import ServiceHistory from '@/components/Portal/overview/ServiceHistory.jsx';
import RateService from '@/components/Portal/overview/RateService.jsx';
import ContractSummary from '@/components/Portal/overview/ContractSummary.jsx';
import LatestInvoice from '@/components/Portal/overview/LatestInvoice.jsx';
import PayInvoiceModal from '@/components/Portal/invoices/PayInvoiceModal.jsx';
import ServiceCalendar from '@/components/Portal/common/ServiceCalendar.jsx';
import {
  SAMPLE_CALENDAR_EVENTS,
  SAMPLE_CALENDAR_START,
  SAMPLE_CONTRACT,
  SAMPLE_INVOICE,
  SAMPLE_UPCOMING_SERVICE,
  SAMPLE_VISITS,
} from '@/pages/portal/sampleData.js';

// Portal > Overview & Services
export default function PortalOverview(){
  const [payOpen, setPayOpen] = useState(false);

  const handleDownloadContract = () => {
    // TODO: 서명된 계약서 다운로드 연동
  };


  return (
    <OverviewWrap>
      <div className='col'>
        <UpcomingService service={SAMPLE_UPCOMING_SERVICE} />
        <ServiceHistory visits={SAMPLE_VISITS} viewAllTo='/portal/slips' />
        <RateService />
      </div>

      <div className='col'>
        <ContractSummary contract={SAMPLE_CONTRACT} onDownload={handleDownloadContract} />
        <LatestInvoice invoice={SAMPLE_INVOICE} viewAllTo='/portal/invoices' onPay={() => setPayOpen(true)} />
        <ServiceCalendar events={SAMPLE_CALENDAR_EVENTS} start={SAMPLE_CALENDAR_START} />
      </div>

      <PayInvoiceModal invoice={payOpen ? SAMPLE_INVOICE : null} onClose={() => setPayOpen(false)} />
    </OverviewWrap>
  )
}

// 시안(1440px) 기준: 왼쪽 776px, 오른쪽 521px, 사이 39px, 좌우 여백 58px / 46px
const OverviewWrap = styled.div`
  display:grid;
  grid-template-columns: minmax(0, 776fr) minmax(0, 521fr);
  align-items: start;
  column-gap:39px;
  padding:16px 46px 80px 58px;

  .col {
    display:flex;
    flex-direction: column;
    gap:24px;
  }
`
