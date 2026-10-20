import { Clock } from 'lucide-react';
import { styled } from 'styled-components';

import { StatusBadge } from '@/components/Portal/common/PortalCard.jsx';

const STATUS = {
  scheduled: { label: 'SCHEDULED', tone: 'green' },
  'reschedule-requested': { label: 'RESCHEDULE REQUESTED', tone: 'red' },
};

// 방문 1건 카드 (파란 제목 줄 + 날짜/서비스/시간/기술자 + 하단 버튼)
// visit: { date, services, time, technician, status }
// actions: [{ label, onClick, disabled }]
export default function VisitCard({ title, visit, actions = [] }){
  const status = STATUS[visit.status];

  return (
    <CardWrap>
      <h4>{title}</h4>
      <div className='body'>
        <div className='date-row'>
          <strong className='date'>{visit.date}</strong>
          {status && <StatusBadge $tone={status.tone}>{status.label}</StatusBadge>}
        </div>
        <p className='services'>{visit.services.join(', ')}</p>
        <p className='time'>
          <Clock size={16} strokeWidth={2.5} fill='#0072B9' color='#fff' aria-hidden='true' />
          {visit.time}
        </p>
        <p className='technician'>Assigned Technician: {visit.technician}</p>

        {actions.length > 0 && (
          <div className='actions'>
            {actions.map(({ label, onClick, disabled }) => (
              <button key={label} type='button' onClick={onClick} disabled={disabled}>{label}</button>
            ))}
          </div>
        )}
      </div>
    </CardWrap>
  )
}

const CardWrap = styled.article`
  display:flex;
  flex-direction: column;
  border:1px solid #333;
  border-radius:6px;
  background:#fff;
  overflow:hidden;

  h4 {
    padding:0 24px;
    background:#0072B9;
    font-weight:700;
    font-size:18px;
    line-height:58px;
    color:#fff;
  }

  .body {
    display:flex;
    flex:1;
    flex-direction: column;
    padding:18px 24px 22px;
  }

  .date-row {
    display:flex;
    align-items: flex-start;
    justify-content: space-between;
    gap:12px;
  }

  .date {
    font-weight:700;
    font-size:20px;
    line-height:1.3;
    color:#000;
  }

  .services {
    margin-top:6px;
    font-weight:500;
    font-size:14px;
    line-height:1.5;
    color:#000;
  }

  .time {
    display:flex;
    align-items: center;
    gap:10px;
    margin-top:14px;
    font-size:14px;
    color:#333;

    svg {
      flex-shrink:0;
    }
  }

  .technician {
    margin-top:12px;
    font-weight:600;
    font-size:14px;
    color:#746E6E;
  }

  .actions {
    display:flex;
    flex-wrap:wrap;
    gap:10px;
    margin-top:auto;
    padding-top:22px;

    button {
      min-width:150px;
      height:38px;
      padding:0 18px;
      border-radius:8px;
      background:#0072B9;
      box-shadow:inset 0 4px 30px 0 rgba(0, 0, 0, .18);
      font-family:inherit;
      font-weight:700;
      font-size:13px;
      white-space:nowrap;
      color:#fff;
      transition:filter .2s;

      &:hover:not(:disabled) {
        filter:brightness(1.1);
      }

      &:disabled {
        opacity:.5;
        cursor:not-allowed;
      }

      &:focus-visible {
        outline:2px solid #000;
        outline-offset:2px;
      }
    }
  }
`
