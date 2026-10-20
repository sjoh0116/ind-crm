import { useState } from 'react';
import { QrCode } from 'lucide-react';
import { styled } from 'styled-components';

import PortalModal from '@/components/Portal/common/PortalModal.jsx';

const PAYMENT_OPTIONS = [
  { key: 'upi', label: 'UPI QR / App' },
  { key: 'bank', label: 'Bank NEFT / RTGS / Cheque' },
];

// 계좌 이체(NEFT / RTGS / Cheque) 입금 계좌
const BANK_ACCOUNT = [
  { label: 'A/C Name', value: 'UST PEST SERVICES PRIVATE LIMITED' },
  { label: 'A/C NO', value: '924020032612526' },
  { label: 'Bank', value: 'AXIS BANK, Sector 135 Noida' },
  { label: 'IFSC', value: 'UTIB0004618' },
];

const formatRupee = (amount) => `₹ ${amount.toLocaleString('en-IN')}`;

// 결제 수단 선택 + 결제 확인. 닫았다 다시 열면 UPI로 초기화됨
function PayInvoiceForm({ invoice, onConfirm }){
  const [method, setMethod] = useState(PAYMENT_OPTIONS[0].key);

  return (
    <PayWrap>
      <div className='total'>
        <p>TOTAL PAYMENT AMOUNT</p>
        <strong>{formatRupee(invoice.amount)}</strong>
      </div>

      <p className='label' id='payOptionLabel'>Choose Payment Option</p>
      <div className='options' role='group' aria-labelledby='payOptionLabel'>
        {PAYMENT_OPTIONS.map(({ key, label }) => (
          <button key={key} type='button' aria-pressed={method === key} onClick={() => setMethod(key)}>
            {label}
          </button>
        ))}
      </div>

      <div className='detail'>
        {method === 'upi' ? (
          // TODO: 청구서별 UPI QR 이미지 연동 — 지금은 자리만 잡아 둠
          <div className='qr' role='img' aria-label='UPI QR code'>
            <QrCode size={64} strokeWidth={1.5} aria-hidden='true' />
          </div>
        ) : (
          <dl>
            {BANK_ACCOUNT.map(({ label, value }) => (
              <div key={label}>
                <dt>{label} :</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <button type='button' className='confirm' onClick={() => onConfirm(invoice, method)}>
        Confirm Simulated Payment ({formatRupee(invoice.amount)})
      </button>
    </PayWrap>
  )
}

// invoice: { id, amount } | null — null이면 닫힘
export default function PayInvoiceModal({ invoice, onClose }){
  const handleConfirm = () => {
    // TODO: 결제 확인 API 연동 (invoice, method 전달) 후 상태를 'verification'으로 갱신
    onClose();
  };

  return (
    <PortalModal open={!!invoice} title={invoice ? `Pay Invoice  -  ${invoice.id}` : ''} width={560} onClose={onClose}>
      {invoice && <PayInvoiceForm key={invoice.id} invoice={invoice} onConfirm={handleConfirm} />}
    </PortalModal>
  )
}

const PayWrap = styled.div`
  .total {
    padding:22px 16px 24px;
    border:1px solid #6CB4E4;
    background:#F1F8FE;
    text-align:center;

    p {
      font-weight:700;
      font-size:16px;
      line-height:1.4;
      color:#0B4F7C;
    }

    strong {
      display:block;
      margin-top:10px;
      font-weight:700;
      font-size:26px;
      line-height:1.3;
      color:#0072B9;
    }
  }

  .label {
    margin-top:16px;
    font-weight:600;
    font-size:14px;
    line-height:1.4;
  }

  .options {
    display:grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap:42px;
    margin-top:12px;

    button {
      height:34px;
      padding:0 10px;
      border:1px solid #0072B9;
      border-radius:6px;
      background:#fff;
      font-family:inherit;
      font-weight:600;
      font-size:12px;
      white-space:nowrap;
      color:#0072B9;
      transition:background .2s, color .2s;

      &[aria-pressed='true'] {
        background:#0072B9;
        box-shadow:inset 0 4px 30px 0 rgba(0, 0, 0, .18);
        color:#fff;
      }

      &:hover:not([aria-pressed='true']) {
        background:#EAF4FB;
      }

      &:focus-visible {
        outline:2px solid #000;
        outline-offset:2px;
      }
    }
  }

  /* 시안처럼 QR은 크게, 계좌 정보는 내용만큼만 */
  .detail {
    margin-top:16px;
    padding:10px 14px;
    border:1px solid #B9CFE3;
    border-radius:8px;
    background:#F1F8FE;
  }

  .qr {
    display:flex;
    align-items: center;
    justify-content: center;
    width:154px;
    height:154px;
    margin:0 auto;
    border:1px dashed #9DB7CF;
    background:#fff;
    color:#9DB7CF;
  }

  dl div {
    display:flex;
    gap:6px;
    font-size:13px;
    line-height:1.6;
  }

  dt {
    font-weight:700;
    white-space:nowrap;
    color:#000;
  }

  dd {
    font-weight:500;
    color:#4A4A4A;
  }

  .confirm {
    display:block;
    width:100%;
    height:36px;
    margin-top:22px;
    border-radius:8px;
    background:#1E7B4A;
    box-shadow:inset 0 4px 30px 0 rgba(0, 0, 0, .18);
    font-family:inherit;
    font-weight:600;
    font-size:12px;
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
`
