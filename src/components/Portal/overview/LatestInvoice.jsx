import { QrCode } from 'lucide-react';
import { styled } from 'styled-components';

import PortalCard, { CardButton } from '@/components/Portal/common/PortalCard.jsx';

const STATUS = {
  pending: { label: 'PENDING', color: '#D7191F' },
  paid: { label: 'PAID', color: '#1E7B1E' },
};

const formatRupee = (amount) => `₹ ${amount.toLocaleString('en-IN')}`;

// invoice: { id, cycle, dueDate, status, amount }
export default function LatestInvoice({ invoice, viewAllTo, onPay }){
  const status = STATUS[invoice.status] ?? { label: invoice.status, color: '#333' };

  return (
    <InvoiceWrap title='LATEST INVOICE' underline viewAllTo={viewAllTo}>
      <div className='bill'>
        <div className='bill-head'>
          <div>
            <strong>{invoice.id}</strong>
            <p>{invoice.cycle} | Due : {invoice.dueDate}</p>
          </div>
          <span className='status' style={{ color: status.color }}>{status.label}</span>
        </div>
        <div className='total'>
          <span>Total Payable :</span>
          <span>{formatRupee(invoice.amount)}</span>
        </div>
      </div>

      {invoice.status !== 'paid' && (
        <CardButton type='button' onClick={onPay}>
          <QrCode size={20} strokeWidth={2.2} aria-hidden='true' />
          Pay via UPI / Card / Bank
        </CardButton>
      )}
    </InvoiceWrap>
  )
}

const InvoiceWrap = styled(PortalCard)`
  .bill {
    margin-top:8px;
    padding:14px 22px 20px;
    border-radius:8px;
    background:#EDEDED;
  }

  .bill-head {
    display:flex;
    align-items: flex-end;
    justify-content: space-between;
    gap:16px;
    padding-bottom:14px;
    border-bottom:1px solid #9A9A9A;

    strong {
      font-weight:700;
      font-size:11px;
      line-height:1.8;
      color:#0072B9;
    }

    p {
      font-weight:500;
      font-size:12px;
      line-height:1.4;
      color:#000;
    }

    .status {
      font-weight:700;
      font-size:10px;
      line-height:14px;
    }
  }

  .total {
    display:flex;
    justify-content: space-between;
    gap:16px;
    margin-top:16px;
    font-weight:500;
    font-size:12px;
    color:#000;
  }
`
