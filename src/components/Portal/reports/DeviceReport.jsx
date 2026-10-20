import { Fragment, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { styled } from 'styled-components';

import ReportPanel from '@/components/Portal/reports/ReportPanel.jsx';
import Pagination from '@/components/Portal/common/Pagination.jsx';

const DEVICE_TABS = [
  { key: 'all', label: 'All Devices' },
  { key: 'fly', label: 'Fly Catcher Machines' },
  { key: 'rodent', label: 'Rodent Boxes' },
];

const TYPES = {
  fly: { label: 'Fly Catcher', background: '#D3E6F7', color: '#0B5C94' },
  rodent: { label: 'Rodent Box', background: '#E9D5F7', color: '#7B17D6' },
};

const STATUS = {
  'glue-changed': { label: 'Glue Pad Changed', color: '#1E7B1E' },
  'machine-cleaned': { label: 'Machine Checked & Cleaned', color: '#E8920C' },
  'box-cleaned': { label: 'Rodent Box Checked & Cleaned', color: '#E8920C' },
};

// 한 페이지 기록 수 (시안 기준)
const PAGE_SIZE = 11;
const ALL = 'all';

const unique = (values) => [...new Set(values)];

// Reports > Pest Device Report 탭: 장비 점검 기록 표
// records: [{ id, device, type, building, floor, area, date, status, findings, damaged?, operator, photos }]
export default function DeviceReport({ records, summary }){
  const [deviceType, setDeviceType] = useState(ALL);
  const [filters, setFilters] = useState({ keyword: '', building: ALL, area: ALL, status: ALL });
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);

  const keyword = filters.keyword.trim().toLowerCase();
  const filtered = records.filter(record => (deviceType === ALL || record.type === deviceType)
    && (!keyword || record.device.toLowerCase().includes(keyword))
    && (filters.building === ALL || record.building === filters.building)
    && (filters.area === ALL || record.area === filters.area)
    && (filters.status === ALL || record.status === filters.status));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // 조건이 바뀌면 첫 페이지로
  const updateFilter = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const selects = [
    { name: 'building', label: 'All Building', options: unique(records.map(({ building }) => building)).map(v => [v, v]) },
    { name: 'area', label: 'All Areas', options: unique(records.map(({ area }) => area)).map(v => [v, v]) },
    { name: 'status', label: 'All Status', options: Object.entries(STATUS).map(([key, { label }]) => [key, label]) },
  ];

  return (
    <ReportPanel title='Pest Control Devices Report'
      subtitle='View installed devices, inspection records and maintenance history for your property'>
      <DeviceWrap>
        <div className='tabs-row'>
          <div className='device-tabs' role='tablist' aria-label='Device type'>
            {DEVICE_TABS.map(({ key, label }) => (
              <button key={key} type='button' role='tab' aria-selected={deviceType === key}
                onClick={() => { setDeviceType(key); setPage(1); }}>
                {label}
              </button>
            ))}
          </div>
          <p className='installed'>
            Fly Catcher Machine Installed : {summary.flyCatcher}&nbsp;|&nbsp;
            Rodent Box Installed: {String(summary.rodentBox).padStart(2, '0')}
          </p>
        </div>

        <div className='filters'>
          <label className='search'>
            <Search size={18} strokeWidth={2} aria-hidden='true' />
            <input type='search' aria-label='Search by device name' placeholder='Search by device name'
              value={filters.keyword} onChange={(e) => updateFilter('keyword', e.target.value)} />
          </label>
          {selects.map(({ name, label, options }) => (
            <div className='select' key={name}>
              <select aria-label={label} value={filters[name]} onChange={(e) => updateFilter(name, e.target.value)}>
                <option value={ALL}>{label}</option>
                {options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
              </select>
              <ChevronDown size={18} strokeWidth={2} aria-hidden='true' />
            </div>
          ))}
        </div>

        <div className='table-box'>
          <table>
            <thead>
              <tr>
                <th scope='col'>Device ID</th>
                <th scope='col'>Type</th>
                <th scope='col'>Location</th>
                <th scope='col'>Date</th>
                <th scope='col'>Status</th>
                <th scope='col'>Findings</th>
                <th scope='col'><span className='sr-only'>Details</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(record => {
                const type = TYPES[record.type];
                const status = STATUS[record.status];
                const expanded = expandedId === record.id;
                return (
                  <Fragment key={record.id}>
                    <tr className={expanded ? 'expanded' : undefined}>
                      <td>{record.device}</td>
                      <td>
                        <span className='type' style={{ background: type.background, color: type.color }}>{type.label}</span>
                      </td>
                      <td>{record.building}, {record.floor}, {record.area}</td>
                      <td>{record.date}</td>
                      <td className='status' style={{ color: status.color }}>{status.label}</td>
                      <td className='findings'>
                        {record.damaged ? <span className='damaged'>Damaged</span>
                          : record.findings.length > 0
                            ? record.findings.map(({ amount, pest }) => <span key={pest}>{amount} - {pest}</span>)
                            : '-'}
                      </td>
                      <td>
                        <button type='button' className='toggle' aria-expanded={expanded}
                          aria-label={`${expanded ? 'Hide' : 'Show'} ${record.device} details`}
                          onClick={() => setExpandedId(expanded ? null : record.id)}>
                          <ChevronDown size={20} strokeWidth={2} aria-hidden='true' />
                        </button>
                      </td>
                    </tr>
                    {expanded && (
                      <tr className='detail'>
                        <td colSpan={7}>
                          <div className='detail-body'>
                            <p>Operator : {record.operator}</p>
                            <div className='photos'>
                              {record.photos.map((photo, i) => (
                                <div className='photo' key={i}>
                                  {photo ? <img src={photo} alt={`${record.device} photo ${i + 1}`} /> : 'Photo'}
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 && <p className='empty'>No device records found.</p>}
          <Pagination className='pagination' page={currentPage} total={totalPages}
            onChange={(next) => { setPage(next); setExpandedId(null); }} />
        </div>
      </DeviceWrap>
    </ReportPanel>
  )
}

const DeviceWrap = styled.div`
  .sr-only {
    position:absolute;
    width:1px;
    height:1px;
    overflow:hidden;
    clip:rect(0 0 0 0);
    white-space:nowrap;
  }

  .tabs-row {
    display:flex;
    align-items: flex-end;
    justify-content: space-between;
    gap:16px;
    margin-top:-6px;
  }

  .device-tabs {
    display:flex;
    gap:24px;

    button {
      padding:4px 0 6px;
      border-bottom:2px solid transparent;
      font-family:inherit;
      font-weight:600;
      font-size:15px;
      color:#000;

      &[aria-selected='true'] {
        border-color:#0072B9;
        color:#0072B9;
      }

      &:hover {
        color:#0072B9;
      }

      &:focus-visible {
        outline:2px solid #0072B9;
        outline-offset:2px;
      }
    }
  }

  .installed {
    padding-bottom:6px;
    font-weight:500;
    font-size:12px;
    color:#333;
  }

  .filters {
    display:flex;
    gap:10px;
    margin-top:14px;

    .search {
      display:flex;
      align-items: center;
      gap:8px;
      width:250px;
      height:36px;
      padding:0 12px;
      border:1px solid #6CA6D6;
      border-radius:4px;
      background:#fff;
      color:#0072B9;

      &:focus-within {
        box-shadow:0 0 0 3px rgba(0, 114, 185, .15);
      }

      input {
        flex:1;
        min-width:0;
        border:0;
        font-family:inherit;
        font-size:13px;
        line-height:1.6;
        color:#000;
        outline:none;

        &::placeholder {
          color:#9A9A9A;
        }
      }
    }

    .select {
      position:relative;

      select {
        width:210px;
        height:36px;
        padding:0 36px 0 12px;
        border:1px solid #6CA6D6;
        border-radius:4px;
        background:#fff;
        font-family:inherit;
        font-weight:600;
        font-size:13px;
        color:#0B4F7C;
        appearance:none;
        cursor:pointer;

        &:focus-visible {
          outline:2px solid #0072B9;
          outline-offset:1px;
        }
      }

      svg {
        position:absolute;
        top:50%;
        right:10px;
        transform:translateY(-50%);
        color:#0B4F7C;
        pointer-events:none;
      }
    }
  }

  .table-box {
    margin-top:12px;
    padding-bottom:20px;
    border:1px solid #9A9A9A;
    border-radius:6px;
    overflow:hidden;
  }

  table {
    width:100%;
    border-collapse:collapse;
    table-layout:fixed;
  }

  th:nth-child(1) { width:11%; }
  th:nth-child(2) { width:14%; }
  th:nth-child(3) { width:16%; }
  th:nth-child(4) { width:15%; }
  th:nth-child(5) { width:17%; }
  th:nth-child(6) { width:20%; }

  th {
    height:40px;
    padding:0 10px;
    background:#DCDFE3;
    font-weight:700;
    font-size:13px;
    text-align:center;
    color:#000;
  }

  td {
    padding:18px 10px;
    border-bottom:1px solid #D6DEE6;
    font-weight:600;
    font-size:12px;
    line-height:1.5;
    text-align:center;
    vertical-align:middle;
    color:#000;
  }

  tr.expanded td {
    border-bottom:0;
  }

  .type {
    display:inline-block;
    vertical-align:middle;
    padding:0 6px;
    border-radius:2px;
    font-weight:600;
    font-size:11px;
    line-height:18px;
  }

  .status {
    padding-left:40px;
    text-align:left;
  }

  .findings {
    span {
      display:block;
    }

    .damaged {
      color:#D7191F;
    }
  }

  .toggle {
    display:inline-flex;
    vertical-align:middle;
    border-radius:4px;
    color:#0072B9;

    svg {
      transition:transform .2s;
    }

    &[aria-expanded='true'] svg {
      transform:rotate(-90deg);
    }

    &:hover {
      background:#EAF4FB;
    }

    &:focus-visible {
      outline:2px solid #0072B9;
    }
  }

  tr.detail td {
    padding:0 10px 22px;
  }

  /* Operator 글자는 사진 높이의 가운데에 */
  .detail-body {
    display:flex;
    align-items: center;
    gap:40px;

    p {
      width:36%;
      padding-right:40px;
      font-weight:600;
      font-size:12px;
      text-align:right;
    }
  }

  .photos {
    display:flex;
    gap:56px;
  }

  .photo {
    display:flex;
    align-items: center;
    justify-content: center;
    width:300px;
    height:230px;
    border:1px solid #D6DEE6;
    border-radius:6px;
    background:#F3F6FA;
    overflow:hidden;
    font-weight:400;
    font-size:18px;
    color:#5E5E5E;

    img {
      width:100%;
      height:100%;
      object-fit:cover;
    }
  }

  .empty {
    padding:30px 0;
    font-size:14px;
    text-align:center;
    color:#746E6E;
  }

  .pagination {
    margin:20px 24px 0;
  }
`
