// TODO: Portal API 연동 후 교체 — 지금은 시안에 있는 예시 값

export const SAMPLE_CUSTOMER = {
  name: 'Vanshika Thapliyal',
  customerId: 'UST-26-AMC-GZB-HOME-1672',
  planLabel: 'AMC Plan',
  frequency: '52 Services / Once in a Week',
  serviceAddress: 'Bhikaji Cama Place, Ring Road, New Delhi, Delhi 110066',
};

export const SAMPLE_UPCOMING_SERVICE = {
  status: 'Slot Confirmed',
  date: 'September 28, 2026',
  time: '04:00 PM',
  technician: 'Vipul Kumar',
};

// status: 'assigned' | 'completed'
export const SAMPLE_VISITS = [
  { id: 1, service: 'General Pest Management Service', status: 'assigned', dateTime: '28-09-2026 (4:00PM to 6:00 PM)', technician: 'Vijay Sharma', operationHead: 'Nilesh', operationPhone: '+91 98112 34501' },
  { id: 2, service: 'General Pest Management Service', status: 'completed', dateTime: '21-09-2026 (4:00PM to 6:00 PM)', technician: 'Ramashankar', operationHead: 'Nilesh', operationPhone: '+91 98112 34501' },
  { id: 3, service: 'General Pest Management Service', status: 'completed', dateTime: '14-09-2026 (1:00PM to 2:00 PM)', technician: 'Vivek', operationHead: 'Nilesh', operationPhone: '+91 98112 34501' },
  { id: 4, service: 'General Pest Management Service', status: 'completed', dateTime: '07-09-2026 (4:30PM to 6:30 PM)', technician: 'Gautam', operationHead: 'Nilesh', operationPhone: '+91 98112 34501' },
  { id: 5, service: 'General Pest Management Service', status: 'completed', dateTime: '31-08-2026 (4:00PM to 6:00 PM)', technician: 'Vijay Sharma', operationHead: 'Nilesh', operationPhone: '+91 98112 34501' },
];

export const SAMPLE_CONTRACT = {
  customerId: 'UST-26-AMC-GZB-HOME-1672',
  planType: 'AMC',
  validity: '28-09-2026 to 27-09-2027',
  monthlyBilling: 'Every 2nd (Reminder: 5 days prior)',
  salesIncharge: 'Nikesh Jha (Employee code)',
  operationIncharge: 'Nilesh (Employee code)',
  warranty: 'Comprehensive Warranty',
  services: [
    { name: 'Ant Management', count: 2 },
    { name: 'Flies Management', count: 6 },
    { name: 'Mosquito Management', count: 6 },
    { name: 'Rodent Management', count: 2 },
  ],
};

// status: 'pending' | 'paid'
export const SAMPLE_INVOICE = {
  id: 'UST-26-AMC-GZB-HOME-1672',
  cycle: 'Current Billing Cycle',
  dueDate: '29-09-2026',
  status: 'pending',
  amount: 11800,
};

// 달력 표시 항목. type: 'done' | 'scheduled' | 'billing' | 'paid'
export const SAMPLE_CALENDAR_EVENTS = [
  { date: '2026-08-31', type: 'done', label: 'Service Done', time: '4:30PM - 6:30PM' },
  { date: '2026-09-02', type: 'billing', label: 'Monthly Billing' },
  { date: '2026-09-07', type: 'done', label: 'Service Done', time: '4:30PM - 6:30PM' },
  { date: '2026-09-10', type: 'paid', label: 'Bill Paid' },
  { date: '2026-09-14', type: 'done', label: 'Service Done', time: '1:00PM - 2:00PM' },
  { date: '2026-09-21', type: 'done', label: 'Service Done', time: '4:00PM - 6:00PM' },
  { date: '2026-09-28', type: 'scheduled', label: 'Service Schedule', time: '4:00PM - 6:00PM' },
  { date: '2026-10-02', type: 'billing', label: 'Monthly Billing' },
];

// 달력이 처음 보여 줄 달 (다음 서비스가 있는 달)
export const SAMPLE_CALENDAR_START = { year: 2026, month: 8 };

