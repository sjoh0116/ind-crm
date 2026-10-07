import { useNavigate } from 'react-router-dom';

import StepButtons from '@/components/Register/StepButtons.jsx';
import { useRegistration } from '@/context/RegistrationContext.jsx';
import { SKIP_VALIDATION } from '@/config.js';
import SelectBox from '@/components/Register/SelectBox.jsx';
import { Field, FormWrap, SALES_PERSONS, useInfoForm } from '@/components/Register/InfoForm.jsx';

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

export default function CommercialInfo(){
  const navigate = useNavigate();
  const { registration, saveStep } = useRegistration();
  const { form, handleChange } = useInfoForm(registration.information ?? INITIAL_FORM);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      serviceAddress: form.sameAsBilling ? form.billingAddress : form.serviceAddress,
    };
    saveStep('information', data);
    navigate('/commercial/plan');
  };

  return (
    <FormWrap>
      <form onSubmit={handleSubmit} noValidate={SKIP_VALIDATION}>
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
            <SelectBox id='salesPerson' name='salesPerson'
              className={form.salesPerson ? '' : 'placeholder'}
              value={form.salesPerson} onChange={handleChange}>
              <option value=''>Vanshika (Employee Code)</option>
              {SALES_PERSONS.map(({ code, name }) => (
                <option key={code} value={code}>{name} ({code})</option>
              ))}
            </SelectBox>
          </Field>
        </div>

        <StepButtons onBack={() => navigate('/')} nextType='submit' />
      </form>
    </FormWrap>
  )
}
