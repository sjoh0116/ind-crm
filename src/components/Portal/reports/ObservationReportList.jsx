import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { styled } from 'styled-components';

import ReportPanel from '@/components/Portal/reports/ReportPanel.jsx';

const REPORT_TYPES = [
  { key: 'all', label: 'All Reports' },
  { key: 'observation', label: 'Observation Report' },
  { key: 'rca', label: 'Root Cause Analysis Report' },
];

const STATUS = {
  'action-required': { label: 'Action Required', color: '#C4161C' },
  'partially-closed': { label: 'Partially Closed', color: '#C4161C' },
  'fully-closed': { label: 'Fully Closed', color: '#1E7B1E' },
};

// 처음에 보여 줄 개수 — 'View All'을 누르면 전체를 보여 줌
const INITIAL_COUNT = 4;

// Site Observation 탭의 점검 보고서 목록
export default function ObservationReportList({ reports, onOpen, onDownload }){
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState(REPORT_TYPES[0].key);
  const [showAll, setShowAll] = useState(false);

  // 보고서 이름 또는 날짜로 찾기
  const search = keyword.trim().toLowerCase();
  const filtered = reports.filter(report => (type === 'all' || report.type === type)
    && (!search || `${report.title} ${report.dateTime}`.toLowerCase().includes(search)));
  const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);

  return (
    <ReportPanel title='Pest Control Site Inspection Report' actions={(
      <ListActions>
        <label className='search'>
          <Search size={20} strokeWidth={2} aria-hidden='true' />
          <input type='search' aria-label='Search reports' placeholder='Report Name or Date......'
            value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        </label>
        <div className='select'>
          <select aria-label='Report type' value={type} onChange={(e) => setType(e.target.value)}>
            {REPORT_TYPES.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
          </select>
          <ChevronDown size={20} strokeWidth={2} aria-hidden='true' />
        </div>
        {filtered.length > INITIAL_COUNT && (
          <button type='button' className='view-all' aria-expanded={showAll} onClick={() => setShowAll(prev => !prev)}>
            {showAll ? 'Show Less' : 'View All'}
          </button>
        )}
      </ListActions>
    )}>
      <ListWrap>
        {visible.length > 0 ? (
          <ul>
            {visible.map(report => {
              const status = STATUS[report.status];
              return (
                <li key={report.id}>
                  <div className='info'>
                    <h5>{report.title}</h5>
                    <dl>
                      <div>
                        <dt>Date &amp; Time</dt>
                        <dd>{report.dateTime}</dd>
                      </div>
                      <div>
                        <dt>Inspection Personnel:</dt>
                        <dd>{report.personnel}</dd>
                      </div>
                      <div>
                        <dt>Status</dt>
                        <dd style={{ color: status.color }}>{status.label}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className='actions'>
                    <button type='button' onClick={() => onOpen(report)}>Open / Update</button>
                    <button type='button' onClick={() => onDownload(report)}>Download</button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : <p className='empty'>No reports found.</p>}
      </ListWrap>
    </ReportPanel>
  )
}

const ListActions = styled.div`
  display:flex;
  align-items: center;
  gap:12px;

  .search {
    display:flex;
    align-items: center;
    gap:8px;
    width:250px;
    height:36px;
    padding:0 12px;
    border:1px solid #BDC4CC;
    border-radius:4px;
    background:#fff;
    color:#5E5E5E;

    &:focus-within {
      outline:2px solid #fff;
      outline-offset:1px;
    }

    input {
      flex:1;
      min-width:0;
      border:0;
      font-family:inherit;
      font-size:13px;
      line-height:1.6;
      color:#000;
      outline:none;

      &::placeholder {
        color:#9A9A9A;
      }
    }
  }

  .select {
    position:relative;

    select {
      height:36px;
      padding:0 40px 0 12px;
      border:1px solid #BDC4CC;
      border-radius:4px;
      background:#fff;
      font-family:inherit;
      font-weight:600;
      font-size:13px;
      color:#0B4F7C;
      appearance:none;
      cursor:pointer;

      &:focus-visible {
        outline:2px solid #fff;
        outline-offset:1px;
      }
    }

    svg {
      position:absolute;
      top:50%;
      right:10px;
      transform:translateY(-50%);
      color:#0B4F7C;
      pointer-events:none;
    }
  }

  .view-all {
    min-width:90px;
    font-family:inherit;
    font-weight:600;
    font-size:18px;
    color:#fff;

    &:hover {
      text-decoration:underline;
    }

    &:focus-visible {
      outline:2px solid #fff;
      outline-offset:2px;
    }
  }
`

const ListWrap = styled.div`
  ul {
    display:flex;
    flex-direction: column;
    gap:18px;
  }

  li {
    display:flex;
    align-items: center;
    gap:24px;
    padding:10px 14px 14px;
    border:1px solid #BDBDBD;
    border-radius:6px;
    background:#F7FAFD;
  }

  .info {
    flex:1;
    min-width:0;

    h5 {
      font-weight:700;
      font-size:15px;
      line-height:1.5;
      color:#0072B9;
    }
  }

  dl {
    display:grid;
    grid-template-columns: 309fr 303fr 250fr;
    column-gap:12px;
    margin-top:2px;

    dt {
      font-size:12px;
      line-height:1.6;
      color:#746E6E;
    }

    dd {
      font-weight:500;
      font-size:12px;
      line-height:1.5;
      color:#000;
    }
  }

  .actions {
    display:flex;
    flex-shrink:0;
    gap:8px;

    button {
      min-width:150px;
      height:36px;
      padding:0 14px;
      border-radius:6px;
      background:#0B5C94;
      box-shadow:inset 0 4px 30px 0 rgba(0, 0, 0, .18);
      font-family:inherit;
      font-weight:700;
      font-size:12px;
      white-space:nowrap;
      color:#fff;
      transition:filter .2s;

      &:hover {
        filter:brightness(1.15);
      }

      &:focus-visible {
        outline:2px solid #000;
        outline-offset:2px;
      }
    }
  }

  .empty {
    padding:24px 0;
    font-size:14px;
    color:#746E6E;
  }
`
