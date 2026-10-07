import PropertyForm from '@/components/Register/PropertyForm.jsx';

const PROPERTY_TYPES = [
  'Independent House',
  'Bungalow',
  'Villa',
  'Apartment / Flat',
  'Penthouse',
  'Studio Apartment',
  'Builder Floor',
  'Duplex',
  'Triplex',
  'Row House / Townhouse',
  'Farmhouse',
  'Serviced Apartment',
  'DDA Flats',
  'Land',
];

const DEFAULT_PROPERTY_DETAILS = [
  'Floors',
  'Parking Area',
  'Basement',
  'Terrace / Rooftop',
  'Garden / Lawn',
  'Servant Quarter',
  'External Walls',
];

export default function ResidentialProperty(){
  return (
    <PropertyForm
      basePath='/residential'
      propertyTypes={PROPERTY_TYPES}
      detailsLabel='Service Required On Floors'
      defaultDetails={DEFAULT_PROPERTY_DETAILS}
    />
  )
}
