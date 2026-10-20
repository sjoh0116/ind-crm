import { styled } from 'styled-components';

import PortalCard, { StatusBadge } from '@/components/Portal/common/PortalCard.jsx';

const STATUS = {
  assigned: { label: 'Assigned', tone: 'blue' },
  completed: { label: 'Completed', tone: 'green' },
};

// visits: [{ id, service, status, dateTime, technician, operationHead, operationPhone }]
export default function ServiceHistory({ visits, viewAllTo }){
  return (
    <HistoryWrap title='SERVICE HISTORY & SCHEDULED VISITS' accent viewAllTo={viewAllTo}>
      <ul>
        {visits.map(visit => {
          const status = STATUS[visit.status] ?? { label: visit.status };
          return (
            <li key={visit.id}>
              <div className='visit-head'>
                <h4>{visit.service}</h4>
                <StatusBadge $tone={status.tone}>{status.label}</StatusBadge>
              </div>
              <dl>
                <div>
                  <dt>Date &amp; Time</dt>
                  <dd>{visit.dateTime}</dd>
                </div>
                <div>
                  <dt>Assigned Technician:</dt>
                  <dd>{visit.technician}</dd>
                </div>
                <div>
                  <dt>Operation Head</dt>
                  <dd>
                    {visit.operationHead}
                    <br />
                    ({visit.operationPhone})
                  </dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>
    </HistoryWrap>
  )
}

const HistoryWrap = styled(PortalCard)`
  padding:6px 25px 22px 45px;

  ul {
    display:flex;
    flex-direction: column;
    gap:13px;
    margin-top:6px;
  }

  li {
    padding:8px 13px 10px;
    border:1px solid #9FB8CC;
    border-radius:8px;
    background:#F7FAFD;
  }

  .visit-head {
    display:flex;
    align-items: center;
    justify-content: space-between;
    gap:12px;

    h4 {
      font-weight:700;
      font-size:16px;
      line-height:1.5;
      color:#0072B9;
    }
  }

  dl {
    display:grid;
    grid-template-columns: 233fr 316fr 139fr;
    column-gap:12px;
    margin-top:4px;

    dt {
      font-size:12px;
      line-height:1.7;
      color:#746E6E;
    }

    dd {
      font-weight:500;
      font-size:12px;
      line-height:1.6;
      color:#000;
    }
  }
`