// My Properties: 건물 > 층 > 구역
export const SAMPLE_PROPERTY = {
  type: 'Corporate Office',
  buildings: [
    {
      id: 'b1',
      name: 'Building 1',
      floors: [
        { id: 'b1-f1', name: 'Basement 1', areas: ['Parking Area'] },
        { id: 'b1-f2', name: '19th Floor', areas: ['Reception', 'Office Area', 'Washroom', 'Locker Room'] },
        { id: 'b1-f3', name: '20th Floor', areas: ['Reception', 'Cafeteria', 'Washroom', 'Locker Room', 'Office Area', 'Security Room'] },
        { id: 'b1-f4', name: '21st Floor', areas: ['Reception', 'Cafeteria', 'Washroom', 'Locker Room', 'Office Area', 'Security Room'] },
      ],
    },
    {
      id: 'b2',
      name: 'Building 2',
      floors: [
        'Basement 1', 'Basement 2', 'Ground Floor', '1st Floor', '2st Floor', '3rd Floor',
        '4th Floor', '5th Floor', '6th Floor', '7th Floor', '8th Floor', '9th Floor',
      ].map((name, i) => ({ id: `b2-f${i + 1}`, name, areas: [] })),
    },
  ],
};

// Monthly Service Calendar
export const SAMPLE_SERVICE_STATS = {
  frequency: 52,
  completed: 10,
  scheduled: 2,
  rescheduleRequested: 1,
};

const SAMPLE_TREATMENTS = ['Cockroach Treatment', 'Ant Treatment', 'Rodent Treatment'];

// status: 'scheduled' | 'reschedule-requested' | 'completed'
export const SAMPLE_UPCOMING_VISITS = [
  { id: 'u1', date: '28 Sep 2026', services: SAMPLE_TREATMENTS, time: '4:00 PM - 6:00 PM', technician: 'Vipul Kumar', status: 'scheduled' },
  { id: 'u2', date: '05 Oct 2026', services: SAMPLE_TREATMENTS, time: '4:00 PM - 6:00 PM', technician: 'Vipul Kumar', status: 'scheduled' },
];

export const SAMPLE_PAST_VISITS = [
  { id: 'p1', date: '21 Sep 2026', services: SAMPLE_TREATMENTS, time: '4:00 PM - 6:00 PM', technician: 'Ramashankar', status: 'completed' },
  { id: 'p2', date: '14 Sep 2026', services: SAMPLE_TREATMENTS, time: '1:00 PM - 2:00 PM', technician: 'Vivek', status: 'completed' },
  { id: 'p3', date: '07 Sep 2026', services: SAMPLE_TREATMENTS, time: '4:30 PM - 6:30 PM', technician: 'Gautam', status: 'completed' },
  { id: 'p4', date: '31 Aug 2026', services: SAMPLE_TREATMENTS, time: '4:00 PM - 6:00 PM', technician: 'Vipul Kumar', status: 'completed' },
  { id: 'p5', date: '24 Aug 2026', services: SAMPLE_TREATMENTS, time: '4:00 PM - 6:00 PM', technician: 'Vijay Sharma', status: 'completed' },
];

// Services Completion Slip — 2026-09-28부터 매주 한 번씩 거슬러 올라간 완료 확인서 12건
export const SAMPLE_COMPLETION_SLIPS = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(2026, 8, 28 - i * 7);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return {
    id: `slip-${date.getFullYear()}${mm}${dd}`,
    title: 'General Pest Management Service Completion Slip',
    dateTime: `${dd}-${mm}-${date.getFullYear()} (4:00PM to 6:00 PM)`,
    technician: 'Vijay Sharma',
    operationHead: 'Nilesh',
    operationPhone: '+91 98112 34501',
  };
});

