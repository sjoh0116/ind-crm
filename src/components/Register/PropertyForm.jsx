import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, X } from 'lucide-react';
import { styled } from 'styled-components';

import StepButtons from '@/components/Register/StepButtons.jsx';
import { useRegistration } from '@/context/RegistrationContext.jsx';
import { SKIP_VALIDATION } from '@/config.js';
import SelectBox from '@/components/Register/SelectBox.jsx';
import { Field, FormWrap, useInfoForm } from '@/components/Register/InfoForm.jsx';

const MAX_COUNT = 99;

const INITIAL_FORM = {
  propertyType: '',
  propertySize: '',
  specifications: '',
};

function CounterRow({ label, count, onChange, onRemove }){
  return (
    <li>
      <span className='name'>{label}</span>
      {onRemove && (
        <button type='button' className='remove' aria-label={`Remove ${label}`} onClick={onRemove}>
          <X size={16} strokeWidth={3} aria-hidden='true' />
        </button>
      )}
      <div className='counter'>
        <button type='button' aria-label={`Decrease ${label}`}
          disabled={count <= 0} onClick={() => onChange(count - 1)}>
          <Minus size={18} strokeWidth={3} aria-hidden='true' />
        </button>
        <output aria-label={`${label} count`}>{count}</output>
        <button type='button' aria-label={`Increase ${label}`}
          disabled={count >= MAX_COUNT} onClick={() => onChange(count + 1)}>
          <Plus size={18} strokeWidth={3} aria-hidden='true' />
        </button>
      </div>
    </li>
  )
}

// Commercial / Residential 공용 Property 화면 (Plan & AMC 단계의 두 번째 화면)
// basePath: '/commercial' | '/residential'
export default function PropertyForm({ basePath, propertyTypes, detailsLabel, defaultDetails }){
  const navigate = useNavigate();
  // 이전 단계(Plan & AMC)에서 선택한 서비스 목록
  const { registration, saveStep } = useRegistration();
  const services = registration.plan?.services ?? [];

  // 이전에 저장한 값이 있으면 (Back으로 돌아온 경우) 그대로 복원
  const { propertyDetails: savedDetails, serviceFrequencies: savedFrequencies, ...savedForm } = registration.property ?? {};
  const { form, handleChange } = useInfoForm({ ...INITIAL_FORM, ...savedForm });
  const [details, setDetails] = useState(
    () => savedDetails ?? defaultDetails.map(name => ({ name, count: 0, custom: false })),
  );
  const [frequencies, setFrequencies] = useState(
    () => Object.fromEntries((savedFrequencies ?? []).map(({ service, count }) => [service, count])),
  );
  const [isAdding, setIsAdding] = useState(false);
  const [newDetail, setNewDetail] = useState('');
  const [detailError, setDetailError] = useState('');
  const [frequencyError, setFrequencyError] = useState('');

  const setDetailCount = (name, count) => {
    setDetails(prev => prev.map(item => (item.name === name ? { ...item, count } : item)));
  };

  const addDetail = () => {
    const name = newDetail.trim();
    if (!name) return;
    if (details.some(item => item.name.toLowerCase() === name.toLowerCase())) {
      setDetailError('This item is already in the list.');
      return;
    }
    setDetails(prev => [...prev, { name, count: 0, custom: true }]);
    setNewDetail('');
    setDetailError('');
    setIsAdding(false);
  };

  const handleDetailKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addDetail();
    }
    if (e.key === 'Escape') {
      setNewDetail('');
      setDetailError('');
      setIsAdding(false);
    }
  };

  const setFrequency = (service, count) => {
    setFrequencies(prev => ({ ...prev, [service]: count }));
    setFrequencyError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!SKIP_VALIDATION && services.some(service => !frequencies[service])) {
      setFrequencyError('Please set a frequency for every service.');
      return;
    }

    const data = {
      ...form,
      propertyDetails: details,
      serviceFrequencies: services.map(service => ({ service, count: frequencies[service] })),
    };
    saveStep('property', data);
    navigate(`${basePath}/sign`);
  };

  return (
    <PropertyWrap>
      <form onSubmit={handleSubmit} noValidate={SKIP_VALIDATION}>
        <div className='grid'>
          <Field id='propertyType' label='Property Type' required>
            <SelectBox id='propertyType' name='propertyType' required
              className={form.propertyType ? '' : 'placeholder'}
              value={form.propertyType} onChange={handleChange}>
              <option value=''>e.g. {propertyTypes[0]}</option>
              {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </SelectBox>
          </Field>

          <Field id='propertySize' label='Property Size'>
            <input id='propertySize' name='propertySize' type='text'
              placeholder='e.g. Under 500 sq. ft.'
              value={form.propertySize} onChange={handleChange} />
          </Field>

          <div className='field'>
            <span className='label'>{detailsLabel}</span>
            <ul className='counter-list'>
              {details.map(({ name, count, custom }) => (
                <CounterRow key={name} label={name} count={count}
                  onChange={(next) => setDetailCount(name, next)}
                  onRemove={custom ? () => setDetails(prev => prev.filter(item => item.name !== name)) : undefined} />
              ))}
            </ul>

            {isAdding ? (
              <>
                <div className='add-box'>
                  <input type='text' autoFocus aria-label='New property detail' placeholder='Building'
                    aria-invalid={detailError ? 'true' : undefined}
                    value={newDetail}
                    onChange={(e) => { setNewDetail(e.target.value); setDetailError(''); }}
                    onKeyDown={handleDetailKeyDown} />
                  <button type='button' onClick={addDetail}>Add</button>
                </div>
                {detailError && <p className='error' role='alert'>{detailError}</p>}
              </>
            ) : (
              <button type='button' className='add-more' onClick={() => setIsAdding(true)}>
                Add more +
              </button>
            )}
          </div>

          <div className='field'>
            <span className='label'>
              Services Frequency
              <em aria-hidden='true'>*</em>
            </span>
            {services.length > 0 ? (
              <ul className='counter-list'>
                {services.map(service => (
                  <CounterRow key={service} label={service} count={frequencies[service] ?? 0}
                    onChange={(next) => setFrequency(service, next)} />
                ))}
              </ul>
            ) : (
              <p className='empty'>No services selected. Go back to add services first.</p>
            )}
            {frequencyError && <p className='error' role='alert'>{frequencyError}</p>}
          </div>

          <Field id='specifications' label='Specifications' full>
            <textarea id='specifications' name='specifications' rows={3}
              placeholder='e.g Rodent Bait Stations Required, etc.'
              value={form.specifications} onChange={handleChange} />
          </Field>
        </div>

        <StepButtons onBack={() => navigate(`${basePath}/plan`)} nextType='submit' />
      </form>
    </PropertyWrap>
  )
}

