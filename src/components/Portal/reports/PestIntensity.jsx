import { useState } from 'react';
import { styled } from 'styled-components';

import ReportCard from '@/components/Portal/reports/ReportCard.jsx';
import PestLegend from '@/components/Portal/reports/PestLegend.jsx';
import { PEST_TYPES } from '@/constants/pests.js';

const STATUS = {
  priority: { label: 'Priority Exclusion Area', color: '#C4161C' },
  control: { label: 'Under Control', color: '#1E7B1E' },
};

// 막대와 개수 범례는 시안처럼 Cockroaches → Flies → Rodent → Mosquitoes 순서
const BAR_ORDER = ['cockroaches', 'flies', 'rodent', 'mosquitoes'];

// 처음에 보여 줄 개수 — 'View All'을 누르면 전체를 보여 줌
const INITIAL_COUNT = 5;

const total = (counts) => Object.values(counts).reduce((sum, count) => sum + count, 0);

// 층별 / 구역별 해충 강도 막대 목록
// items: [{ name, place?, status, counts: { [pestKey]: number } }]
export default function PestIntensity({ title, subtitle, items }){
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, INITIAL_COUNT);
  // 가장 많은 행이 막대의 약 72%를 채우도록
  const scale = Math.max(1, ...items.map(({ counts }) => total(counts))) / 0.72;

  return (
    <ReportCard title={title} subtitle={subtitle}>
      <IntensityWrap>
        <PestLegend className='legend' items={PEST_TYPES} />

        <ul className='rows'>
          {visible.map(({ name, place, status, counts }) => {
            const pests = BAR_ORDER.map(key => PEST_TYPES.find(pest => pest.key === key)).filter(({ key }) => counts[key]);
            return (
              <li key={`${name}-${place}`}>
                <div className='row-head'>
                  <strong>
                    {name}
                    {place && <span> ({place})</span>}
                  </strong>
                  <em style={{ color: STATUS[status].color }}>{STATUS[status].label}</em>
                </div>
                <div className='bar' role='img'
                  aria-label={pests.map(({ key, label }) => `${label} ${counts[key]}`).join(', ')}>
                  {pests.map(({ key, color }) => (
                    <i key={key} style={{ width: `${(counts[key] / scale) * 100}%`, background: color }} />
                  ))}
                </div>
                <PestLegend className='counts' items={pests} counts={counts} />
              </li>
            );
          })}
        </ul>

        {items.length > INITIAL_COUNT && (
          <button type='button' className='view-all' aria-expanded={showAll} onClick={() => setShowAll(prev => !prev)}>
            {showAll ? 'Show Less' : 'View All'}
          </button>
        )}
      </IntensityWrap>
    </ReportCard>
  )
}

const IntensityWrap = styled.div`
  display:flex;
  flex:1;
  flex-direction: column;
  padding:0 40px 0 22px;

  .legend {
    margin-top:12px;
  }

  .rows {
    margin:6px 0 0 4px;

    > li {
      margin-top:18px;
    }
  }

  .row-head {
    display:flex;
    align-items: flex-end;
    justify-content: space-between;
    gap:12px;

    strong {
      font-weight:700;
      font-size:15px;
      line-height:1.5;
      color:#000;

      span {
        font-weight:400;
      }
    }

    em {
      flex-shrink:0;
      font-style:normal;
      font-size:13px;
      line-height:1.5;
    }
  }

  .bar {
    display:flex;
    height:15px;
    margin-top:6px;
    border:1px solid #D2D6DB;
    border-radius:8px;
    background:#EEF0F3;
    overflow:hidden;

    i {
      height:100%;
    }
  }

  .counts {
    margin:8px 0 0 4px;

    li {
      font-size:13px;
      color:#5E5E5E;
    }
  }

  .view-all {
    align-self:flex-end;
    margin-top:auto;
    padding-top:28px;
    font-family:inherit;
    font-weight:600;
    font-size:14px;
    color:#000;

    &:hover {
      text-decoration:underline;
    }

    &:focus-visible {
      outline:2px solid #0072B9;
      outline-offset:2px;
    }
  }
`
