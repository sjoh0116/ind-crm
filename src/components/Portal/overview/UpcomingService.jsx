import { styled } from 'styled-components';

import PortalCard, { StatusBadge } from '@/components/Portal/common/PortalCard.jsx';

// service: { status, date, time, technician }
export default function UpcomingService({ service }){
  return (
    <UpcomingWrap title='UPCOMING SERVICES' accent tone='note'
      badge={<StatusBadge $tone='red'>{service.status}</StatusBadge>}>
      <p className='schedule'>
        Your next pest service is scheduled for <strong>{service.date}</strong>, at <strong>{service.time}</strong>.
      </p>
      <p className='technician'>
        Assigned Technician: <strong>{service.technician}</strong>
      </p>
      <p className='notice'>
        *Instant Alerts: Any change in the operator&apos;s scheduled arrival time will trigger an immediate SMS/App
        notification. Please note that the operator&apos;s arrival time may vary by up to 30 minutes due to heavy
        traffic or other unforeseen circumstances.
      </p>
    </UpcomingWrap>
  )
}

const UpcomingWrap = styled(PortalCard)`
  padding:6px 45px 20px;

  p {
    line-height:1.5;
    color:#000;
  }

  strong {
    font-weight:700;
    color:#0072B9;
  }

  .schedule {
    font-size:13px;
  }

  .technician {
    margin-top:8px;
    font-weight:700;
    font-size:12px;
  }

  .notice {
    margin-top:8px;
    font-size:9px;
    color:#333;
  }
`
