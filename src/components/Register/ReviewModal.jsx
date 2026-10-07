import { useEffect, useRef, useState } from 'react';
import { TriangleAlert, X } from 'lucide-react';
import { styled } from 'styled-components';

import { useRegistration } from '@/context/RegistrationContext.jsx';
import { SKIP_VALIDATION } from '@/config.js';
import {
  PLAN_TYPE_LABELS,
  formatLongDate,
  formatRupees,
  getCustomerCategory,
  getPricing,
} from '@/utils/registration.js';

const EMPTY = '-';

function Row({ label, value, wide }){
  return (
    <div className={`row${wide ? ' wide' : ''}`}>
      <dt>{label}</dt>
      <dd>: {value || EMPTY}</dd>
    </div>
  )
}

// 마지막 단계에서 등록 전 입력 내용을 확인하는 모달
export default function ReviewModal({ open, onClose, onConfirm }){
  const dialogRef = useRef(null);
  const [confirmed, setConfirmed] = useState(false);
  const { registration } = useRegistration();
  const { category = {}, information = {}, plan = {}, property = {} } = registration;

  // <dialog>의 showModal()이 포커스 가두기, Esc 닫기, 배경 비활성화를 처리
  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();

    if (!open) return undefined;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; };
  }, [open]);

  const handleClose = () => {
    setConfirmed(false);
    onClose();
  };

  const isCommercial = category.customerType === 'commercial';
  const customerCategory = getCustomerCategory(category);

  const contractPeriod = plan.startDate && plan.endDate
    ? `${formatLongDate(plan.startDate)} to ${formatLongDate(plan.endDate)}`
    : '';

  const pricing = getPricing(plan);

  return (
    <ModalWrap
      ref={dialogRef}
      aria-labelledby='reviewTitle'
      onCancel={(e) => { e.preventDefault(); handleClose(); }}
    >
      <div className='modal-head'>
        <h3 id='reviewTitle'>Review Your Registration Details</h3>
        <button type='button' className='close' aria-label='Close' onClick={handleClose}>
          <X size={38} strokeWidth={3} aria-hidden='true' />
        </button>
      </div>

      <div className='modal-body'>
        <p className='lead'>Please review all the details below carefully before completing your registration.</p>

        <section>
          <h4>Customer Information</h4>
          <dl className='two-col'>
            <Row label='Customer Name' value={information.contactName} />
            {isCommercial && <Row label='Company Name' value={information.companyName} />}
            <Row label='Email Address' value={information.email} />
            <Row label='Contact Number' value={information.mobile} />
            <Row label='Billing Address' value={information.billingAddress} wide />
            <Row label='Service Address' value={information.serviceAddress} wide />
            <Row label='Customer Category' value={customerCategory} />
            {isCommercial && <Row label='GST Number' value={information.gstNumber} />}
            <Row label='Property Type' value={property.propertyType} />
          </dl>
        </section>

        <section>
          <h4>Service Details</h4>
          <dl className='one-col'>
            <Row label='Service Plan' value={PLAN_TYPE_LABELS[plan.planType]} />
            <Row label='Visit Frequency' value={plan.frequency} />
            <div className='row'>
              <dt>Service Frequency (as per category)</dt>
              <dd>
                {property.serviceFrequencies?.length > 0 ? (
                  <ul>
                    {property.serviceFrequencies.map(({ service, count }) => (
                      <li key={service}>
                        <span>{service}</span>
                        <span>: {count}</span>
                      </li>
                    ))}
                  </ul>
                ) : `: ${EMPTY}`}
              </dd>
            </div>
            <Row label='Contract Period' value={contractPeriod} />
          </dl>
        </section>

        <section>
          <h4>Pricing</h4>
          <dl className='one-col'>
            <Row label={plan.planType === 'onetime' ? 'Contract Value' : 'Annual Value'}
              value={pricing ? formatRupees(pricing.value) : ''} />
            <Row label='GST as applicable @ 18%' value={pricing ? formatRupees(pricing.gst) : ''} />
            <Row label='Total Value' value={pricing ? formatRupees(pricing.total) : ''} />
          </dl>
        </section>

        <div className='note'>
          <TriangleAlert size={34} strokeWidth={2} aria-hidden='true' />
          <p>
            <strong>Important Note : </strong>
            Please make sure all the information provided above is correct. These details will be used for your
            service registration, pest control treatment records, services reports, invoices, and customer portal access.
          </p>
        </div>

        <label className='confirm'>
          <input type='checkbox' checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
          <span>I have reviewed all the details and confirm that the information provided is correct.</span>
        </label>

        <div className='modal-foot'>
          <button type='button' onClick={handleClose}>Go Back & Edit</button>
          <button type='button' disabled={!SKIP_VALIDATION && !confirmed} onClick={onConfirm}>
            Confirm & Complete Registration
          </button>
        </div>
      </div>
    </ModalWrap>
  )
}

