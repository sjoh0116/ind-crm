import PlanForm from '@/components/Register/PlanForm.jsx';
import { SERVICE_FREQUENCIES } from '@/pages/commercial/options.js';

const PAYMENT_TERMS = [
  'All at Once / Advance',
  'Monthly',
  'Quarterly',
];

export default function CommercialPlan(){
  return (
    <PlanForm
      basePath='/commercial'
      paymentTerms={PAYMENT_TERMS}
      serviceFrequencies={SERVICE_FREQUENCIES}
    />
  )
}
