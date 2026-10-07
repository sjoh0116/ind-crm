import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, X } from 'lucide-react';
import { styled } from 'styled-components';

import StepButtons from '@/components/Register/StepButtons.jsx';
import { useRegistration } from '@/context/RegistrationContext.jsx';
import { SKIP_VALIDATION } from '@/config.js';
import SelectBox from '@/components/Register/SelectBox.jsx';
import { Field, FormWrap, useInfoForm } from '@/components/Register/InfoForm.jsx';

const PLAN_TYPES = [
  { id: 'amc', label: 'Annual AMC' },
  { id: 'onetime', label: 'One-Time Service' },
];

const SERVICE_OPTIONS = [
  'Pre-Termite Management',
  'Post-Termite Management',
  'Pigeon Netting',
  'Pigeon Spike',
  'Mosquito Netting',
  'Cockroach Management',
  'Ants Management',
  'Mosquitoes Management',
  'Flies Management',
  'Rodents / Rats Management',
  'Bed Bugs Management',
  'Spiders Management',
  'Lizard Management',
  'Wasps / Bees Management',
  'Snake Management',
];
// One-Time Service의 고정 서비스 횟수 — 각 화면의 serviceFrequencies 목록에도 같은 표기로 들어 있어야 함
const SINGLE_SERVICE_FREQUENCY = 'Single Services (1 services)';
const PAYMENT_MODES = [
  'NEFT / RTGS Bank Transfer',
  'Online (UPI / Gateway)',
  'Cheque',
  'Cash',
];
const BILLING_DAYS = Array.from({ length: 28 }, (_, i) => i + 1);

// One-Time Service는 결제 조건/서비스 횟수가 고정
const ONETIME_PAYMENT_TERMS = 'All at Once / Advance';
const ONETIME_FREQUENCY = SINGLE_SERVICE_FREQUENCY;

const toISODate = (date) => [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, '0'),
  String(date.getDate()).padStart(2, '0'),
].join('-');

const addOneYear = (isoDate) => {
  const [y, m, d] = isoDate.split('-').map(Number);
  return toISODate(new Date(y + 1, m - 1, d));
};

const ordinal = (n) => {
  const suffix = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
};

// 시작일: 오늘 / 종료일: 오늘로부터 1년
const createInitialForm = (paymentTerms) => {
  const today = toISODate(new Date());
  return {
    planType: 'amc',
    startDate: today,
    endDate: addOneYear(today),
    paymentTerms: paymentTerms[0],
    billingDay: '',
    firstServiceDate: '',
    contractValue: '',
    frequency: '',
    paymentMode: '',
  };
};

