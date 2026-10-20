import { useState } from 'react';
import { CirclePlus, ScrollText } from 'lucide-react';
import { styled } from 'styled-components';

import BannerModals from '@/components/Portal/layout/BannerModals.jsx';
import { SAMPLE_COMPLAINTS } from '@/pages/portal/sampleData.js';

const PRIORITY_LABELS = {
  urgent: 'Urgent',
  medium: 'Medium',
  low: 'Low',
};

const STATUS = {
  open: { label: 'OPEN', background: '#FDE7C2', color: '#B26A00' },
  'in-progress': { label: 'IN PROGRESS', background: '#F8D4D5', color: '#C4161C' },
  resolved: { label: 'RESOLVED', background: '#CFE8CF', color: '#1E7B1E' },
};

// Portal > My Complaints
export default function PortalComplaints(){
  // 'Raise New Complaint'는 배너의 'Raise Complaint'와 같은 모달을 염
  const [raiseOpen, setRaiseOpen] = useState(false);

  return (
    <ComplaintsWrap>
      <section className='panel' aria-labelledby='complaintsTitle'>
        <div className='panel-head'>
          <ScrollText size={36} strokeWidth={1.75} aria-hidden='true' />
          <div className='title'>
            <h3 id='complaintsTitle'>Complaints &amp; Ticket Desk</h3>
            <p>Track complaint resolutions, technician revisit reports, and service tickets</p>
          </div>
          <button type='button' className='raise' onClick={() => setRaiseOpen(true)}>
            <CirclePlus size={20} strokeWidth={2.25} aria-hidden='true' />
            Raise New Complaint
          </button>
        </div>

        {SAMPLE_COMPLAINTS.length > 0 ? (
          <ul>
            {SAMPLE_COMPLAINTS.map(complaint => {
              const status = STATUS[complaint.status] ?? STATUS.open;
              return (
                <li key={complaint.id}>
                  <div className='item-head'>
                    <h4>
                      {PRIORITY_LABELS[complaint.priority]} :&nbsp; {complaint.subject}
                    </h4>
                    <span className='badge' style={{ background: status.background, color: status.color }}>
                      {status.label}
                    </span>
                  </div>
                  <p className='desc'>{complaint.description}</p>
                  {complaint.resolution && (
                    <p className='resolution'>
                      <strong>UST Resolution</strong> : {complaint.resolution}
                    </p>
                  )}
                  <p className='logged'>Logged : {complaint.loggedAt}</p>
                </li>
              );
            })}
          </ul>
        ) : <p className='empty'>No complaints yet.</p>}
      </section>

      <BannerModals active={raiseOpen ? 'complaint' : null} onClose={() => setRaiseOpen(false)} />
    </ComplaintsWrap>
  )
}

// 시안(1440px) 기준: 좌우 여백 80px, 목록은 상자 안쪽 40px
const ComplaintsWrap = styled.div`
  padding:40px 80px 80px;

  .panel {
    min-height:1400px;
    border:1px solid #9A9A9A;
    border-radius:8px;
    background:#fff;
    overflow:hidden;
  }

  .panel-head {
    display:flex;
    align-items: center;
    gap:28px;
    min-height:84px;
    padding:10px 40px 10px 46px;
    background:#0072B9;
    color:#fff;

    .title {
      flex:1;
      min-width:0;
    }

    h3 {
      font-weight:600;
      font-size:20px;
      line-height:1.4;
    }

    p {
      font-size:12px;
      line-height:1.5;
    }
  }

  .raise {
    display:flex;
    flex-shrink:0;
    align-items: center;
    justify-content: center;
    gap:12px;
    min-width:248px;
    height:52px;
    padding:0 20px;
    border-radius:6px;
    background:#F8B62D;
    box-shadow:inset 0 4px 30px 0 rgba(0, 0, 0, .12), 0 2px 6px 0 rgba(0, 0, 0, .2);
    font-family:inherit;
    font-weight:600;
    font-size:16px;
    white-space:nowrap;
    color:#fff;
    transition:filter .2s;

    &:hover {
      filter:brightness(1.05);
    }

    &:focus-visible {
      outline:2px solid #fff;
      outline-offset:2px;
    }
  }

  ul {
    display:flex;
    flex-direction: column;
    gap:18px;
    padding:58px 40px 40px;
  }

  li {
    padding:12px 12px 14px;
    border:1px solid #D6DEE6;
    border-radius:6px;
    background:#F8FAFD;
  }

  .item-head {
    display:flex;
    align-items: flex-start;
    justify-content: space-between;
    gap:24px;

    h4 {
      font-weight:700;
      font-size:17px;
      line-height:1.5;
      color:#0072B9;
    }
  }

  .badge {
    flex-shrink:0;
    min-width:108px;
    margin-top:5px;
    padding:0 8px;
    border-radius:2px;
    font-weight:700;
    font-size:11px;
    line-height:15px;
    text-align:center;
  }

  .desc {
    margin-top:14px;
    font-size:15px;
    line-height:1.5;
    color:#000;
  }

  .resolution {
    margin:12px 0 0 12px;
    padding:8px 18px;
    border:1px solid #333;
    border-radius:8px;
    background:#F4F8EA;
    font-size:12px;
    line-height:1.5;
    color:#000;

    strong {
      font-weight:700;
      color:#0072B9;
    }
  }

  .logged {
    margin-top:12px;
    font-size:14px;
    line-height:1.5;
    color:#746E6E;
  }

  .empty {
    padding:58px 40px;
    font-size:14px;
    color:#746E6E;
  }
`
