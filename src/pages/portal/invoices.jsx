import { useState } from 'react';
import { CircleCheck, FileText } from 'lucide-react';
import { styled } from 'styled-components';

import PayInvoiceModal from '@/components/Portal/invoices/PayInvoiceModal.jsx';
import { SAMPLE_INVOICES } from '@/pages/portal/sampleData.js';

// 처음에 보여 줄 개수 — 'View All'을 누르면 전체를 보여 줌
const INITIAL_COUNT = 7;

const STATUS = {
  pending: { label: 'PENDING', tone: 'red' },
  verification: { label: 'VERIFICATION PENDING', tone: 'orange' },
  paid: { label: 'PAID', tone: 'green' },
};

const formatRupee = (amount) => `₹ ${amount.toLocaleString('en-IN')}`;

// Portal > Invoice & Pay Bill
export default function PortalInvoices(){
  const [showAll, setShowAll] = useState(false);
  // 결제 모달에 띄울 청구서 (null이면 닫힘)
  const [payingInvoice, setPayingInvoice] = useState(null);
  const invoices = showAll ? SAMPLE_INVOICES : SAMPLE_INVOICES.slice(0, INITIAL_COUNT);
  const hasMore = SAMPLE_INVOICES.length > INITIAL_COUNT;

  const renderAction = (invoice) => {
    if (invoice.status === 'pending') {
      return <button type='button' className='pay' onClick={() => setPayingInvoice(invoice)}>PAY NOW</button>;
    }
    if (invoice.status === 'verification') {
      return <span className='state verifying'>UNDER VERIFICATION</span>;
    }
    return (
      <span className='state paid'>
        <CircleCheck size={18} strokeWidth={2.5} fill='#1E7B1E' color='#fff' aria-hidden='true' />
        PAID
      </span>
    );
  };

  return (
    <InvoicesWrap>
      <section className='panel' aria-labelledby='invoicesTitle'>
        <div className='panel-head'>
          <h3 id='invoicesTitle'>
            <FileText size={30} strokeWidth={2} aria-hidden='true' />
            Invoice &amp; Pay Bill
          </h3>
          {hasMore && (
            <button type='button' className='view-all' aria-expanded={showAll}
              onClick={() => setShowAll(prev => !prev)}>
              {showAll ? 'Show Less' : 'View All'}
            </button>
          )}
        </div>

        <div className='table-box'>
          <table>
            <thead>
              <tr>
                <th scope='col'>Invoice Number</th>
                <th scope='col'>Invoice Date</th>
                <th scope='col'>Due Date</th>
                <th scope='col'>Amount (₹)</th>
                <th scope='col'>Status</th>
                <th scope='col'>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => {
                const status = STATUS[invoice.status];
                return (
                  <tr key={invoice.id}>
                    <td>{invoice.id}</td>
                    <td>{invoice.invoiceDate}</td>
                    <td>{invoice.dueDate}</td>
                    <td>{formatRupee(invoice.amount)}</td>
                    <td><span className={`badge ${status.tone}`}>{status.label}</span></td>
                    <td>{renderAction(invoice)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {invoices.length === 0 && <p className='empty'>No invoices yet.</p>}
        </div>
      </section>

      <PayInvoiceModal invoice={payingInvoice} onClose={() => setPayingInvoice(null)} />
    </InvoicesWrap>
  )
}

const TONES = {
  red: { background: '#F8D4D5', color: '#C4161C' },
  orange: { background: '#FDE7C2', color: '#C4161C' },
  green: { background: '#CFE8CF', color: '#1E7B1E' },
};

// 시안(1440px) 기준: 상자 좌 87px / 우 70px, 표는 상자 안쪽 42px
const InvoicesWrap = styled.div`
  padding:50px 70px 80px 87px;

  .panel {
    min-height:1400px;
    border:1px solid #BDBDBD;
    border-radius:6px;
    background:#fff;
    overflow:hidden;
  }

  .panel-head {
    display:flex;
    align-items: center;
    justify-content: space-between;
    gap:16px;
    min-height:72px;
    padding:0 46px 0 40px;
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

  .table-box {
    margin:25px 41px 0 42px;
    padding-bottom:12px;
    border:1px solid #D6DEE6;
    border-radius:8px;
    background:#fff;
    overflow:hidden;
  }

  table {
    width:100%;
    border-collapse:collapse;
    table-layout:fixed;
  }

  th,
  td {
    padding:0 13px;
    text-align:center;
    white-space:nowrap;
  }

  /* 첫 열(청구서 번호)만 왼쪽 정렬 */
  th:first-child,
  td:first-child {
    text-align:left;
  }

  /* 시안의 열 위치(1200px 기준) */
  th:nth-child(1) { width:21%; }
  th:nth-child(2) { width:15%; }
  th:nth-child(3) { width:15%; }
  th:nth-child(4) { width:16%; }
  th:nth-child(5) { width:19%; }

  thead th {
    height:39px;
    border-bottom:1px solid #D6DEE6;
    font-weight:700;
    font-size:14px;
    color:#0072B9;
  }

  tbody td {
    height:54px;
    font-weight:700;
    font-size:14px;
    color:#000;
  }

  .badge {
    display:inline-block;
    padding:0 8px;
    border-radius:3px;
    font-weight:700;
    font-size:11px;
    line-height:19px;

    ${Object.entries(TONES).map(([tone, { background, color }]) => `
      &.${tone} { background:${background}; color:${color}; }
    `).join('')}
  }

  .pay {
    min-width:94px;
    height:36px;
    padding:0 16px;
    border-radius:6px;
    background:#0072B9;
    box-shadow:inset 0 4px 30px 0 rgba(0, 0, 0, .18);
    font-family:inherit;
    font-weight:700;
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

  .state {
    display:inline-flex;
    align-items: center;
    gap:8px;
    font-weight:700;
    font-size:13px;

    &.paid {
      color:#1E7B1E;
    }

    &.verifying {
      color:#C4161C;
    }
  }

  .empty {
    padding:24px 13px 10px;
    font-size:14px;
    color:#746E6E;
  }
`
