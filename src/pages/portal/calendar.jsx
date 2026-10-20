import { styled } from 'styled-components';

import ServiceCalendar from '@/components/Portal/common/ServiceCalendar.jsx';
import VisitCard from '@/components/Portal/calendar/VisitCard.jsx';
import PastVisits from '@/components/Portal/calendar/PastVisits.jsx';
import {
  SAMPLE_CALENDAR_EVENTS,
  SAMPLE_CALENDAR_START,
  SAMPLE_PAST_VISITS,
  SAMPLE_SERVICE_STATS,
  SAMPLE_UPCOMING_VISITS,
} from '@/pages/portal/sampleData.js';

const STATS = [
  { key: 'frequency', label: 'Frequency', color: '#0072B9' },
  { key: 'completed', label: 'Completed', color: '#1E7B1E' },
  { key: 'scheduled', label: 'Scheduled', color: '#F5A623' },
  { key: 'rescheduleRequested', label: 'Reschedule Requested', color: '#C4161C' },
];

// Portal > Monthly Service Calendar
export default function PortalCalendar(){
  const handleReschedule = () => {
    // TODO: 일정 변경 요청 화면/모달 연동
  };

  const handleViewReport = () => {
    // TODO: 서비스 리포트 보기 연동
  };

  const handleViewSlip = () => {
    // TODO: 완료 확인서(Completion Slip) 보기 연동
  };

  return (
    <CalendarPageWrap>
      <ul className='stats'>
        {STATS.map(({ key, label, color }) => (
          <li key={key}>
            <strong style={{ color }}>{SAMPLE_SERVICE_STATS[key]}</strong>
            <span>{label}</span>
          </li>
        ))}
      </ul>

      <div className='schedule'>
        <ServiceCalendar events={SAMPLE_CALENDAR_EVENTS} start={SAMPLE_CALENDAR_START} />

        <div className='upcoming'>
          {SAMPLE_UPCOMING_VISITS.map(visit => (
            <VisitCard
              key={visit.id}
              title='Upcoming Service'
              visit={visit}
              actions={[{
                label: 'Request Reschedule',
                onClick: () => handleReschedule(visit),
                disabled: visit.status === 'reschedule-requested',
              }]}
            />
          ))}
        </div>
      </div>

      <PastVisits visits={SAMPLE_PAST_VISITS} onViewReport={handleViewReport} onViewSlip={handleViewSlip} />
    </CalendarPageWrap>
  )
}

// 시안(1440px) 기준: 좌우 여백 104px / 92px, 달력 505px : 서비스 목록 711px
const CalendarPageWrap = styled.div`
  display:flex;
  flex-direction: column;
  gap:30px;
  padding:24px 92px 80px 104px;

  .stats {
    display:grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap:24px 55px;
    padding:0 8px;

    li {
      display:flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap:14px;
      min-height:190px;
      padding:20px;
      border:1px solid #A9C7A9;
      border-radius:4px;
      background:#fff;
      text-align:center;
    }

    strong {
      font-weight:700;
      font-size:60px;
      line-height:1;
    }

    span {
      font-weight:600;
      font-size:18px;
      line-height:1.3;
      color:#000;
    }
  }

  .schedule {
    display:grid;
    grid-template-columns: minmax(0, 505fr) minmax(0, 711fr);
    align-items: start;
    gap:28px;
  }

  .upcoming {
    display:flex;
    flex-direction: column;
    gap:24px;
  }
`
