import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';
import { styled } from 'styled-components';

import StepButtons from '@/components/Register/StepButtons.jsx';
import SignatureBox from '@/components/Register/SignatureBox.jsx';
import ReviewModal from '@/components/Register/ReviewModal.jsx';
import { useRegistration } from '@/context/RegistrationContext.jsx';
import { SKIP_VALIDATION } from '@/config.js';

// Commercial / Residential 공용 T&C & Sign 단계

const TERMS = [
  {
    title: 'Scope of Service:',
    text: 'Treatment will be provided only for the pest categories, areas, and services selected in the Service Order/Agreement.',
  },
  {
    title: 'Service & Treatment:',
    text: 'Services will be carried out as per the agreed service plan, frequency, and methodology. Additional services or pest categories not included in the agreed scope may be charged separately.',
  },
  {
    title: 'Customer Access:',
    text: 'The Customer shall provide safe, free, and unobstructed access to the premises at the scheduled time and ensure that the areas to be treated are accessible for effective service delivery.',
  },
  {
    title: 'Customer Responsibilities:',
    text: 'The Customer agrees to follow hygiene, safety, preparation, and other recommendations provided by UST Pest Services. Failure to follow such recommendations may affect treatment effectiveness.',
  },
  {
    title: 'Chemicals & Safety:',
    text: "Only approved chemicals and treatment methods will be used as per applicable regulations and UST Pest Services' standard operating procedures. The Customer must follow all safety instructions provided by the service operator.",
  },
  {
    title: 'Callback/Warranty:',
    text: 'Any applicable callback service or warranty is valid during the active contract period and is subject to the agreed service scope and compliance with the recommendations provided by UST Pest Services.',
  },
  {
    title: 'Service Complaints:',
    text: 'Any complaint related to a service visit should be reported to UST Pest Services within the applicable service/contract period for appropriate action.',
  },
  {
    title: 'Payment:',
    text: 'The Customer agrees to pay the applicable service charges and taxes as per the selected plan/service agreement. For recurring services, invoices may be generated automatically as per the agreed billing cycle.',
  },
  {
    title: 'Cancellation & Termination:',
    text: 'Cancellation or termination of services will be governed by the terms mentioned in the Service Agreement/Service Order. All outstanding dues must be cleared upon termination.',
  },
  {
    title: 'Rodent Control Equipment:',
    text: 'Any rodent bait stations/boxes or other equipment installed by UST Pest Services remain the property of UST Pest Services and will be collected/removed after termination or expiry of the service contract. Any loss or damage caused by the Customer may be chargeable.',
  },
  {
    title: 'Access for Removal:',
    text: 'After expiry or termination, the Customer agrees to provide reasonable access to UST Pest Services for the removal of any equipment or installations provided as part of the service.',
  },
  {
    title: 'Data & Privacy:',
    text: 'Information provided through this form may be collected, stored, and used for service delivery, customer communication, billing, records, and compliance with applicable laws.',
  },
  {
    title: 'Service Effectiveness:',
    text: 'Pest activity may be influenced by hygiene, structural conditions, environmental factors, neighbouring premises, and other factors outside the control of UST Pest Services. The Customer agrees to follow recommended preventive measures.',
  },
  {
    title: 'Digital Acceptance:',
    text: 'By selecting “I Agree” / “Accept” and submitting this form, the Customer confirms that the information provided is accurate and agrees to these Terms & Conditions and the applicable Service Agreement/Service Order.',
  },
];

const SIGNATURE_REQUIRED = 'Signature is required.';

export default function TermsSign(){
  const navigate = useNavigate();
  const [customerSignature, setCustomerSignature] = useState(null);
  const [salesSignature, setSalesSignature] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const { registration, saveStep } = useRegistration();
  // '/commercial/sign' → 'commercial'
  const customerType = useLocation().pathname.split('/')[1];

  const handleSaveDraft = () => {
    const draft = { customerSignature, salesSignature };
    // TODO: 임시 저장 API 연동
  };

  const handleComplete = () => {
    if (!SKIP_VALIDATION && (!customerSignature || !salesSignature)) {
      setShowErrors(true);
      return;
    }

    // 서명이 모두 있으면 등록 전 확인 모달을 띄움
    setReviewOpen(true);
  };

  const handleConfirm = () => {
    // 서명은 PNG data URL (data:image/png;base64,...)
    const signatures = { customerSignature, salesSignature };
    const data = { ...registration, signatures };
    // TODO: 등록 API 호출 — 성공하면 응답의 고객 ID를 saveStep('customerId', ...)로 저장
    saveStep('signatures', signatures);
    // 완료 화면에서 Back으로 서명 화면에 돌아오지 않도록 replace
    navigate(`/${customerType}/complete`, { replace: true });
  };

  return (
    <SignWrap>
      <div className='terms' tabIndex={0} role='region' aria-label='Terms and Conditions'>
        <h4>UST PEST SERVICES PRIVATE LIMITED - TERMS & CONDITIONS:</h4>
        <p className='lead'>
          By submitting this form and accepting these Terms & Conditions, the Customer agrees to the following:
        </p>
        <ol>
          {TERMS.map(({ title, text }) => (
            <li key={title}>
              <strong>{title}</strong> {text}
            </li>
          ))}
        </ol>
      </div>

      <div className='signatures'>
        <SignatureBox
          label='Customer Digital Signature'
          required
          error={showErrors && !customerSignature ? SIGNATURE_REQUIRED : ''}
          onChange={setCustomerSignature}
        />
        <SignatureBox
          label='UST Sales Representative Signature'
          required
          error={showErrors && !salesSignature ? SIGNATURE_REQUIRED : ''}
          onChange={setSalesSignature}
        />
      </div>

      <StepButtons
        onSaveDraft={handleSaveDraft}
        onBack={() => navigate(-1)}
        onNext={handleComplete}
        nextLabel='Complete Registration'
        nextIcon={BadgeCheck}
      />

      <ReviewModal open={reviewOpen} onClose={() => setReviewOpen(false)} onConfirm={handleConfirm} />
    </SignWrap>
  )
}

const SignWrap = styled.section`
  width:100%;
  padding:50px 6.5% 60px;
  font-family:'Poppins', sans-serif;

  .terms {
    height:462px;
    padding:24px 60px 24px 21px;
    border:2px solid rgba(0, 114, 185, .45);
    border-radius:20px;
    background:rgba(185, 185, 0, .08);
    overflow-y:auto;
    scrollbar-color:#8A8A8A transparent;

    &:focus-visible {
      outline:2px solid #0072B9;
      outline-offset:2px;
    }

    h4 {
      margin-bottom:12px;
      font-weight:700;
      font-size:24px;
      line-height:40px;
      color:#000;
    }

    .lead {
      font-weight:600;
      font-size:20px;
      line-height:40px;
      color:#000;
    }

    ol {
      padding-left:60px;
      list-style:lower-alpha;

      li {
        list-style:inherit;
        font-weight:400;
        font-size:20px;
        line-height:40px;
        color:#000;

        &::marker {
          font-weight:600;
        }

        strong {
          font-weight:600;
        }
      }
    }
  }

  .signatures {
    display:grid;
    grid-template-columns: repeat(2, 1fr);
    gap:36px;
    margin-top:44px;
  }

  /* 서명 영역과 버튼 사이는 다른 단계보다 좁게 */
  > div:last-of-type {
    margin-top:24px;
  }
`
