import { useState } from 'react';

import ObservationReportList from '@/components/Portal/reports/ObservationReportList.jsx';
import ObservationReportDetail from '@/components/Portal/reports/ObservationReportDetail.jsx';

// Reports > Site Observation Report 탭: 목록에서 'Open / Update'를 누르면 상세로
export default function SiteObservation({ reports }){
  const [openId, setOpenId] = useState(null);
  const openReport = reports.find(({ id }) => id === openId);

  const handleDownload = () => {
    // TODO: 점검 보고서 PDF 다운로드 연동 (report 전달)
  };

  return openReport ? (
    <ObservationReportDetail key={openReport.id} report={openReport}
      onBack={() => setOpenId(null)} onDownload={handleDownload} />
  ) : (
    <ObservationReportList reports={reports} onOpen={({ id }) => setOpenId(id)} onDownload={handleDownload} />
  );
}
