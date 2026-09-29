import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

import StepButtons from '@/components/Register/StepButtons.jsx';

const SALES_PERSONS = [];

const INITIAL_FORM = {
  companyName: '',
  gstNumber: '',
  contactName: '',
  mobile: '',
  email: '',
  pincode: '',
  billingAddress: '',
  sameAsBilling: false,
  serviceAddress: '',
  city: '',
  salesPerson: '',
};

function Field({ id, label, required, full, children }){
  return (
    <div className={`field${full ? ' full' : ''}`}>
      <label htmlFor={id}>
        {label}
        {required && <em aria-hidden='true'>*</em>}
      </label>
      {children}
    </div>
  )
}

export default function CommercialInfo(){
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      serviceAddress: form.sameAsBilling ? form.billingAddress : form.serviceAddress,
    };
  };

  return (
    <FormWrap>
      <form onSubmit={handleSubmit}>
        <div className='grid'>
          <Field id='companyName' label='Company / Establishment Name' required>
            <input id='companyName' name='companyName' type='text' required
              placeholder='e.g. MKB Global Services'
              value={form.companyName} onChange={handleChange} />
          </Field>

          <Field id='gstNumber' label='GST Number'>
            <input id='gstNumber' name='gstNumber' type='text' maxLength={15}
              placeholder='e.g. UNKKHRAH78R'
              value={form.gstNumber} onChange={handleChange} />
          </Field>

          <Field id='contactName' label='Contact Person / Full Name' required>
            <input id='contactName' name='contactName' type='text' required autoComplete='name'
              placeholder='e.g. Rahul Sharma'
              value={form.contactName} onChange={handleChange} />
          </Field>

          <Field id='mobile' label='Mobile Number (OTP Login)' required>
            <input id='mobile' name='mobile' type='tel' required inputMode='numeric' autoComplete='tel'
              pattern='0?[6-9][0-9]{9}' title='10자리 휴대폰 번호 (앞자리 0 선택)'
              placeholder='e.g. 09554645567'
              value={form.mobile} onChange={handleChange} />
          </Field>

          <Field id='email' label='Email Address (OTP Login)'>
            <input id='email' name='email' type='email' autoComplete='email'
              placeholder='e.g. Rahulsharam@gmail.com'
              value={form.email} onChange={handleChange} />
          </Field>

          <Field id='pincode' label='Pin code'>
            <input id='pincode' name='pincode' type='text' inputMode='numeric' autoComplete='postal-code'
              pattern='[1-9][0-9]{5}' maxLength={6} title='6자리 PIN code'
              placeholder='e.g. 110092'
              value={form.pincode} onChange={handleChange} />
          </Field>

          <Field id='billingAddress' label='Billing Address' required full>
            <input id='billingAddress' name='billingAddress' type='text' required
              placeholder='Full registered billing address'
              value={form.billingAddress} onChange={handleChange} />
          </Field>

          <label className='check'>
            <input name='sameAsBilling' type='checkbox'
              checked={form.sameAsBilling} onChange={handleChange} />
            <span>Service Site Address is same as Billing Address</span>
          </label>

          <Field id='serviceAddress' label='Service Site Address' required full>
            <input id='serviceAddress' name='serviceAddress' type='text' required
              placeholder='Full service site address'
              readOnly={form.sameAsBilling}
              value={form.sameAsBilling ? form.billingAddress : form.serviceAddress}
              onChange={handleChange} />
          </Field>

          <Field id='city' label='City'>
            <input id='city' name='city' type='text' autoComplete='address-level2'
              placeholder='e.g. Noida'
              value={form.city} onChange={handleChange} />
          </Field>

          <Field id='salesPerson' label='Sales Person'>
            <select id='salesPerson' name='salesPerson'
              className={form.salesPerson ? '' : 'placeholder'}
              value={form.salesPerson} onChange={handleChange}>
              <option value=''>Vanshika (Employee Code)</option>
              {SALES_PERSONS.map(({ code, name }) => (
                <option key={code} value={code}>{name} ({code})</option>
              ))}
            </select>
          </Field>
        </div>

        <StepButtons onBack={() => navigate('/')} nextType='submit' />
      </form>
    </FormWrap>
  )
}

const FormWrap = styled.section`
  width:100%;
  padding:50px 5.9% 60px;
  font-family:'Poppins', sans-serif;

  .grid {
    display:grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap:40px;
    row-gap:30px;
  }

  .field {
    display:flex;
    flex-direction: column;
    gap:14px;

    &.full {
      grid-column:1 / -1;
    }

    > label {
      font-weight:600;
      font-size:26px;
      line-height:1.2;
      color:#000;

      em {
        margin-left:6px;
        font-style:normal;
      }
    }
  }

  input[type='text'],
  input[type='tel'],
  input[type='email'],
  select {
    width:100%;
    height:52px;
    padding:0 14px;
    border:1px solid #333;
    border-radius:8px;
    background-color:#fff;
    font-family:inherit;
    font-size:20px;
    color:#000;
    outline:none;
    transition:border-color .2s, box-shadow .2s;

    &::placeholder {
      color:#8A8A8A;
    }

    &:focus {
      border-color:#0072B9;
      box-shadow:0 0 0 3px rgba(0, 114, 185, .15);
    }

    &[readonly] {
      background-color:#F5F5F5;
      color:#666;
    }
  }

  select {
    padding-right:56px;
    background-position:right 18px center;
    background-size:24px 24px;
    cursor:pointer;

    &.placeholder {
      color:#8A8A8A;
    }

    option {
      color:#000;
    }
  }

  .check {
    grid-column:1 / -1;
    display:flex;
    align-items: center;
    gap:14px;
    padding-left:20px;
    cursor:pointer;

    input {
      appearance:none;
      flex-shrink:0;
      width:24px;
      height:24px;
      border:1.5px solid #8A8A8A;
      border-radius:4px;
      background:#fff;
      cursor:pointer;
      transition:background .2s, border-color .2s;

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
      font-weight:500;
      font-size:20px;
      color:#666;
    }
  }
`