// Invoice & Pay Bill — 매달 2일 발행, 12일 뒤 납부 기한
// status: 'pending' | 'verification' | 'paid'
export const SAMPLE_INVOICES = [
  ['2026-10-02', 'pending'],
  ['2026-09-02', 'verification'],
  ['2026-08-02', 'paid'],
  ['2026-07-02', 'paid'],
  ['2026-06-02', 'paid'],
  ['2026-05-02', 'paid'],
  ['2026-04-02', 'paid'],
  ['2026-03-02', 'paid'],
  ['2026-02-02', 'paid'],
].map(([iso, status], i) => {
  const [y, m, d] = iso.split('-').map(Number);
  const due = new Date(y, m - 1, d + 12);
  const fmt = (date) => [
    String(date.getDate()).padStart(2, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    date.getFullYear(),
  ].join('-');
  return {
    id: `USTPEST26-27/${410 - i}`,
    invoiceDate: fmt(new Date(y, m - 1, d)),
    dueDate: fmt(due),
    amount: 30000,
    status,
  };
});

// Reports > 조회 기간. today: 오늘(선택 가능한 마지막 날), min: 조회 가능한 첫 날(계약 시작일)
export const SAMPLE_REPORT_TODAY = '2026-10-09';
export const SAMPLE_REPORT_MIN = '2025-04-01';

// Reports > Trend Analysis. status: 'priority' | 'control'
// pestTotals의 unit: 'Nos'(마리) | 'Gram'(무게)
const TREND_LOCATIONS = {
  floors: [
    { name: 'Building 1 - Basement', status: 'priority', counts: { cockroaches: 5, flies: 1, rodent: 1 } },
    { name: 'Building 1 - 19th Floor', status: 'priority', counts: { cockroaches: 5, flies: 1, rodent: 1 } },
    { name: 'Building 2 - 2nd Floor', status: 'priority', counts: { cockroaches: 5, flies: 1, rodent: 1 } },
    { name: 'Building 1 - 20th Floor', status: 'control', counts: { cockroaches: 2, flies: 1 } },
    { name: 'Building 2 - Basement', status: 'control', counts: { cockroaches: 1 } },
    { name: 'Building 2 - 5th Floor', status: 'control', counts: { flies: 1 } },
    { name: 'Building 3 - Ground Floor', status: 'control', counts: { mosquitoes: 1 } },
  ],
  areas: [
    { name: 'Parking 1', place: 'Building 1 - Basement', status: 'priority', counts: { cockroaches: 5, flies: 1, rodent: 1 } },
    { name: 'Security Office', place: 'Building 1 - 19th Floor', status: 'priority', counts: { cockroaches: 5, flies: 1, rodent: 1 } },
    { name: 'Indian Restaurant', place: 'Building 1 - 19th Floor', status: 'priority', counts: { cockroaches: 5, flies: 1, rodent: 1 } },
    { name: 'Korean Restaurant', place: 'Building 1 - 20th Floor', status: 'control', counts: { cockroaches: 1, flies: 1 } },
    { name: 'Restaurant Kitchen', place: 'Building 2 - 2nd Floor', status: 'control', counts: { cockroaches: 2 } },
    { name: 'Lobby', place: 'Building 2 - Ground Floor', status: 'control', counts: { mosquitoes: 1 } },
    { name: 'Store Room', place: 'Building 3 - Basement', status: 'control', counts: { cockroaches: 1 } },
  ],
};

export const SAMPLE_TREND_REPORT = {
  weekly: {
    period: 'This Week',
    stats: [
      { label: 'Pest found this week', value: '10', note: 'Down 17% since July' },
      { label: 'Area Affected', value: '20', note: '20th Floor is at high risk' },
      { label: 'Most common pest', value: 'Cockroach', note: '44% of all the findings' },
      { label: 'Rodent Box Checked', value: '5', note: '10 Glue pad changed this month' },
    ],
    chart: {
      categories: ['DAY 1', 'DAY 2', 'DAY 3', 'DAY 4', 'DAY 5', 'DAY 6', 'DAY 7'],
      series: {
        mosquitoes: [1, 3, 0, 1, 0, 0, 0],
        flies: [1, 2, 0, 2, 0, 0, 0],
        cockroaches: [13, 10, 4, 6, 2, 2, 1],
        rodent: [0, 0, 0, 3, 0, 0, 0],
      },
    },
    pestTotals: {
      mosquitoes: { value: 6, unit: 'Gram' },
      flies: { value: 4, unit: 'Gram' },
      cockroaches: { value: 41, unit: 'Nos' },
      rodent: { value: 4, unit: 'Nos' },
    },
    ...TREND_LOCATIONS,
    devices: {
      rodentBox: { installed: 20, gluePadChanged: 2, checked: 20, alerts: ['Rodent box no. 2 is damaged'] },
      flyCatcher: { installed: 4, boardChanged: 1, checked: 4, alerts: ['Fly Catcher Machine no. 3 is damaged'] },
    },
  },
  monthly: {
    period: 'This Month',
    stats: [
      { label: 'Pest found this month', value: '42', note: 'Down 9% since August' },
      { label: 'Area Affected', value: '26', note: '19th Floor is at high risk' },
      { label: 'Most common pest', value: 'Cockroach', note: '51% of all the findings' },
      { label: 'Rodent Box Checked', value: '20', note: '10 Glue pad changed this month' },
    ],
    chart: {
      categories: ['WEEK 1', 'WEEK 2', 'WEEK 3', 'WEEK 4'],
      series: {
        mosquitoes: [6, 4, 3, 5],
        flies: [5, 3, 4, 6],
        cockroaches: [28, 22, 16, 41],
        rodent: [2, 1, 1, 4],
      },
    },
    pestTotals: {
      mosquitoes: { value: 18, unit: 'Gram' },
      flies: { value: 18, unit: 'Gram' },
      cockroaches: { value: 107, unit: 'Nos' },
      rodent: { value: 8, unit: 'Nos' },
    },
    ...TREND_LOCATIONS,
    devices: {
      rodentBox: { installed: 20, gluePadChanged: 10, checked: 80, alerts: ['Rodent box no. 2 is damaged'] },
      flyCatcher: { installed: 4, boardChanged: 3, checked: 16, alerts: ['Fly Catcher Machine no. 3 is damaged'] },
    },
  },
};

// My Complaints. priority: 'urgent' | 'medium' | 'low', status: 'open' | 'in-progress' | 'resolved'
export const SAMPLE_COMPLAINTS = [
  {
    id: 'CMP-1006',
    priority: 'urgent',
    subject: 'Fly sightings near outdoor garden seating',
    description: 'During Sunday brunch, guests complained of fruit flies near, the buffet fruit counter. Request immediate treatment before before Saturday.',
    resolution: 'Operator Vipul Kumar Scheduled special Quick Bayt application on 09/09/2026. Status Update shared with the Admin Manager',
    loggedAt: '07/09/2026, 20:00:00',
    status: 'in-progress',
  },
  ...[1005, 1004, 1003, 1002, 1001].map(no => ({
    id: `CMP-${no}`,
    priority: 'urgent',
    subject: 'Cockroach sightings near men’s locker room',
    description: 'On Tueday afternoon, staff complained about the Cockroach near the men’s locker room. Request immediate treatment.',
    resolution: 'Operator Gautam Scheduled special gel betting treatment on 28/08/2026. Status Update shared with the Admin Manager',
    loggedAt: '21/08/2026, 20:00:00',
    status: 'resolved',
  })),
];

// Reports > Site Observation. 층마다 같은 관찰 항목 6개 (미처리 4 / 완료 2)
// risk: 'high' | 'medium' | 'low', status: 'open' | 'verification'(완료 표시 후 확인 대기) | 'closed'
const OBSERVATION_TEMPLATES = [
  { area: 'Cafeteria', title: 'Gap around sink drain pipe with cockroach droppings', risk: 'high', action: 'Seal the pipe gap with suitable sealant and fit the drain mesh', status: 'open' },
  { area: 'Washroom', title: 'Water leakage under the wash basin', risk: 'medium', action: 'Repair the leakage and keep the area dry and clean', status: 'verification' },
  { area: 'Locker Room', title: 'Clothes kept on the floor near the wall', risk: 'low', action: 'Seal the pipe gap with suitable sealant and fit the drain mesh', status: 'closed' },
  { area: 'Cafeteria', title: 'Food residue behind the kitchen Counter', risk: 'high', action: 'Seal the pipe gap with suitable sealant and fit the drain mesh', status: 'open' },
  { area: 'Pantry', title: 'Open garbage bin without lid near the pantry', risk: 'high', action: 'Replace with a lidded bin and clear the garbage daily', status: 'open' },
  { area: 'Store Room', title: 'Cardboard boxes stacked against the wall', risk: 'low', action: 'Move the boxes onto racks away from the wall', status: 'closed' },
];

const buildObservations = (floors) => floors.flatMap((floor, f) => OBSERVATION_TEMPLATES.map((item, i) => ({
  ...item,
  id: `${f + 1}-${i + 1}`,
  floor,
  photo: null,
})));

const floorRange = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => {
  const n = from + i;
  const suffix = n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th';
  return `${n}${suffix} Floor`;
});

