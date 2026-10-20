import { useState } from 'react';
import { ArrowDown, Check, ChevronLeft } from 'lucide-react';
import { styled } from 'styled-components';

import ReportPanel from '@/components/Portal/reports/ReportPanel.jsx';

const RISKS = {
  high: { label: 'High Pest Risk', background: '#F8D4D5', color: '#C4161C' },
  medium: { label: 'Medium Pest Risk', background: '#FDE7C2', color: '#B26A00' },
  low: { label: 'Low Pest Risk', background: '#D3E6F7', color: '#0B5C94' },
};

const ALL_FLOORS = 'all';

const countStatus = (items) => ({
  open: items.filter(({ status }) => status !== 'closed').length,
  closed: items.filter(({ status }) => status === 'closed').length,
});

// Site Observation 보고서 상세: 왼쪽 층 목록 + 오른쪽 관찰 항목
export default function ObservationReportDetail({ report, onBack, onDownload }){
  // 항목별 상태 ('Mark as Done' 후 Submit 하면 'verification')
  const [items, setItems] = useState(report.observations);
  const [floor, setFloor] = useState(ALL_FLOORS);
  // 'Mark as Done'에 체크했지만 아직 Submit 하지 않은 항목 id
  const [checked, setChecked] = useState(() => new Set());

  const floors = [
    { key: ALL_FLOORS, label: 'All Floors', ...countStatus(items) },
    ...report.floors.map(name => ({ key: name, label: name, ...countStatus(items.filter(item => item.floor === name)) })),
  ];
  const visible = floor === ALL_FLOORS ? items : items.filter(item => item.floor === floor);
  const floorLabel = floor === ALL_FLOORS ? 'All floors' : floor;

  const toggleChecked = (id) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = (id) => {
    // TODO: 조치 완료 제출 API 연동 (report.id, id 전달)
    setItems(prev => prev.map(item => (item.id === id ? { ...item, status: 'verification' } : item)));
    setChecked(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <ReportPanel title={report.title}
      before={(
        <button type='button' className='back' aria-label='Back to report list' onClick={onBack}>
          <ChevronLeft size={26} strokeWidth={2.5} aria-hidden='true' />
        </button>
      )}
      actions={(
        <DownloadButton type='button' aria-label='Download report' onClick={() => onDownload(report)}>
          <ArrowDown size={20} strokeWidth={2.5} aria-hidden='true' />
        </DownloadButton>
      )}>
      <DetailWrap>
        <aside className='floors'>
          <h5>{report.building}</h5>
          <p>Tap a floor to see its observations.</p>
          <ul>
            {floors.map(({ key, label, open, closed }) => (
              <li key={key}>
                <button type='button' aria-pressed={floor === key} onClick={() => setFloor(key)}>
                  <strong>{label}</strong>
                  <span className='scope'>Whole Building</span>
                  <span className='counts'>
                    <em className='open'>{open} Open</em>
                    <em className='closed'>{closed} Closed</em>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className='observations' aria-labelledby='observationTitle'>
          <h5 id='observationTitle'>Observation Report</h5>
          <p>
            {floorLabel}, {visible.length} Observations from our inspectors.
            Tick an item once the corrective action suggested is completed.
          </p>

          <ul>
            {visible.map(item => {
              const risk = RISKS[item.risk];
              const done = item.status !== 'open';
              return (
                <li key={item.id}>
                  <div className='photo'>
                    {item.photo ? <img src={item.photo} alt={item.title} /> : 'Photo / Video'}
                  </div>
                  <div className='content'>
                    <span className='place'>{item.floor} - {item.area}</span>
                    <h6>{item.title}</h6>
                    <span className='risk' style={{ background: risk.background, color: risk.color }}>{risk.label}</span>
                    <p className='action'><strong>Action to take :</strong> {item.action}</p>

                    {item.status === 'closed' ? (
                      <span className='state closed'>Closed</span>
                    ) : (
                      <div className='done'>
                        <label>
                          <input type='checkbox' checked={done || checked.has(item.id)} disabled={done}
                            onChange={() => toggleChecked(item.id)} />
                          <span className='box' aria-hidden='true'><Check size={14} strokeWidth={3.5} /></span>
                          Mark as Done
                        </label>
                        {item.status === 'verification' ? (
                          <span className='state pending'>Verification Pending</span>
                        ) : (
                          <button type='button' className='submit' disabled={!checked.has(item.id)}
                            onClick={() => handleSubmit(item.id)}>Submit</button>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </DetailWrap>
    </ReportPanel>
  )
}

const DownloadButton = styled.button`
  display:flex;
  align-items: center;
  justify-content: center;
  width:40px;
  height:40px;
  border:1px solid #fff;
  border-radius:4px;
  color:#fff;

  &:hover {
    background:rgba(255, 255, 255, .2);
  }

  &:focus-visible {
    outline:2px solid #fff;
    outline-offset:2px;
  }
`

const DetailWrap = styled.div`
  display:grid;
  grid-template-columns: minmax(0, 360fr) minmax(0, 860fr);
  align-items: start;
  gap:22px;

  .floors,
  .observations {
    border:1px solid #333;
    border-radius:6px;
    background:#fff;
  }

  .floors {
    padding:16px 10px 18px;

    > h5 {
      padding:0 6px;
      font-weight:700;
      font-size:22px;
      line-height:1.4;
    }

    > p {
      padding:0 6px;
      font-size:13px;
      line-height:1.5;
      color:#333;
    }

    ul {
      display:flex;
      flex-direction: column;
      gap:10px;
      margin-top:10px;
    }

    button {
      display:flex;
      flex-direction: column;
      width:100%;
      padding:8px 12px 10px;
      border:1px solid #E1E5EA;
      border-radius:6px;
      background:#fff;
      font-family:inherit;
      text-align:left;
      color:#000;
      transition:background .2s, border-color .2s;

      &:hover {
        background:#F4F8FC;
      }

      &[aria-pressed='true'] {
        border-color:#6CA6D6;
        background:#EEF4FA;
      }

      &:focus-visible {
        outline:2px solid #0072B9;
        outline-offset:2px;
      }
    }

    strong {
      font-weight:700;
      font-size:17px;
      line-height:1.4;
    }

    .scope {
      font-size:12px;
      line-height:1.5;
      color:#333;
    }

    .counts {
      display:grid;
      grid-template-columns: 90px auto;
      margin-top:2px;
      font-weight:600;
      font-size:12px;

      em {
        font-style:normal;
      }

      .open {
        color:#C4161C;
      }

      .closed {
        color:#1E7B1E;
      }
    }
  }

  .observations {
    padding:16px 12px 18px;

    > h5 {
      padding:0 4px;
      font-weight:700;
      font-size:22px;
      line-height:1.4;
    }

    > p {
      padding:0 4px;
      font-size:14px;
      line-height:1.5;
      color:#333;
    }

    ul {
      display:flex;
      flex-direction: column;
      gap:10px;
      margin-top:6px;
    }

    li {
      display:flex;
      gap:20px;
      padding:12px 14px;
      border:1px solid #E1E5EA;
      border-radius:6px;
      background:#fff;
    }
  }

  .photo {
    display:flex;
    flex-shrink:0;
    align-items: center;
    justify-content: center;
    width:300px;
    height:212px;
    border:1px solid #D6DEE6;
    border-radius:6px;
    background:#F3F6FA;
    overflow:hidden;
    font-size:18px;
    color:#5E5E5E;

    img {
      width:100%;
      height:100%;
      object-fit:cover;
    }
  }

  .content {
    flex:1;
    min-width:0;
    padding-top:2px;
  }

  .place {
    display:block;
    font-weight:500;
    font-size:12px;
    line-height:1.5;
  }

  h6 {
    margin-top:6px;
    font-weight:600;
    font-size:18px;
    line-height:1.35;
  }

  .risk,
  .state {
    display:inline-block;
    padding:0 10px;
    border-radius:2px;
    font-weight:600;
    font-size:11px;
    line-height:20px;
  }

  .risk {
    margin-top:8px;
  }

  .action {
    margin-top:8px;
    font-size:14px;
    line-height:1.5;

    strong {
      font-weight:700;
    }
  }

  .state {
    margin-top:14px;

    &.closed {
      background:#CFE8CF;
      color:#1E7B1E;
    }

    &.pending {
      margin-top:0;
      background:#FDE7C2;
      color:#B26A00;
    }
  }

  .done {
    display:flex;
    align-items: center;
    gap:16px;
    margin-top:10px;

    label {
      position:relative;
      display:flex;
      align-items: center;
      gap:10px;
      font-size:13px;
      color:#746E6E;
      cursor:pointer;
    }

    input {
      position:absolute;
      opacity:0;
    }

    .box {
      display:flex;
      align-items: center;
      justify-content: center;
      width:24px;
      height:24px;
      border:1px solid #BDC4CC;
      border-radius:3px;
      background:#fff;
      color:transparent;
    }

    input:checked + .box {
      border-color:#0B5C94;
      background:#0B5C94;
      color:#fff;
    }

    input:disabled + .box {
      cursor:default;
    }

    input:focus-visible + .box {
      outline:2px solid #0072B9;
      outline-offset:2px;
    }
  }

  .submit {
    min-width:110px;
    height:34px;
    padding:0 16px;
    border-radius:6px;
    background:#0B5C94;
    box-shadow:inset 0 4px 30px 0 rgba(0, 0, 0, .18);
    font-family:inherit;
    font-weight:700;
    font-size:12px;
    color:#fff;
    transition:filter .2s, opacity .2s;

    &:hover:not(:disabled) {
      filter:brightness(1.15);
    }

    &:disabled {
      opacity:.55;
      cursor:not-allowed;
    }

    &:focus-visible {
      outline:2px solid #000;
      outline-offset:2px;
    }
  }
`