// Commercial / Residential 공용 Plan & AMC 화면
// basePath: '/commercial' | '/residential'
// paymentTerms / serviceFrequencies: Annual AMC에서 고를 수 있는 결제 조건 / 서비스 횟수 목록
export default function PlanForm({ basePath, paymentTerms, serviceFrequencies }){
  const navigate = useNavigate();
  const { registration, saveStep } = useRegistration();
  // 이전에 저장한 값이 있으면 (Back으로 돌아온 경우) 그대로 복원
  const { services: savedServices, endDateTouched: savedEndDateTouched, ...savedForm } = registration.plan ?? {};
  const { form, setForm, handleChange } = useInfoForm(() => ({ ...createInitialForm(paymentTerms), ...savedForm }));
  const [endDateTouched, setEndDateTouched] = useState(savedEndDateTouched ?? false);
  const [services, setServices] = useState(savedServices ?? []);
  const [serviceQuery, setServiceQuery] = useState('');
  const [serviceError, setServiceError] = useState('');
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const isAmc = form.planType === 'amc';
  // 아직 추가하지 않은 서비스 중 검색어가 포함된 항목
  const suggestions = SERVICE_OPTIONS.filter(option => (
    !services.includes(option) && option.toLowerCase().includes(serviceQuery.trim().toLowerCase())
  ));
  const showSuggestions = suggestionsOpen && suggestions.length > 0;

  // 종료일을 직접 수정하기 전까지는 시작일 + 1년으로 따라감
  const handleStartDateChange = (e) => {
    const startDate = e.target.value;
    setForm(prev => ({
      ...prev,
      startDate,
      endDate: !endDateTouched && startDate ? addOneYear(startDate) : prev.endDate,
    }));
  };

  const handleEndDateChange = (e) => {
    setEndDateTouched(true);
    handleChange(e);
  };

  // 목록에 있는 이름이면 목록 표기로, 없으면 직접 입력한 이름 그대로 추가
  const addService = (value = serviceQuery) => {
    const name = value.trim().replace(/\s+/g, ' ');
    if (!name) return;

    const service = SERVICE_OPTIONS.find(option => option.toLowerCase() === name.toLowerCase()) ?? name;
    if (services.some(item => item.toLowerCase() === service.toLowerCase())) {
      setServiceError('This service is already added.');
      return;
    }
    setServices(prev => [...prev, service]);
    setServiceQuery('');
    setServiceError('');
    setActiveSuggestion(-1);
  };

  const handleServiceKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (suggestions.length === 0) return;
      e.preventDefault();
      setSuggestionsOpen(true);
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setActiveSuggestion(prev => (prev + step + suggestions.length) % suggestions.length);
      return;
    }
    if (e.key === 'Escape') {
      setSuggestionsOpen(false);
      setActiveSuggestion(-1);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      addService(showSuggestions && activeSuggestion >= 0 ? suggestions[activeSuggestion] : serviceQuery);
    }
  };

  const removeService = (service) => {
    setServices(prev => prev.filter(item => item !== service));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!SKIP_VALIDATION && services.length === 0) {
      setServiceError('Please add at least one service.');
      document.getElementById('serviceSearch')?.focus();
      return;
    }

    const { billingDay, ...rest } = form;
    const data = isAmc
      ? { ...rest, billingDay, services }
      : { ...rest, paymentTerms: ONETIME_PAYMENT_TERMS, frequency: ONETIME_FREQUENCY, services };
    saveStep('plan', { ...data, endDateTouched });
    navigate(`${basePath}/property`);
  };

  return (
    <PlanWrap $planType={form.planType}>
      <form onSubmit={handleSubmit} noValidate={SKIP_VALIDATION}>
        <div className='grid'>
          <div className='field' style={{ gridArea: 'plan' }}>
            <span className='label' id='planTypeLabel'>Plan Type</span>
            <div className='plan-toggle' role='radiogroup' aria-labelledby='planTypeLabel'>
              {PLAN_TYPES.map(({ id, label }) => (
                <button
                  key={id}
                  type='button'
                  role='radio'
                  aria-checked={form.planType === id}
                  className={form.planType === id ? 'active' : ''}
                  onClick={() => setForm(prev => ({ ...prev, planType: id }))}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className='field' style={{ gridArea: 'service' }}>
            <label htmlFor='serviceSearch'>
              Service
              <em aria-hidden='true'>*</em>
            </label>
            <div className='with-icon'>
              <input id='serviceSearch' type='text' autoComplete='off'
                role='combobox' aria-autocomplete='list' aria-controls='serviceSuggestions'
                aria-expanded={showSuggestions}
                aria-activedescendant={showSuggestions && activeSuggestion >= 0 ? `serviceSuggestion-${activeSuggestion}` : undefined}
                placeholder={isAmc ? 'e.g. Pigeon Netting (search and add)' : 'e.g. Pigeon Netting'}
                aria-invalid={serviceError ? 'true' : undefined}
                aria-describedby={serviceError ? 'serviceError' : undefined}
                value={serviceQuery}
                onChange={(e) => {
                  setServiceQuery(e.target.value);
                  setServiceError('');
                  setSuggestionsOpen(true);
                  setActiveSuggestion(-1);
                }}
                onFocus={() => setSuggestionsOpen(true)}
                onBlur={() => { setSuggestionsOpen(false); setActiveSuggestion(-1); }}
                onKeyDown={handleServiceKeyDown} />
              <button type='button' className='icon-btn' aria-label='Add service' onClick={() => addService()}>
                <Plus size={26} strokeWidth={2.5} aria-hidden='true' />
              </button>
              {showSuggestions && (
                <ul className='suggestions' id='serviceSuggestions' role='listbox' aria-label='Services'>
                  {suggestions.map((option, i) => (
                    <li
                      key={option}
                      id={`serviceSuggestion-${i}`}
                      role='option'
                      aria-selected={i === activeSuggestion}
                      className={i === activeSuggestion ? 'active' : ''}
                      // 클릭 시 input의 blur가 먼저 일어나 목록이 닫히지 않도록
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={() => setActiveSuggestion(i)}
                      onClick={() => addService(option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {serviceError && <p className='error' id='serviceError' role='alert'>{serviceError}</p>}
            {services.length > 0 && (
              <ul className='chips'>
                {services.map(service => (
                  <li key={service}>
                    <button type='button' aria-label={`Remove ${service}`} onClick={() => removeService(service)}>
                      <X size={16} strokeWidth={3} aria-hidden='true' />
                    </button>
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Field id='startDate' label='Contract Start Date' required area='start'>
            <div className='with-icon'>
              <input id='startDate' name='startDate' type='date' required
                value={form.startDate} onChange={handleStartDateChange} />
              <Calendar size={20} strokeWidth={2} aria-hidden='true' />
            </div>
          </Field>

          <Field id='endDate' label='Contract End Date' required area='end'>
            <div className='with-icon'>
              <input id='endDate' name='endDate' type='date' required min={form.startDate || undefined}
                value={form.endDate} onChange={handleEndDateChange} />
              <Calendar size={20} strokeWidth={2} aria-hidden='true' />
            </div>
          </Field>

          <Field id='paymentTerms' label='Payment Terms' required area='terms'>
            {isAmc ? (
              <SelectBox id='paymentTerms' name='paymentTerms' required
                value={form.paymentTerms} onChange={handleChange}>
                {paymentTerms.map(option => <option key={option} value={option}>{option}</option>)}
              </SelectBox>
            ) : (
              <input id='paymentTerms' type='text' className='fixed' readOnly value={ONETIME_PAYMENT_TERMS} />
            )}
          </Field>

          {isAmc && (
            <Field id='billingDay' label='AMC Recurring Monthly Billing Date' area='billing'>
              <SelectBox id='billingDay' name='billingDay' icon={Calendar} iconSize={20}
                className={form.billingDay ? '' : 'placeholder'}
                value={form.billingDay} onChange={handleChange}>
                <option value=''>e.g. 4th of every month</option>
                {BILLING_DAYS.map(day => (
                  <option key={day} value={day}>{ordinal(day)} of every month</option>
                ))}
              </SelectBox>
            </Field>
          )}

          <Field id='firstServiceDate' label='Preferred First Service Date' area='first'>
            <div className='with-icon'>
              <input id='firstServiceDate' name='firstServiceDate' type='date'
                min={form.startDate || undefined} max={form.endDate || undefined}
                value={form.firstServiceDate} onChange={handleChange} />
              <Calendar size={20} strokeWidth={2} aria-hidden='true' />
            </div>
          </Field>

          <Field id='contractValue' label='Total Contract Value (INR)' required area='value'>
            <input id='contractValue' name='contractValue' type='text' required inputMode='numeric'
              pattern='[0-9]+' title='숫자만 입력'
              placeholder={isAmc ? 'e.g. 1200000' : 'e.g. 1200000/-'}
              value={form.contractValue} onChange={handleChange} />
          </Field>

          <Field id='frequency' label='Services Frequency' required area='freq'>
            {isAmc ? (
              <SelectBox id='frequency' name='frequency' required
                className={form.frequency ? '' : 'placeholder'}
                value={form.frequency} onChange={handleChange}>
                <option value=''>e.g. {SINGLE_SERVICE_FREQUENCY}</option>
                {serviceFrequencies.map(option => <option key={option} value={option}>{option}</option>)}
              </SelectBox>
            ) : (
              <input id='frequency' type='text' className='fixed' readOnly value={ONETIME_FREQUENCY} />
            )}
          </Field>

          <Field id='paymentMode' label='Preferred Payment Mode' area='mode'>
            <SelectBox id='paymentMode' name='paymentMode'
              className={form.paymentMode ? '' : 'placeholder'}
              value={form.paymentMode} onChange={handleChange}>
              <option value=''>e.g. {PAYMENT_MODES[0]}</option>
              {PAYMENT_MODES.map(option => <option key={option} value={option}>{option}</option>)}
            </SelectBox>
          </Field>
        </div>

        <StepButtons onBack={() => navigate(`${basePath}/information`)} nextType='submit' />
      </form>
    </PlanWrap>
  )
}

// 좌/우 컬럼이 서로 다른 흐름이라 plan type별로 grid 영역을 지정
const GRID_AREAS = {
  amc: `
    'plan service'
    'start service'
    'end service'
    'terms value'
    'billing freq'
    'first mode'
  `,
  onetime: `
    'plan service'
    'start service'
    'end service'
    'terms service'
    'mode value'
    'first freq'
  `,
};

const PlanWrap = styled(FormWrap)`
  .grid {
    grid-template-areas: ${({ $planType }) => GRID_AREAS[$planType]};
    column-gap:36px;
    align-items: start;
  }

  .field > .label {
    font-weight:600;
    font-size:26px;
    line-height:1.2;
    color:#000;
  }

  .plan-toggle {
    display:flex;
    gap:15px;

    button {
      flex:1;
      height:59px;
      border:1px solid rgba(0, 0, 0, .15);
      border-radius:10px;
      background:#fff;
      font-family:inherit;
      font-weight:700;
      font-size:24px;
      color:#000;
      transition:background .2s, color .2s, border-color .2s;

      &.active {
        border-color:#0072B9;
        background:#0072B9;
        box-shadow:inset 0 4px 70px 0 rgba(0, 0, 0, .25);
        color:#FFFEFE;
      }

      &:focus-visible {
        outline:2px solid #0072B9;
        outline-offset:2px;
      }
    }
  }

  .with-icon {
    position:relative;

    input {
      padding-right:60px;
    }

    > svg {
      position:absolute;
      top:50%;
      right:16px;
      transform:translateY(-50%);
      color:#000;
      pointer-events:none;
    }

    /* 기본 달력 아이콘은 숨기고, lucide 아이콘 위치에서 클릭되도록 덮어둠 */
    input[type='date']::-webkit-calendar-picker-indicator {
      position:absolute;
      top:0;
      right:0;
      width:60px;
      height:100%;
      opacity:0;
      cursor:pointer;
    }

    .icon-btn {
      position:absolute;
      top:50%;
      right:10px;
      display:flex;
      align-items: center;
      justify-content: center;
      width:40px;
      height:40px;
      border-radius:6px;
      transform:translateY(-50%);
      color:#000;

      &:hover {
        background:rgba(0, 114, 185, .1);
      }

      &:focus-visible {
        outline:2px solid #0072B9;
      }
    }
  }

  /* One-Time Service의 고정 값 */
  input.fixed[readonly] {
    background-color:#fff;
    color:#000;
    cursor:default;
  }

  .error {
    font-size:16px;
    color:#D93025;
  }

  .suggestions {
    position:absolute;
    top:calc(100% + 6px);
    left:0;
    z-index:10;
    width:100%;
    max-height:264px;
    padding:6px 0;
    border:1px solid #333;
    border-radius:8px;
    background:#fff;
    box-shadow:0 6px 18px rgba(0, 0, 0, .15);
    overflow-y:auto;

    li {
      padding:10px 14px;
      font-size:18px;
      color:#000;
      cursor:pointer;

      &.active {
        background:rgba(0, 114, 185, .12);
        color:#0072B9;
      }
    }
  }

  .chips {
    display:flex;
    flex-wrap:wrap;
    column-gap:24px;

    li {
      display:flex;
      align-items: center;
      gap:6px;
      min-height:48px;
      max-width:100%;

      button {
        display:flex;
        align-items: center;
        justify-content: center;
        flex-shrink:0;
        width:28px;
        height:28px;
        border-radius:50%;
        color:#746E6E;

        &:hover {
          background:rgba(0, 0, 0, .08);
          color:#000;
        }

        &:focus-visible {
          outline:2px solid #0072B9;
        }
      }

      span {
        font-weight:500;
        font-size:20px;
        color:#746E6E;
      }
    }
  }
`
