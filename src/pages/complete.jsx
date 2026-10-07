import { useRef, useState } from 'react';
import { BadgeCheck, Download } from 'lucide-react';
import { styled } from 'styled-components';

import ContractReport from '@/components/Register/ContractReport.jsx';
import { useRegistration } from '@/context/RegistrationContext.jsx';
import { toISODate } from '@/utils/registration.js';

// Commercial / Residential 공용 등록 완료 화면

const EMPTY = '-';

const PLAN_TYPE_LABELS = {
  amc: 'AMC',
  onetime: 'One-Time Service',
};

// 'Twice a Week (104 Services/yr)' → 'Twice a Week'
const shortFrequency = (frequency = '') => frequency.split(' (')[0];

export default function RegistrationComplete(){
  const { registration } = useRegistration();
  const { information = {}, plan = {} } = registration;

  const planType = [
    PLAN_TYPE_LABELS[plan.planType],
    plan.frequency && `(${shortFrequency(plan.frequency)})`,
  ].filter(Boolean).join(' ');

  const reportRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  // 화면 밖에 그려둔 리포트를 캡처해서 PDF + PNG를 zip으로 내려받음
  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError('');
    try {
      // 캡처 라이브러리는 용량이 커서 버튼을 눌렀을 때만 불러옴
      const { downloadContract } = await import('@/utils/contractDownload.js');
      const name = (information.contactName || 'customer').trim().replace(/[^A-Za-z0-9-]+/g, '_');
      await downloadContract(reportRef.current, `UST-Contract_${name}_${toISODate(new Date())}`);
    } catch (error) {
      console.error(error);
      setDownloadError('Could not create the contract file. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleLogin = () => {
    // TODO: 로그인 화면 경로 확정 후 이동
  };

  return (
    <CompleteWrap>
      <BadgeCheck className='badge' size={150} fill='#7BA7D7' stroke='#fff' strokeWidth={1.6} aria-hidden='true' />

      <h2>Thank you for taking services from UST Pest Services.</h2>
      <p className='sub'>Customer Profile & Digital Contract successfully registered!</p>

      <div className='summary'>
        <dl>
          <div>
            <dt>Unique Customer ID</dt>
            {/* TODO: 등록 API 응답의 고객 ID로 교체 (서버에서 발급) */}
            <dd>{registration.customerId ?? EMPTY}</dd>
          </div>
          <div>
            <dt>Service</dt>
            <dd>{plan.services?.length > 0 ? plan.services.join(', ') : EMPTY}</dd>
          </div>
          <div>
            <dt>Customer Name</dt>
            <dd>{information.contactName || EMPTY}</dd>
          </div>
          <div>
            <dt>Plan Type</dt>
            <dd>{planType || EMPTY}</dd>
          </div>
        </dl>
      </div>

      <div className='actions'>
        <button type='button' className='download' onClick={handleDownload} disabled={downloading}>
          <Download size={34} strokeWidth={2} aria-hidden='true' />
          <span>{downloading ? 'Preparing Contract…' : 'Download / Print Contract PDF'}</span>
        </button>
        <button type='button' onClick={handleLogin}>Login</button>
      </div>
      {downloadError && <p className='error' role='alert'>{downloadError}</p>}

      {/* 캡처 전용 리포트 — 화면에는 보이지 않음 */}
      <div className='report-holder' aria-hidden='true'>
        <ContractReport ref={reportRef} />
      </div>
    </CompleteWrap>
  )
}

const CompleteWrap = styled.section`
  display:flex;
  flex-direction: column;
  align-items: center;
  width:100%;
  padding:60px 5.9% 80px;
  font-family:'Poppins', sans-serif;
  text-align:center;

  .badge {
    flex-shrink:0;
  }

  h2 {
    margin-top:26px;
    font-weight:700;
    font-size:38px;
    line-height:1.3;
    color:#000;
  }

  .sub {
    margin-top:14px;
    font-weight:700;
    font-size:24px;
    line-height:1.4;
    color:#746E6E;
  }

  .summary {
    width:100%;
    max-width:994px;
    margin-top:60px;
    padding:20px 24px;
    border:1px solid #000;
    border-radius:10px;
    text-align:left;

    dl {
      display:grid;
      grid-template-columns: 1.2fr 1fr;
      gap:40px 60px;
      padding:26px 52px 40px;
      border:1px solid #0072B9;
      border-radius:10px;
      background:rgba(123, 167, 215, .49);

      dt {
        font-weight:700;
        font-size:20px;
        line-height:40px;
        color:#000;
      }

      dd {
        font-weight:500;
        font-size:20px;
        line-height:40px;
        color:#000;
        word-break:break-word;
      }
    }
  }

  .error {
    margin-top:16px;
    font-size:16px;
    color:#D93025;
  }

  .report-holder {
    position:fixed;
    top:0;
    left:-10000px;
    text-align:left;
    pointer-events:none;
  }

  .actions {
    display:flex;
    flex-wrap:wrap;
    justify-content: center;
    gap:20px 85px;
    margin-top:110px;

    button {
      display:flex;
      align-items: center;
      justify-content: center;
      gap:28px;
      min-width:177px;
      height:60px;
      padding:0 38px;
      border-radius:10px;
      background:#0072B9;
      box-shadow:inset 0 4px 70px 0 rgba(0, 0, 0, .25);
      font-family:inherit;
      font-weight:700;
      font-size:24px;
      white-space:nowrap;
      color:#FFFEFE;
      transition:opacity .2s;

      &.download {
        padding:0 38px 0 30px;
      }

      &:hover:not(:disabled) {
        opacity:.9;
      }

      &:disabled {
        opacity:.6;
        cursor:progress;
      }

      &:focus-visible {
        outline:2px solid #000;
        outline-offset:2px;
      }
    }
  }
`
