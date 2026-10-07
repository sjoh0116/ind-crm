import PlanForm from '@/components/Register/PlanForm.jsx';

const PAYMENT_TERMS = [
  'All at Once / Advance',
  'Monthly',
  'Quarterly',
];

const SERVICE_FREQUENCIES = [
  'Daily Service (365 Services/yr)',
  'Daily Services (305 Services/yr)',
  'Alternate Days (182 Services/yr)',
  'Twice a Week (104 Services/yr)',
  'Once a Week (52 Services /yr)',
  'Monthly Services (12 Services/yr)',
  'Quarterly (4 Services/yr)',
  'Single Services (1 services)',
  'Other',
];

export default function ResidentialPlan(){
  return (
    <PlanForm
      basePath='/residential'
      paymentTerms={PAYMENT_TERMS}
      serviceFrequencies={SERVICE_FREQUENCIES}
    />
  )
}
