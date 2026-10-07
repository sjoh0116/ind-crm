import { useState } from 'react';
import { styled } from 'styled-components';

import { useRegistration } from '@/context/RegistrationContext.jsx';
import {
  formatRupees,
  formatSlashDate,
  getCustomerCategory,
  getPricing,
  toISODate,
} from '@/utils/registration.js';

const EMPTY = '-';
// 헤더가 같은 로고를 일반 <img>로 먼저 불러와 CORS 헤더 없는 응답이 캐시되므로,
// 캡처용 요청은 쿼리를 붙여 캐시가 섞이지 않게 함
const LOGO_URL = 'https://ust-india.s3.ap-northeast-2.amazonaws.com/crm/ust_logo.webp?v=report';

function Row({ label, value }){
  return (
    <div className='row'>
      <dt>{label}</dt>
      <dd>: {value || EMPTY}</dd>
    </div>
  )
}

// 계약서 PDF 캡처용 리포트 (A4 세로, 794px 고정 폭). ref로 받은 DOM을 html2canvas로 찍는다
export default function ContractReport({ ref }){
  const { registration } = useRegistration();
  const {
    category = {}, information = {}, plan = {}, property = {}, signatures = {},
  } = registration;
  // CORS로 불러오지 못하면 캔버스에 그릴 수 없으므로 글자로 대체
  const [logoFailed, setLogoFailed] = useState(false);

  const isCommercial = category.customerType === 'commercial';
  const pricing = getPricing(plan);

  return (
    <ReportWrap ref={ref}>
      <header>
        <div className='deco' aria-hidden='true'>
          <i /><i /><i /><i />
        </div>
        {logoFailed ? (
          <div className='logo-text'>
            <strong>UST INDIA</strong>
            <span>PEST SERVICES PRIVATE LIMITED</span>
          </div>
        ) : (
          <img src={LOGO_URL} alt='UST India Pest Services Private Limited' crossOrigin='anonymous'
            onError={() => setLogoFailed(true)} />
        )}
      </header>

      <div className='sheet'>
        <div className='top'>
          <p><strong>Unique Customer ID</strong> : {registration.customerId ?? EMPTY}</p>
          <p><strong>Date</strong> : {formatSlashDate(toISODate(new Date()))}</p>
        </div>

        <section>
          <h4>Customer Information</h4>
          <dl className='two-col'>
            <Row label='Customer Name' value={information.contactName} />
            {isCommercial ? <Row label='Company Name' value={information.companyName} /> : <div />}
            <Row label='Email Address' value={information.email} />
            <Row label='Contact Number' value={information.mobile} />
            <div className='wide'><Row label='Billing Address' value={information.billingAddress} /></div>
            <div className='wide'><Row label='Service Address' value={information.serviceAddress} /></div>
            <Row label='Customer Category' value={getCustomerCategory(category)} />
            {isCommercial ? <Row label='GST Number' value={information.gstNumber} /> : <div />}
            <Row label='Property Type' value={property.propertyType} />
          </dl>
        </section>

        <div className='columns'>
          <div>
            <section>
              <h4>Contract Period</h4>
              <dl>
                <Row label='Start Date' value={formatSlashDate(plan.startDate)} />
                <Row label='End Date' value={formatSlashDate(plan.endDate)} />
              </dl>
            </section>

            <section>
              <h4>Pricing</h4>
              <dl>
                <Row label={plan.planType === 'onetime' ? 'Contract Value' : 'Annual Value'}
                  value={pricing ? formatRupees(pricing.value) : ''} />
                <Row label='GST as applicable @ 18%' value={pricing ? formatRupees(pricing.gst) : ''} />
                <Row label='Total Value' value={pricing ? formatRupees(pricing.total) : ''} />
                <Row label='Payment Terms' value={plan.paymentTerms} />
              </dl>
            </section>
          </div>

          <section>
            <h4>Services Details</h4>
            <div className='services'>
              <p className='svc-title'>Service Frequency <small>(as per category)</small></p>
              {property.serviceFrequencies?.length > 0 ? (
                <ul>
                  {property.serviceFrequencies.map(({ service, count }) => (
                    <li key={service}>
                      <span>{service}</span>
                      <span>: {count}</span>
                    </li>
                  ))}
                </ul>
              ) : <p>{EMPTY}</p>}
              <p className='svc-title'>Visit Frequency</p>
              <p>{plan.frequency || EMPTY}</p>
            </div>
          </section>
        </div>

        <div className='columns'>
          <section>
            <h4>UST Employee Details</h4>
            {/* TODO: 영업 담당자 목록(API) 연동 후 연락처/이메일 채우기 */}
            <dl className='narrow'>
              <Row label='Name' value={information.salesPerson} />
              <Row label='Phone no.' value='' />
              <Row label='E-mail' value='' />
            </dl>
          </section>

          <section>
            <h4>Specifications</h4>
            <p className='spec'>{property.specifications || EMPTY}</p>
          </section>
        </div>

        <div className='signs'>
          <figure>
            <div className='sign-box'>
              {signatures.customerSignature && <img src={signatures.customerSignature} alt='' />}
            </div>
            <figcaption>Customer Signature</figcaption>
          </figure>
          <figure>
            <div className='sign-box'>
              {signatures.salesSignature && <img src={signatures.salesSignature} alt='' />}
            </div>
            <figcaption>UST Employee Signature</figcaption>
          </figure>
        </div>
      </div>
    </ReportWrap>
  )
}

