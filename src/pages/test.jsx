import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

import StepButtons from '@/components/Register/StepButtons.jsx'
import { useRegistration } from '@/context/RegistrationContext.jsx';
import { SKIP_VALIDATION } from '@/config.js';
import SelectBox from '@/components/Register/SelectBox.jsx';

const CUSTOMER_TYPES = [
  {
    id: 'commercial',
    title: 'Commercial Client',
    desc: 'Hotels, Offices, Hospitals, Factories, Warehouses & Retail',
    icon: 'https://ust-india.s3.ap-northeast-2.amazonaws.com/crm/commercial_ic.svg',
  },
  {
    id: 'residential',
    title: 'Residential Client',
    desc: 'Villas, Independent Houses, Apartments & Societies',
    icon: 'https://ust-india.s3.ap-northeast-2.amazonaws.com/crm/residential_ic.svg',
  },
];

const INDUSTRY_CATEGORIES = [
  'Retail & Wholesale',
  'Hospitality & Hotels',
  'Healthcare',
  'Education',
  'Financial Services',
  'Real Estate & Property Management',
  'Corporate & Office Spaces',
  'Warehousing & Logistics',
  'Food & Beverage',
  'Manufacturing & Industrial',
  'Entertainment & Recreation',
  'Construction & Infrastructure',
];

export default function TestHome(){
  const navigate = useNavigate();
  const { registration, startRegistration } = useRegistration();
  const [customerType, setCustomerType] = useState(registration.category?.customerType ?? null);
  const [industryCategory, setIndustryCategory] = useState(registration.category?.industryCategory ?? '');

  const isCommercial = customerType === 'commercial';
  // Commercial은 업종 카테고리까지 선택해야 다음 단계로 진행
  const canContinue = Boolean(customerType) && (SKIP_VALIDATION || !isCommercial || Boolean(industryCategory));

  const handleNext = () => {
    startRegistration({ customerType, industryCategory: isCommercial ? industryCategory : '' });
    navigate(`/${customerType}/information`);
  };

  return (
    <SectionWrap>
        <h4>Select Customer Type</h4>

        <div className='content'>
          <ul>
            {CUSTOMER_TYPES.map(({ id, title, desc, icon }) => (
              <li key={id}>
                <button
                  type='button'
                  className={`list-in${customerType === id ? ' active' : ''}`}
                  aria-pressed={customerType === id}
                  onClick={() => setCustomerType(id)}
                >
                  <div className='list-ic'>
                    <img src={icon} alt={title} />
                  </div>
                  <div className='list-desc'>
                    <strong>{title}</strong>
                    <p>{desc}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {isCommercial && (
            <div className='category'>
              <label htmlFor='industryCategory'>Commercial Industry Category</label>
              <SelectBox
                id='industryCategory'
                className={industryCategory ? '' : 'placeholder'}
                value={industryCategory}
                onChange={(e) => setIndustryCategory(e.target.value)}
              >
                <option value=''>e.g. Hospitality & Hotels</option>
                {INDUSTRY_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </SelectBox>
            </div>
          )}

          <div className='system-desc'>
            <strong>System Note :</strong>
            <p>Customer ID will be automatically generated upon submission (e.g UST-26-AMC-GZB-HOME-1672) (UST-Year-Plan-City-Property Type-number)</p>
          </div>

          <StepButtons
            onBack={() => navigate('/register')}
            onNext={handleNext}
            nextDisabled={!canContinue}
          />
        </div>
      </SectionWrap>
  )
}

const SectionWrap = styled.section`
  width:100%;
  padding:38px 3.2% 60px;
  font-family:'Poppins', sans-serif;

  h4 {
    font-weight:600;
    font-size:24px;
    line-height:1.2;
    color:#000;
  }

  .content {
    padding:36px 3% 0;

    ul {
      display:grid;
      grid-template-columns: repeat(2, 1fr);
      gap:22px;

      .list-in {
        display:flex;
        align-items: flex-start;
        gap:18px;
        width:100%;
        min-height:174px;
        padding:44px 36px;
        border:1px solid #999;
        border-radius:28px;
        background:linear-gradient(135deg, #fff 0%, #F4F4F4 100%);
        box-shadow:inset 0 0 24px rgba(0, 0, 0, .04);
        font-family:inherit;
        text-align:left;
        transition:border-color .2s, box-shadow .2s;

        &:hover {
          border-color:#0072B9;
        }

        &.active {
          border:2px solid #0072B9;
          padding:43px 35px;
          box-shadow:0 4px 14px rgba(0, 114, 185, .2);
          background:rgba(0, 114, 185, 0.08);
        }

        .list-ic {
          flex-shrink:0;
          width:60px;
          height:60px;
          margin-top:4px;

          img {
            display:block;
            object-fit:contain;
            width:100%;
            height:100%;
          }
        }

        .list-desc {
          display:flex;
          flex-direction: column;
          gap:10px;

          strong {
            font-weight:600;
            font-size:26px;
            line-height:1.2;
            color:#000;
          }

          p {
            max-width:440px;
            font-weight:400;
            font-size:18px;
            line-height:1.4;
            color:#000;
          }
        }
      }
    }

    .category {
      display:flex;
      flex-direction: column;
      gap:14px;
      margin-top:30px;

      label {
        font-weight:600;
        font-size:26px;
        line-height:1.2;
        color:#000;
      }

      select {
        width:100%;
        height:52px;
        padding:0 56px 0 14px;
        border:1px solid #333;
        border-radius:8px;
        background-color:#fff;
        font-family:inherit;
        font-size:20px;
        color:#000;
        outline:none;
        cursor:pointer;
        transition:border-color .2s, box-shadow .2s;

        &.placeholder {
          color:#8A8A8A;
        }

        &:focus {
          border-color:#0072B9;
          box-shadow:0 0 0 3px rgba(0, 114, 185, .15);
        }

        option {
          color:#000;
        }
      }
    }

    .system-desc {
      display:flex;
      gap:14px;
      margin-top:30px;
      padding:18px 20px;
      background:#F7F8E8;
      border:2px solid #A9CBD3;
      border-radius:8px;

      strong {
        flex-shrink:0;
        font-weight:600;
        font-size:22px;
        line-height:1.8;
        color:#000;
      }

      p {
        font-weight:400;
        font-size:22px;
        line-height:1.8;
        color:#333;
      }
    }
  }
`
