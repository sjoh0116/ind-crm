import { useState } from 'react';
import { CirclePlus, ThumbsUp, TriangleAlert } from 'lucide-react';
import { styled } from 'styled-components';

import BannerModals from '@/components/Portal/layout/BannerModals.jsx';

// Portal 공통 배너: 고객 요약 + 주요 액션 버튼
// customer: { name, customerId, planLabel, frequency, serviceAddress }
export default function PortalBanner({ customer }){
  // 열려 있는 모달: 'request' | 'feedback' | 'complaint' | null
  const [activeModal, setActiveModal] = useState(null);

  return (
    <BannerWrap>
      <div className='box'>
        <div className='summary'>
          <ul className='tags'>
            <li>My Services Portal</li>
            <li>{customer.planLabel}</li>
            <li>Customer ID: {customer.customerId}</li>
          </ul>
          <h1>Welcome, {customer.name}</h1>
        </div>

        <div className='actions'>
          <button type='button' className='request' onClick={() => setActiveModal('request')}>
            <CirclePlus size={20} strokeWidth={2.5} aria-hidden='true' />
            <span>Request Additional Services</span>
          </button>
          <button type='button' className='feedback' onClick={() => setActiveModal('feedback')}>
            <ThumbsUp size={20} strokeWidth={2.5} aria-hidden='true' />
            <span>Give Feedback</span>
          </button>
          <button type='button' className='complaint' onClick={() => setActiveModal('complaint')}>
            <TriangleAlert size={20} strokeWidth={2.5} aria-hidden='true' />
            <span>Raise Complaint</span>
          </button>
        </div>

        <p className='meta'>
          Frequency: {customer.frequency} | Services Address: {customer.serviceAddress}
        </p>
      </div>

      <BannerModals active={activeModal} onClose={() => setActiveModal(null)} />
    </BannerWrap>
  )
}

const BannerWrap = styled.section`
  padding:5px 4px 2px;

  .box {
    /* 1행: 고객 요약 | 액션 버튼, 2행: 서비스 정보(전체 폭) */
    display:grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap:14px 24px;
    min-height:173px;
    padding:21px 44px 24px 76px;
    border-radius:12px;
    background:linear-gradient(90deg, #0A4F86 0%, #0A69A9 55%, #0A5C98 100%);
    color:#fff;
  }

  .summary {
    min-width:0;

    .tags {
      display:flex;
      flex-wrap:wrap;
      gap:7px;

      li {
        padding:0 13px;
        border:1px solid #fff;
        border-radius:6px;
        font-weight:500;
        font-size:13px;
        line-height:24px;
        white-space:nowrap;
      }
    }

    h1 {
      margin-top:6px;
      font-weight:500;
      font-size:28px;
      line-height:1.4;
    }
  }

  .meta {
    grid-column:1 / -1;
    font-weight:400;
    font-size:13px;
    line-height:1.6;
  }

  .actions {
    display:flex;
    flex-shrink:0;
    gap:16px;

    button {
      display:flex;
      align-items: center;
      justify-content: center;
      gap:8px;
      height:53px;
      padding:0 18px;
      border-radius:8px;
      font-family:inherit;
      font-weight:700;
      font-size:15px;
      white-space:nowrap;
      color:#fff;
      transition:filter .2s;

      &:hover {
        filter:brightness(1.08);
      }

      &:focus-visible {
        outline:2px solid #fff;
        outline-offset:2px;
      }

      &.request {
        background:#F2B233;
      }

      &.feedback {
        background:#1E7B1E;
      }

      &.complaint {
        background:#D7191F;
      }
    }
  }
`