const PropertyWrap = styled(FormWrap)`
  .grid {
    column-gap:36px;
    align-items: start;
  }

  .counter-list {
    max-width:561px;

    li {
      display:flex;
      align-items: center;
      gap:10px;
      min-height:50px;

      .name {
        flex:1;
        font-weight:500;
        font-size:20px;
        color:#000;
        word-break:break-word;
      }

      .remove {
        display:flex;
        align-items: center;
        justify-content: center;
        width:28px;
        height:28px;
        border-radius:50%;
        color:#746E6E;

        &:hover {
          background:rgba(0, 0, 0, .08);
          color:#000;
        }
      }

      .counter {
        display:flex;
        align-items: center;
        gap:4px;

        button {
          display:flex;
          align-items: center;
          justify-content: center;
          width:32px;
          height:32px;
          border-radius:50%;
          color:#000;
          transition:background .2s;

          &:hover:not(:disabled) {
            background:rgba(0, 114, 185, .12);
          }

          &:disabled {
            color:#BDBDBD;
            cursor:default;
          }
        }

        output {
          min-width:28px;
          font-weight:600;
          font-size:20px;
          text-align:center;
          color:#000;
        }
      }

      button:focus-visible {
        outline:2px solid #0072B9;
      }
    }
  }

  .add-more {
    align-self:flex-start;
    font-family:inherit;
    font-weight:500;
    font-size:20px;
    color:#746E6E;

    &:hover {
      color:#0072B9;
    }

    &:focus-visible {
      outline:2px solid #0072B9;
      outline-offset:4px;
    }
  }

  /* 위 카운터 목록과 같은 너비로 맞춤 */
  .add-box {
    position:relative;
    max-width:561px;

    input {
      height:46px;
      padding-right:96px;
      font-size:18px;
    }

    button {
      position:absolute;
      top:1px;
      right:1px;
      width:84px;
      height:calc(100% - 2px);
      border-radius:7px;
      background:rgba(52, 142, 199, .3);
      font-family:inherit;
      font-weight:600;
      font-size:18px;
      color:#000;
      transition:background .2s;

      &:hover {
        background:rgba(52, 142, 199, .45);
      }

      &:focus-visible {
        outline:2px solid #0072B9;
      }
    }
  }

  textarea {
    width:100%;
    min-height:100px;
    padding:18px 24px;
    border:1px solid #333;
    border-radius:8px;
    background-color:#fff;
    font-family:inherit;
    font-size:20px;
    line-height:1.5;
    color:#000;
    outline:none;
    resize:vertical;
    transition:border-color .2s, box-shadow .2s;

    &::placeholder {
      color:#8A8A8A;
    }

    &:focus {
      border-color:#0072B9;
      box-shadow:0 0 0 3px rgba(0, 114, 185, .15);
    }
  }

  .empty {
    font-size:18px;
    color:#746E6E;
  }

  .error {
    font-size:16px;
    color:#D93025;
  }
`