// type: 'observation' | 'rca', status: 'action-required' | 'partially-closed' | 'fully-closed'
export const SAMPLE_OBSERVATION_REPORTS = [
  { id: 'OBS-0928', type: 'observation', title: 'OBSERVATION REPORT - Pest Control Site Inspection (19th to 24th Floor)', dateTime: '28-09-2026 (4:00PM to 6:00PM)', personnel: 'Abhishek', status: 'action-required', building: 'Building 1', floors: floorRange(19, 24) },
  { id: 'OBS-0921', type: 'observation', title: 'OBSERVATION REPORT - Pest Control Site Inspection (1st to 9th Floor)', dateTime: '21-09-2026 (4:00PM to 6:00PM)', personnel: 'Nilesh Parmar', status: 'partially-closed', building: 'Building 1', floors: floorRange(1, 9) },
  { id: 'OBS-0914', type: 'observation', title: 'OBSERVATION REPORT - Pest Control Site Inspection (Basement to 2nd Floor)', dateTime: '14-09-2026 (4:00PM to 6:00PM)', personnel: 'Abhishek Choubey', status: 'fully-closed', building: 'Building 2', floors: ['Basement', ...floorRange(1, 2)] },
  { id: 'RCA-0907', type: 'rca', title: 'ROOT CAUSE ANALYSIS REPORT (19th to 24th Floor)', dateTime: '07-09-2026 (4:00PM to 6:00PM)', personnel: 'Nilesh', status: 'fully-closed', building: 'Building 1', floors: floorRange(19, 24) },
  { id: 'OBS-0831', type: 'observation', title: 'OBSERVATION REPORT - Pest Control Site Inspection (10th to 18th Floor)', dateTime: '31-08-2026 (4:00PM to 6:00PM)', personnel: 'Abhishek', status: 'fully-closed', building: 'Building 1', floors: floorRange(10, 18) },
  { id: 'OBS-0824', type: 'observation', title: 'OBSERVATION REPORT - Pest Control Site Inspection (Basement to 2nd Floor)', dateTime: '24-08-2026 (4:00PM to 6:00PM)', personnel: 'Nilesh Parmar', status: 'fully-closed', building: 'Building 2', floors: ['Basement', ...floorRange(1, 2)] },
].map(report => ({ ...report, observations: buildObservations(report.floors) }));

