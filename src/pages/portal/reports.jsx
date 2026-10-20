import { useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { styled } from 'styled-components';

import PestTrendChart from '@/components/Portal/reports/PestTrendChart.jsx';
import PestTypeChart from '@/components/Portal/reports/PestTypeChart.jsx';
import PestIntensity from '@/components/Portal/reports/PestIntensity.jsx';
import DeviceUpdates from '@/components/Portal/reports/DeviceUpdates.jsx';
import SiteObservation from '@/components/Portal/reports/SiteObservation.jsx';
import DeviceReport from '@/components/Portal/reports/DeviceReport.jsx';
import DateRangePicker, { DATE_PRESETS, parseISODate } from '@/components/Portal/reports/DateRangePicker.jsx';
import {
  SAMPLE_DEVICE_RECORDS,
  SAMPLE_DEVICE_SUMMARY,
  SAMPLE_OBSERVATION_REPORTS,
  SAMPLE_REPORT_MIN,
  SAMPLE_REPORT_TODAY,
  SAMPLE_TREND_REPORT,
} from '@/pages/portal/sampleData.js';

const REPORT_TABS = [
  { key: 'trend', label: 'Trend Analysis Report' },
  { key: 'observation', label: 'Site Observation Report' },
  { key: 'device', label: 'Pest Device Report' },
];

const PERIODS = [
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

const TODAY = parseISODate(SAMPLE_REPORT_TODAY);
const MIN_DATE = parseISODate(SAMPLE_REPORT_MIN);

// 처음 조회 기간: Last 30 days
const initialRange = () => {
  const [start, end] = DATE_PRESETS.find(({ key }) => key === 'last30').range(TODAY, MIN_DATE);
  return { preset: 'last30', start, end };
};

// Portal > Reports
export default function PortalReports(){
  const [range, setRange] = useState(initialRange);
  const [tab, setTab] = useState(REPORT_TABS[0].key);
  const [period, setPeriod] = useState(PERIODS[0].key);
  const report = SAMPLE_TREND_REPORT[period];

  const handleDownloadAll = () => {
    // TODO: 선택한 기간의 전체 리포트 PDF 다운로드 연동 (range.start ~ range.end 전달)
  };

  return (
    <ReportsWrap>
      <div className='page-head'>
        <div>
          <h3>Pest Service Reports</h3>
          <p>Everything about pest control at your property, in one place.</p>
        </div>
        <div className='head-actions'>
          <DateRangePicker value={range} today={TODAY} min={MIN_DATE} onChange={setRange} />
          <button type='button' className='download' onClick={handleDownloadAll}>
            Download All (PDF)
            <ArrowDown size={18} strokeWidth={2.5} aria-hidden='true' />
          </button>
        </div>
      </div>

      <div className='tabs' role='tablist' aria-label='Report type'>
        {REPORT_TABS.map(({ key, label }) => (
          <button key={key} type='button' role='tab' id={`report-tab-${key}`} aria-selected={tab === key}
            aria-controls='reportPanel' onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      <div id='reportPanel' role='tabpanel' aria-labelledby={`report-tab-${tab}`}>
        {tab === 'trend' ? (
          <>
            <div className='section-head'>
              <h4>Trend Analysis</h4>
              <div className='periods' role='group' aria-label='Trend period'>
                {PERIODS.map(({ key, label }) => (
                  <button key={key} type='button' aria-pressed={period === key} onClick={() => setPeriod(key)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <ul className='stats'>
              {report.stats.map(({ label, value, note }) => (
                <li key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <p>{note}</p>
                </li>
              ))}
            </ul>

            <PestTrendChart period={report.period} chart={report.chart} />

            <div className='grid'>
              <PestIntensity title={`Floor-Wise Pest Intensity ${report.period}`}
                subtitle={`Total Findings ${report.period.toLowerCase()}`} items={report.floors} />
              <PestTypeChart period={report.period} totals={report.pestTotals} />
              <PestIntensity title={`Area-Wise Pest Intensity ${report.period}`}
                subtitle={`Total Findings ${report.period.toLowerCase()}`} items={report.areas} />
              <DeviceUpdates period={report.period} devices={report.devices} />
            </div>
          </>
        ) : tab === 'observation' ? (
          <SiteObservation reports={SAMPLE_OBSERVATION_REPORTS} />
        ) : (
          <DeviceReport records={SAMPLE_DEVICE_RECORDS} summary={SAMPLE_DEVICE_SUMMARY} />
        )}
      </div>
    </ReportsWrap>
  )
}

// 시안(1440px) 기준: 좌우 여백 70px / 80px, 아래 카드 2열 375 : 305
const ReportsWrap = styled.div`
  padding:30px 80px 100px 70px;

  .page-head {
    display:flex;
    align-items: center;
    justify-content: space-between;
    gap:24px;

    h3 {
      font-weight:600;
      font-size:22px;
      line-height:1.35;
      color:#000;
    }

    p {
      font-size:14px;
      line-height:1.5;
      color:#5E5E5E;
    }
  }

  .head-actions {
    display:flex;
    flex-shrink:0;
    gap:16px;
  }

  .download {
    display:flex;
    align-items: center;
    gap:8px;
    height:48px;
    padding:0 16px;
    border-radius:4px;
    background:#0072B9;
    box-shadow:0 2px 6px 0 rgba(0, 0, 0, .25);
    font-family:inherit;
    font-weight:600;
    font-size:14px;
    white-space:nowrap;
    color:#fff;
    transition:filter .2s;

    &:hover {
      filter:brightness(1.1);
    }

    &:focus-visible {
      outline:2px solid #000;
      outline-offset:2px;
    }
  }

  .tabs {
    display:grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap:8px;
    margin-top:36px;

    button {
      height:76px;
      padding:0 16px;
      border:2px solid transparent;
      border-radius:4px;
      background:#0072B9;
      box-shadow:0 3px 8px 0 rgba(0, 0, 0, .25);
      font-family:inherit;
      font-weight:500;
      font-size:22px;
      color:#fff;
      transition:filter .2s, background .2s;

      /* 선택된 탭은 흰 바탕 + 파란 테두리·글자 */
      &[aria-selected='true'] {
        border:1px solid #0072B9;
        background:#fff;
        box-shadow:none;
        color:#0072B9;
      }

      &:hover:not([aria-selected='true']) {
        filter:brightness(1.1);
      }

      &:focus-visible {
        outline:2px solid #000;
        outline-offset:2px;
      }
    }
  }

  .section-head {
    display:flex;
    align-items: center;
    justify-content: space-between;
    margin-top:30px;

    h4 {
      font-weight:600;
      font-size:20px;
      line-height:1.4;
      color:#000;
    }
  }

  .periods {
    display:flex;
    gap:8px;

    button {
      min-width:138px;
      height:44px;
      border:1px solid #0072B9;
      border-radius:4px;
      background:#fff;
      font-family:inherit;
      font-weight:600;
      font-size:20px;
      color:#0072B9;
      transition:background .2s, color .2s;

      &[aria-pressed='true'] {
        background:#0072B9;
        color:#fff;
      }

      &:hover:not([aria-pressed='true']) {
        background:#EAF4FB;
      }

      &:focus-visible {
        outline:2px solid #000;
        outline-offset:2px;
      }
    }
  }

  .stats {
    display:grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap:10px;
    margin:20px 0 26px;

    li {
      min-width:0;
      padding:14px 22px 16px;
      border:1px solid #BDBDBD;
      border-radius:4px;
      background:#fff;
    }

    span {
      display:block;
      font-weight:500;
      font-size:20px;
      line-height:1.4;
      color:#5E5E5E;
    }

    strong {
      display:block;
      margin-top:4px;
      overflow:hidden;
      font-weight:600;
      font-size:34px;
      line-height:1.3;
      text-overflow:ellipsis;
      white-space:nowrap;
      color:#0072B9;
    }

    p {
      margin-top:18px;
      font-size:13px;
      line-height:1.5;
      color:#5E5E5E;
    }
  }

  .grid {
    display:grid;
    grid-template-columns: minmax(0, 375fr) minmax(0, 305fr);
    gap:32px;
    margin-top:40px;
  }

`
