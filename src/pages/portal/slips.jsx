import { useState } from 'react';
import { ReceiptText } from 'lucide-react';
import { styled } from 'styled-components';

import { SAMPLE_COMPLETION_SLIPS } from '@/pages/portal/sampleData.js';

// 처음에 보여 줄 개수 — 'View All'을 누르면 전체를 보여 줌
const INITIAL_COUNT = 9;

// Portal > Services Completion Slips
export default function PortalSlips(){
  const [showAll, setShowAll] = useState(false);
  const slips = showAll ? SAMPLE_COMPLETION_SLIPS : SAMPLE_COMPLETION_SLIPS.slice(0, INITIAL_COUNT);
  const hasMore = SAMPLE_COMPLETION_SLIPS.length > INITIAL_COUNT;

  const handleView = () => {
    // TODO: 디지털 완료 확인서 보기 연동
  };

  const handleDownload = () => {
    // TODO: 완료 확인서 다운로드 연동
  };

  return (
    <SlipsWrap>
      <section className='panel' aria-labelledby='slipsTitle'>
        <div className='panel-head'>
          <h3 id='slipsTitle'>
            <ReceiptText size={26} strokeWidth={2} aria-hidden='true' />
            Services Completion Slip
          </h3>
          {hasMore && (
            <button type='button' className='view-all' aria-expanded={showAll}
              onClick={() => setShowAll(prev => !prev)}>
              {showAll ? 'Show Less' : 'View All'}
            </button>
          )}
        </div>

        {slips.length > 0 ? (
          <ul>
            {slips.map(slip => (
              <li key={slip.id}>
                <div className='info'>
                  <h4>{slip.title}</h4>
                  <dl>
                    <div>
                      <dt>Date &amp; Time</dt>
                      <dd>{slip.dateTime}</dd>
                    </div>
                    <div>
                      <dt>Assigned Technician:</dt>
                      <dd>{slip.technician}</dd>
                    </div>
                    <div>
                      <dt>Operation Head</dt>
                      <dd>
                        {slip.operationHead}
                        <br />
                        ({slip.operationPhone})
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className='actions'>
                  <button type='button' onClick={() => handleView(slip)}>View Digital Slip</button>
                  <button type='button' onClick={() => handleDownload(slip)}>Download Slip</button>
                </div>
              </li>
            ))}
          </ul>
        ) : <p className='empty'>No completion slips yet.</p>}
      </section>
    </SlipsWrap>
  )
}

// 시안(1440px) 기준: 좌우 여백 77px
const SlipsWrap = styled.div`
  padding:28px 78px 80px 77px;

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
    justify-content: space-between;
    gap:16px;
    min-height:69px;
    padding:0 40px 0 46px;
    background:#0072B9;
    color:#fff;

    h3 {
      display:flex;
      align-items: center;
      gap:20px;
      font-weight:600;
      font-size:20px;
      line-height:1.3;
    }

    .view-all {
      font-family:inherit;
      font-weight:600;
      font-size:20px;
      color:#fff;

      &:hover {
        text-decoration:underline;
      }

      &:focus-visible {
        outline:2px solid #fff;
        outline-offset:2px;
      }
    }
  }

  ul {
    display:flex;
    flex-direction: column;
    gap:16px;
    padding:36px 40px 40px;
  }

  li {
    display:flex;
    align-items: center;
    gap:24px;
    padding:10px 14px 12px;
    border:1px solid #BDBDBD;
    border-radius:6px;
    background:#F7FAFD;
  }

  .info {
    flex:1;
    min-width:0;

    h4 {
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
      min-width:156px;
      height:38px;
      padding:0 14px;
      border-radius:6px;
      background:#0072B9;
      box-shadow:inset 0 4px 30px 0 rgba(0, 0, 0, .18);
      font-family:inherit;
      font-weight:700;
      font-size:12px;
      white-space:nowrap;
      color:#fff;
      transition:filter .2s;

      &:hover {
        filter:brightness(1.1);
      }

      &:focus-visible {
        outline:2px solid #000;
        outline-offset:2px;
      }
    }
  }

  .empty {
    padding:36px 40px;
    font-size:14px;
    color:#746E6E;
  }
`
