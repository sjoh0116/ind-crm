import PropertyForm from '@/components/Register/PropertyForm.jsx';

const PROPERTY_TYPES = [
  'Restaurant / Café',
  'Hotel / Resort',
  'Cloud Kitchen',
  'Bakery',
  'Food Processing Unit',
  'Warehouse / Storage Facility',
  'Retail Store / Showroom',
  'Supermarket / Grocery Store',
  'Office',
  'Corporate Office',
  'Hospital / Clinic',
  'School / College / Institution',
  'Factory / Manufacturing Unit',
  'Construction Site',
  'Shopping Mall',
  'Gym / Fitness Centre',
  'Salon / Spa',
  'Bank / Financial Institution',
  'IT / Data Centre',
  'Co-working Space',
  'Residential Society / RWA',
  'Religious / Community Centre',
  'Commercial Complex',
  'Other',
];

const DEFAULT_PROPERTY_DETAILS = [
  'Floors',
  'Parking Area',
  'Basement',
  'Terrace / Rooftop',
  'Garden / Lawn',
  'Security Office',
];

export default function CommercialProperty(){
  return (
    <PropertyForm
      basePath='/commercial'
      propertyTypes={PROPERTY_TYPES}
      detailsLabel='Property Details'
      defaultDetails={DEFAULT_PROPERTY_DETAILS}
    />
  )
}
