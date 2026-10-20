import Chart from 'react-apexcharts';

import ReportCard from '@/components/Portal/reports/ReportCard.jsx';
import { PEST_TYPES } from '@/constants/pests.js';

// 최댓값보다 넉넉한 5 단위 눈금
const niceMax = (values) => Math.max(10, Math.ceil((Math.max(...values) * 1.5) / 5) * 5);

// 기간별 해충 발견 수 꺾은선 차트. chart: { categories, series: { [pestKey]: number[] } }
export default function PestTrendChart({ period, chart }){
  const series = PEST_TYPES.map(({ key, label }) => ({ name: label, data: chart.series[key] ?? [] }));
  const max = niceMax(series.flatMap(({ data }) => data));

  const options = {
    chart: {
      fontFamily: "'Poppins', sans-serif",
      toolbar: { show: false },
      zoom: { enabled: false },
      parentHeightOffset: 0,
    },
    colors: PEST_TYPES.map(({ color }) => color),
    stroke: { width: 2.5, curve: 'straight' },
    markers: { size: 4, strokeWidth: 0, hover: { size: 6 } },
    // 시안처럼 날짜 칸마다 회색 / 투명 띠를 번갈아 깔아 줌
    grid: {
      borderColor: 'transparent',
      column: { colors: ['#E6E8EB', 'transparent'] },
      padding: { left: 12, right: 16 },
    },
    xaxis: {
      categories: chart.categories,
      // 점이 칸 가운데에 오도록 (시안처럼 y축에서 떨어져 시작)
      tickPlacement: 'between',
      axisBorder: { color: '#666' },
      axisTicks: { color: '#666' },
      labels: { style: { fontSize: '12px', colors: '#444' } },
      tooltip: { enabled: false },
    },
    yaxis: {
      min: 0,
      max,
      tickAmount: max / 5,
      axisBorder: { show: true, color: '#666' },
      axisTicks: { show: true, color: '#666' },
      labels: { style: { fontSize: '12px', colors: '#444' } },
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'left',
      fontSize: '13px',
      offsetX: 60,
      markers: { shape: 'line', size: 10, strokeWidth: 3 },
      itemMargin: { horizontal: 14 },
    },
    tooltip: { shared: true, intersect: false },
  };

  return (
    <ReportCard title={`${period} Pest Count`} divider={false}
      subtitle='Daily Pest finding trends across your site showing progressive reduction and control'>
      <div style={{ padding: '10px 22px 0 10px' }}>
        <Chart type='line' height={520} options={options} series={series} />
      </div>
    </ReportCard>
  )
}