const ReportWrap = styled.div`
  width:794px;
  min-height:1123px;
  padding:0 16px 24px;
  background:#fff;
  font-family:'Poppins', sans-serif;
  font-size:13px;
  line-height:1.75;
  letter-spacing:0;
  color:#000;

  * {
    letter-spacing:0;
  }

  header {
    position:relative;
    display:flex;
    align-items: center;
    justify-content: flex-end;
    height:100px;
    margin:0 -16px;
    padding:0 30px;
    overflow:hidden;

    /* 헤더 좌측 장식 (S3 이미지 대신 CSS로 그림) */
    .deco {
      position:absolute;
      top:0;
      left:0;
      width:150px;
      height:100%;

      i {
        position:absolute;
        display:block;
        border-radius:4px;
        transform:rotate(45deg);
      }

      i:nth-child(1) { top:-40px; left:-10px; width:110px; height:110px; background:rgba(52, 142, 199, .19); }
      i:nth-child(2) { top:-10px; left:-50px; width:100px; height:100px; background:rgba(52, 142, 199, .4); }
      i:nth-child(3) { top:20px; left:-20px; width:90px; height:90px; background:rgba(52, 142, 199, .3); }
      i:nth-child(4) { top:-25px; left:25px; width:100px; height:100px; background:rgba(52, 142, 199, .19); }
    }

    img {
      position:relative;
      display:block;
      height:40px;
    }

    .logo-text {
      position:relative;
      display:flex;
      flex-direction: column;
      align-items: flex-end;
      line-height:1.2;
      color:#0072B9;

      strong {
        font-weight:800;
        font-size:26px;
      }

      span {
        font-weight:500;
        font-size:9px;
        color:#000;
      }
    }
  }

  .sheet {
    border:1px solid #333;
  }

  .top {
    display:flex;
    justify-content: space-between;
    padding:22px 30px 18px 20px;

    strong {
      font-weight:700;
    }
  }

  section {
    margin-bottom:22px;
  }

  h4 {
    padding:0 18px;
    background:#0072B9;
    font-weight:700;
    font-size:13px;
    line-height:30px;
    color:#fff;
  }

  dl {
    padding:14px 18px 0;

    &.two-col {
      display:grid;
      grid-template-columns: repeat(2, 1fr);
      column-gap:20px;

      .wide {
        grid-column:1 / -1;
      }
    }

    .row {
      display:grid;
      grid-template-columns: 180px 1fr;
      column-gap:8px;
    }

    &.two-col .row {
      grid-template-columns: 138px 1fr;
    }

    &.narrow .row {
      grid-template-columns: 76px 1fr;
    }

    dt {
      font-weight:700;
    }

    dd {
      font-weight:400;
      word-break:break-word;
    }
  }

  .columns {
    display:grid;
    grid-template-columns: 1.1fr 1fr;
    column-gap:24px;
    align-items: start;
  }

  .services {
    padding:14px 18px 0;

    .svc-title {
      margin-top:10px;
      font-weight:700;

      &:first-child {
        margin-top:0;
      }

      small {
        font-size:10px;
        color:#746E6E;
      }
    }

    li {
      display:grid;
      grid-template-columns: 210px 1fr;
      column-gap:8px;
    }
  }

  .spec {
    min-height:90px;
    margin:14px 0 0;
    padding:14px 16px;
    border:1px solid #333;
    border-radius:8px;
    white-space:pre-wrap;
    word-break:break-word;
  }

  .signs {
    display:flex;
    justify-content: space-between;
    padding:16px 18px 26px;

    figure {
      width:290px;
      margin:0;

      &:last-child figcaption {
        text-align:right;
      }
    }

    .sign-box {
      display:flex;
      align-items: center;
      justify-content: center;
      height:190px;
      border:1px dashed #333;
      border-radius:8px;

      img {
        display:block;
        max-width:100%;
        max-height:100%;
        object-fit:contain;
      }
    }

    figcaption {
      margin-top:18px;
      font-weight:700;
    }
  }
`
