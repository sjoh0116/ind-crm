import { Download } from 'lucide-react';
import { styled } from 'styled-components';

import PortalCard, { CardButton } from '@/components/Portal/common/PortalCard.jsx';

// contract: { customerId, planType, validity, monthlyBilling, salesIncharge, operationIncharge, warranty, services }
export default function ContractSummary({ contract, onDownload }){
  return (
    <SummaryWrap title='CONTRACT SUMMARY' underline>
      <dl>
        <div>
          <dt>Unique Customer ID:</dt>
          <dd className='id'>{contract.customerId}</dd>
        </div>
        <div>
          <dt>Plan Type:</dt>
          <dd className='strong'>{contract.planType}</dd>
        </div>
        <div>
          <dt>Validity:</dt>
          <dd>{contract.validity}</dd>
        </div>
        <div>
          <dt>Monthly Billing:</dt>
          <dd>{contract.monthlyBilling}</dd>
        </div>
        <div>
          <dt>Sales Incharge:</dt>
          <dd>{contract.salesIncharge}</dd>
        </div>
        <div>
          <dt>Operation Incharge:</dt>
          <dd>{contract.operationIncharge}</dd>
        </div>
        <div>
          <dt>Warranty:</dt>
          <dd className='warranty'>{contract.warranty}</dd>
        </div>
        <div className='services'>
          <dt>Services:</dt>
          <dd>
            <ul>
              {contract.services.map(({ name, count }) => (
                <li key={name}>{name} : {count}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      <CardButton type='button' onClick={onDownload}>
        <Download size={20} strokeWidth={2.2} aria-hidden='true' />
        Download Signed Contract
      </CardButton>
    </SummaryWrap>
  )
}

const SummaryWrap = styled(PortalCard)`
  dl > div {
    display:flex;
    align-items: baseline;
    justify-content: space-between;
    gap:16px;
    min-height:25px;
    border-bottom:1px solid #BDBDBD;

    &.services {
      padding-top:2px;
      border-bottom:0;
    }
  }

  dt {
    flex-shrink:0;
    font-weight:600;
    font-size:11px;
    line-height:24px;
    color:#746E6E;
  }

  dd {
    font-weight:500;
    font-size:12px;
    line-height:24px;
    text-align:right;
    color:#000;

    &.id {
      font-weight:700;
      color:#0072B9;
    }

    &.strong {
      font-weight:700;
    }

    &.warranty {
      font-weight:600;
      color:#1E7B1E;
    }

    ul {
      text-align:left;
    }

    li {
      line-height:1.7;
    }
  }
`