const ModalWrap = styled.dialog`
  width:1087px;
  max-width:calc(100vw - 32px);
  max-height:calc(100vh - 32px);
  margin:auto;
  padding:0;
  border:1px solid #0072B9;
  border-radius:30px;
  background:#fff;
  font-family:'Poppins', sans-serif;
  color:#000;
  overflow:hidden;

  &[open] {
    display:flex;
    flex-direction: column;
  }

  &::backdrop {
    background:rgba(0, 0, 0, .5);
  }

  .modal-head {
    position:relative;
    display:flex;
    align-items: center;
    justify-content: center;
    flex-shrink:0;
    height:103px;
    padding:0 90px 0 130px;
    background:url('https://ust-india.s3.ap-northeast-2.amazonaws.com/crm/header_deco.webp') left -92px top 50% no-repeat;

    h3 {
      font-weight:700;
      font-size:40px;
      line-height:1.2;
      text-align:center;
      color:#0072B9;
    }

    .close {
      position:absolute;
      top:50%;
      right:38px;
      display:flex;
      transform:translateY(-50%);
      border-radius:6px;
      color:#3D7CC9;

      &:hover {
        color:#0072B9;
      }

      &:focus-visible {
        outline:2px solid #0072B9;
        outline-offset:2px;
      }
    }
  }

  .modal-body {
    padding:0 67px 30px;
    overflow-y:auto;

    .lead {
      padding:6px 0 10px;
      font-weight:700;
      font-size:20px;
      line-height:1.3;
      text-align:center;
      color:#746E6E;
    }

    section {
      margin-bottom:22px;

      h4 {
        padding:0 45px;
        background:#0072B9;
        font-weight:700;
        font-size:14px;
        line-height:33px;
        color:#fff;
      }

      dl {
        display:grid;
        column-gap:24px;
        padding:14px 45px 0;

        &.two-col {
          grid-template-columns: repeat(2, 1fr);

          .row {
            grid-template-columns: 178px 1fr;
          }
        }

        &.one-col .row {
          grid-template-columns: 340px 1fr;
        }

        .row {
          display:grid;
          column-gap:10px;

          &.wide {
            grid-column:1 / -1;
          }

          dt {
            font-weight:700;
            font-size:14px;
            line-height:25px;
          }

          dd {
            font-weight:300;
            font-size:14px;
            line-height:25px;
            word-break:break-word;

            li {
              display:grid;
              grid-template-columns: minmax(0, 220px) auto;
              column-gap:10px;
              justify-content: start;
              line-height:20px;

              /* 첫 줄만 ':'를 붙여 다른 행과 줄을 맞춤 */
              span:first-child::before {
                content:': ';
                visibility:hidden;
              }

              &:first-child span:first-child::before {
                visibility:visible;
              }
            }
          }
        }
      }
    }

    .note {
      display:flex;
      align-items: center;
      gap:14px;
      padding:20px 39px;
      border-radius:20px;
      background:rgba(185, 185, 0, .08);

      svg {
        flex-shrink:0;
        color:#1F4E8C;
      }

      p {
        font-weight:300;
        font-size:16px;
        line-height:25px;

        strong {
          font-weight:700;
        }
      }
    }

    .confirm {
      display:flex;
      align-items: center;
      gap:16px;
      margin-top:22px;
      padding:0 9px 16px;
      border-bottom:1px solid #9A9A9A;
      cursor:pointer;

      input {
        appearance:none;
        flex-shrink:0;
        width:25px;
        height:22px;
        border:2px solid #000;
        background:#fff;
        cursor:pointer;

        &:checked {
          border-color:#0072B9;
          background:#0072B9 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='3'%3E%3Cpath d='M5 12l5 5 9-10'/%3E%3C/svg%3E") center / 16px no-repeat;
        }

        &:focus-visible {
          outline:2px solid #0072B9;
          outline-offset:2px;
        }
      }

      span {
        font-size:14px;
        line-height:1.5;
      }
    }

    .modal-foot {
      display:flex;
      flex-wrap:wrap;
      justify-content: center;
      gap:20px 70px;
      margin-top:22px;

      button {
        height:60px;
        padding:0 32px;
        border-radius:10px;
        background:#0072B9;
        box-shadow:inset 0 4px 70px 0 rgba(0, 0, 0, .25);
        font-family:inherit;
        font-weight:700;
        font-size:24px;
        white-space:nowrap;
        color:#FFFEFE;
        transition:opacity .2s;

        &:hover:not(:disabled) {
          opacity:.9;
        }

        &:disabled {
          opacity:.5;
          cursor:not-allowed;
        }

        &:focus-visible {
          outline:2px solid #000;
          outline-offset:2px;
        }
      }
    }
  }
`
