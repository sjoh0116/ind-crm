import { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { styled } from 'styled-components';

import PortalCard from '@/components/Portal/common/PortalCard.jsx';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const toISODate = (date) => [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, '0'),
  String(date.getDate()).padStart(2, '0'),
].join('-');

function getMonthCells(year, month){
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const start = new Date(year, month, 1 - first.getDay());
  const end = new Date(year, month + 1, 6 - last.getDay());

  const cells = [];
  for (const day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
    cells.push(new Date(day));
  }
  return cells;
}

export default function ServiceCalendar({ events, start }){
  const [view, setView] = useState(start);
  const { year, month } = view;

  const eventByDate = Object.fromEntries(events.map(event => [event.date, event]));
  const years = Array.from({ length: 5 }, (_, i) => start.year - 2 + i);

  const moveMonth = (step) => {
    setView(prev => {
      const next = new Date(prev.year, prev.month + step, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  return (
    <CalendarWrap title='CALENDAR' underline>
      <div className='toolbar'>
        <label className='pick'>
          <select aria-label='Month' value={month}
            onChange={(e) => setView({ year, month: Number(e.target.value) })}>
            {MONTHS.map((name, i) => <option key={name} value={i}>{name}</option>)}
          </select>
          <ChevronDown size={16} strokeWidth={2.5} aria-hidden='true' />
        </label>
        <label className='pick'>
          <select aria-label='Year' value={year}
            onChange={(e) => setView({ year: Number(e.target.value), month })}>
            {(years.includes(year) ? years : [...years, year].sort()).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <ChevronDown size={16} strokeWidth={2.5} aria-hidden='true' />
        </label>

        <div className='arrows'>
          <button type='button' aria-label='Previous month' onClick={() => moveMonth(-1)}>
            <ChevronLeft size={18} strokeWidth={2.5} aria-hidden='true' />
          </button>
          <button type='button' aria-label='Next month' onClick={() => moveMonth(1)}>
            <ChevronRight size={18} strokeWidth={2.5} aria-hidden='true' />
          </button>
        </div>
      </div>

      <div className='month' role='grid' aria-label={`${MONTHS[month]} ${year}`}>
        <div className='weekdays' role='row'>
          {WEEKDAYS.map(day => <span key={day} role='columnheader'>{day}</span>)}
        </div>
        <div className='days'>
          {getMonthCells(year, month).map(date => {
            const event = eventByDate[toISODate(date)];
            const outside = date.getMonth() !== month;
            const className = ['day', outside && 'outside', event && event.type].filter(Boolean).join(' ');
            return (
              <div key={toISODate(date)} className={className} role='gridcell'>
                <span className='num'>{date.getDate()}</span>
                {event && (
                  <span className='event'>
                    {event.label}
                    {event.time && <span className='time'>({event.time})</span>}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </CalendarWrap>
  )
}

const CalendarWrap = styled(PortalCard)`
  padding-bottom:20px;

  .toolbar {
    display:flex;
    align-items: center;
    gap:22px;
    height:32px;
  }

  .pick {
    position:relative;
    display:flex;
    align-items: center;
    color:#0072B9;

    select {
      padding:0 22px 0 0;
      border:0;
      background:transparent;
      appearance:none;
      font-family:inherit;
      font-weight:600;
      font-size:14px;
      line-height:1.6;
      color:#0072B9;
      cursor:pointer;
      outline:none;

      &:focus-visible {
        outline:2px solid #0072B9;
        outline-offset:2px;
      }

      option {
        color:#000;
      }
    }

    svg {
      position:absolute;
      right:0;
      pointer-events:none;
    }
  }

  .arrows {
    display:flex;
    gap:22px;
    margin-left:auto;
    padding-right:22px;

    button {
      display:flex;
      border-radius:4px;
      color:#0072B9;

      &:hover {
        background:rgba(0, 114, 185, .12);
      }

      &:focus-visible {
        outline:2px solid #0072B9;
      }
    }
  }

  .month {
    margin-top:2px;
    border-radius:6px;
    background:#EDEDED;
    overflow:hidden;
  }

  .weekdays {
    display:grid;
    grid-template-columns: repeat(7, 1fr);
    border-bottom:1px solid #9A9A9A;
    background:#F3DADA;

    span {
      font-weight:600;
      font-size:10px;
      line-height:36px;
      text-align:center;
      color:#000;
    }
  }

  .days {
    display:grid;
    grid-template-columns: repeat(7, 1fr);
    gap:6px;
    padding:6px 8px 14px;
  }

  .day {
    container-type:inline-size;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap:4px;
    aspect-ratio:1;
    padding:0 2px;
    border:1px solid #9A9A9A;
    border-radius:4px;
    background:#E4E4E4;
    color:#000;

    .num {
      font-weight:500;
      font-size:clamp(12px, 16cqw, 16px);
      line-height:1.2;
    }

    .event {
      font-weight:600;
      font-size:clamp(7px, 11.5cqw, 12px);
      line-height:1.25;
      text-align:center;

      .time {
        display:block;
        font-weight:500;
        font-size:clamp(6px, 9cqw, 10px);
        white-space:nowrap;
      }
    }

    &.outside {
      background:#F3F3F3;
      color:#9A9A9A;
    }

    &.done {
      border-color:#1E7B1E;
      background:#1E7B1E;
      color:#fff;
    }

    &.scheduled {
      border-color:#0072B9;
      background:#0072B9;
      color:#fff;
    }

    &.billing {
      border-color:#C4161C;
      background:#C4161C;
      color:#fff;
    }

    &.paid {
      border-color:#F5A623;
      background:#F5A623;
      color:#000;
    }

    &.outside.done {
      border-color:#CFE8CF;
      background:#CFE8CF;
      color:#1E7B1E;
    }

    &.outside.billing {
      border-color:#F0C4C6;
      background:#F0C4C6;
      color:#C4161C;
    }

    &.outside.scheduled {
      border-color:#CFE3F3;
      background:#CFE3F3;
      color:#0072B9;
    }

    &.outside.paid {
      border-color:#FBE3B8;
      background:#FBE3B8;
      color:#8A5A00;
    }
  }
`
