// 등록 내용 확인 모달 / 계약서 리포트에서 함께 쓰는 표기·계산

export const GST_RATE = 0.18;

export const CUSTOMER_TYPE_LABELS = {
  commercial: 'Commercial',
  residential: 'Residential',
};

export const PLAN_TYPE_LABELS = {
  amc: 'AMC (Annual Maintenance Contract)',
  onetime: 'One-Time Service',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// '2026-09-23' → '23 Sep, 2026'
export const formatLongDate = (isoDate) => {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-').map(Number);
  return `${String(d).padStart(2, '0')} ${MONTHS[m - 1]}, ${y}`;
};

// '2026-09-23' → '23/09/2026'
export const formatSlashDate = (isoDate) => {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
};

export const toISODate = (date) => [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, '0'),
  String(date.getDate()).padStart(2, '0'),
].join('-');

export const formatRupees = (amount) => `Rs ${amount.toLocaleString('en-IN')}/-`;

// 'Commercial (Healthcare)' / 'Residential'
export const getCustomerCategory = (category = {}) => [
  CUSTOMER_TYPE_LABELS[category.customerType],
  category.industryCategory && `(${category.industryCategory})`,
].filter(Boolean).join(' ');

// 입력한 계약 금액은 GST 별도 금액으로 보고 18%를 더함
export const getPricing = (plan = {}) => {
  const value = Number(plan.contractValue);
  if (!plan.contractValue || !Number.isFinite(value)) return null;
  const gst = Math.round(value * GST_RATE);
  return { value, gst, total: value + gst };
};