// Reports > Pest Device. 설치된 장비 수
export const SAMPLE_DEVICE_SUMMARY = { flyCatcher: 13, rodentBox: 9 };

// 장비 점검 기록. type: 'fly' | 'rodent'
// status: 'glue-changed' | 'machine-cleaned' | 'box-cleaned', findings: [{ amount, pest }] (빈 배열이면 '-'), damaged: 파손
const DEVICE_RECORDS_LATEST = [
  { device: 'FC-01', type: 'fly', floor: '19th floor', area: 'Production Area', date: '12-10-2026', status: 'glue-changed', findings: [{ amount: '4 Gram', pest: 'Flies' }, { amount: '2 Gram', pest: 'Mosquitoes' }] },
  { device: 'RB-01', type: 'rodent', floor: '19th floor', area: 'Office Area', date: '12-10-2026', status: 'glue-changed', findings: [{ amount: '1 Nos', pest: 'Rodent' }, { amount: '1 Nos', pest: 'Lizard' }] },
  { device: 'FC-02', type: 'fly', floor: '19th floor', area: 'Production Area', date: '10-10-2026', status: 'machine-cleaned', findings: [] },
  { device: 'RB-02', type: 'rodent', floor: '19th floor', area: 'Production Area', date: '09-10-2026', status: 'box-cleaned', findings: [], damaged: true },
  { device: 'FC-03', type: 'fly', floor: '19th floor', area: 'Production Area', date: '09-10-2026', status: 'machine-cleaned', findings: [] },
  { device: 'FC-04', type: 'fly', floor: 'Basement 1', area: 'Production Area', date: '09-10-2026', status: 'glue-changed', findings: [{ amount: '3 Gram', pest: 'Flies' }, { amount: '1 Gram', pest: 'Mosquitoes' }] },
  { device: 'FC-05', type: 'fly', floor: '21th floor', area: 'Production Area', date: '09-10-2026', status: 'glue-changed', findings: [{ amount: '5 Gram', pest: 'Flies' }, { amount: '1 Gram', pest: 'Mosquitoes' }] },
  { device: 'FC-06', type: 'fly', floor: '10th floor', area: 'Production Area', date: '08-10-2026', status: 'machine-cleaned', findings: [] },
  { device: 'FC-07', type: 'fly', floor: '19th floor', area: 'Production Area', date: '08-10-2026', status: 'machine-cleaned', findings: [] },
  { device: 'FC-08', type: 'fly', floor: '19th floor', area: 'Production Area', date: '08-10-2026', status: 'glue-changed', findings: [{ amount: '4 Gram', pest: 'Flies' }, { amount: '2 Gram', pest: 'Mosquitoes' }] },
  { device: 'FC-09', type: 'fly', floor: '19th floor', area: 'Production Area', date: '08-10-2026', status: 'machine-cleaned', findings: [], damaged: true },
];

// 이전 주의 기록은 날짜만 7일씩 앞당겨 반복 (총 6주)
export const SAMPLE_DEVICE_RECORDS = Array.from({ length: 6 }, (_, week) => DEVICE_RECORDS_LATEST.map((record, i) => {
  const [d, m, y] = record.date.split('-').map(Number);
  const date = new Date(y, m - 1, d - week * 7);
  return {
    ...record,
    id: `${record.device}-${week}-${i}`,
    building: 'Building 1',
    date: [String(date.getDate()).padStart(2, '0'), String(date.getMonth() + 1).padStart(2, '0'), date.getFullYear()].join('-'),
    operator: week % 2 ? 'Rahul' : 'Vijay',
    photos: [null, null],
  };
})).flat();
