import Chart from 'react-apexcharts';

import ReportCard from '@/components/Portal/reports/ReportCard.jsx';
import PestLegend from '@/components/Portal/reports/PestLegend.jsx';
import { PEST_TYPES } from '@/constants/pests.js';

// 시안처럼 12시 방향부터 시계 방향으로 Rodent → Flies → Mosquitoes → Cockroaches 순서로 그림
const SLICE_ORDER = ['rodent', 'flies', 'mosquitoes', 'cockroaches'];

// 해충 종류별 합계 파이 차트. totals: { [pestKey]: { value, unit } }
export default function PestTypeChart({ period, totals }){
  const pests = SLICE_ORDER.map(key => PEST_TYPES.find(pest => pest.key === key)).filter(({ key }) => totals[key]);
  const series = pests.map(({ key }) => totals[key].value);
  const withUnit = (index) => {
    const { value, unit } = totals[pests[index].key];
    return `${value} ${unit}`;
  };

  const options = {
    chart: { fontFamily: "'Poppins', sans-serif", parentHeightOffset: 0 },
    labels: pests.map(({ label }) => label),
    colors: pests.map(({ color }) => color),
    stroke: { width: 3, colors: ['#fff'] },
    dataLabels: {
      formatter: (_, { seriesIndex }) => withUnit(seriesIndex),
      style: { fontSize: '15px', fontWeight: 500 },
      dropShadow: { enabled: false },
    },
    plotOptions: { pie: { dataLabels: { offset: -14 } } },
    // 범례는 다른 카드와 같은 순서로 직접 그림
    legend: { show: false },
    tooltip: { y: { formatter: (_, { seriesIndex }) => withUnit(seriesIndex) } },
  };

  return (
    <ReportCard title={`Pest Type Over All ${period}`} subtitle={`Total Findings ${period.toLowerCase()}`}>
      <div style={{ padding: '24px 22px 0' }}>
        <Chart type='pie' height={500} options={options} series={series} />
        <PestLegend items={PEST_TYPES.filter(({ key }) => totals[key])} style={{ justifyContent: 'center', marginTop: 24 }} />
      </div>
    </ReportCard>
  )
}
