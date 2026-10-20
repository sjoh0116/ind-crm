import { useEffect, useRef, useState } from 'react';
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { styled } from 'styled-components';

// ---- 날짜 도우미 (모두 현지 자정 기준 Date) ----
const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const addMonths = (date, months) => new Date(date.getFullYear(), date.getMonth() + months, 1);
const sameDay = (a, b) => !!a && !!b && a.getTime() === b.getTime();
const monthIndex = (date) => date.getFullYear() * 12 + date.getMonth();

export const parseISODate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// 미리 정한 기간. 'Last N days'는 오늘을 빼고 어제까지 N일
export const DATE_PRESETS = [
  { key: 'today', label: 'Today', range: (today) => [today, today] },
  { key: 'yesterday', label: 'Yesterday', range: (today) => [addDays(today, -1), addDays(today, -1)] },
  { key: 'todayAndYesterday', label: 'Today and yesterday', range: (today) => [addDays(today, -1), today] },
  ...[7, 14, 28, 30].map(days => ({
    key: `last${days}`,
    label: `Last ${days} days`,
    range: (today) => [addDays(today, -days), addDays(today, -1)],
  })),
  { key: 'thisWeek', label: 'This week', range: (today) => [addDays(today, -today.getDay()), today] },
  {
    key: 'lastWeek',
    label: 'Last week',
    range: (today) => [addDays(today, -today.getDay() - 7), addDays(today, -today.getDay() - 1)],
  },
  { key: 'thisMonth', label: 'This month', range: (today) => [addMonths(today, 0), today] },
  { key: 'lastMonth', label: 'Last month', range: (today) => [addMonths(today, -1), addDays(addMonths(today, 0), -1)] },
  { key: 'maximum', label: 'Maximum', range: (today, min) => [min, today] },
];

const CUSTOM = { key: 'custom', label: 'Custom' };
const findPreset = (key) => DATE_PRESETS.find(preset => preset.key === key) ?? CUSTOM;

// 조회 기간 버튼 + 기간 선택 팝업
// value: { preset, start, end }, today / min: 선택 가능한 마지막 / 첫 날짜
export default function DateRangePicker({ value, today, min, onChange }){
  const [open, setOpen] = useState(false);
  // 최근에 적용한 기간 (팝업 위쪽 'Recently used')
  const [recent, setRecent] = useState(['today', 'last7']);
  const wrapRef = useRef(null);

  // 바깥을 누르면 닫힘
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e) => {
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  const handleApply = (range) => {
    onChange(range);
    if (range.preset !== CUSTOM.key) {
      setRecent(prev => [range.preset, ...prev.filter(key => key !== range.preset)].slice(0, 2));
    }
    setOpen(false);
  };

  return (
    <PickerWrap ref={wrapRef}>
      <button type='button' className='trigger' aria-haspopup='dialog' aria-expanded={open}
        onClick={() => setOpen(prev => !prev)}>
        <CalendarDays size={18} strokeWidth={2} aria-hidden='true' />
        {findPreset(value.preset).label}: {formatDate(value.start)} - {formatDate(value.end)}
        <ChevronDown size={20} strokeWidth={2.5} aria-hidden='true' />
      </button>

      {/* 열 때마다 새로 만들어 현재 값으로 초기화 */}
      {open && (
        <RangePanel value={value} today={today} min={min} recent={recent}
          onCancel={() => setOpen(false)} onApply={handleApply} />
      )}
    </PickerWrap>
  )
}

function RangePanel({ value, today, min, recent, onCancel, onApply }){
  const [draft, setDraft] = useState(value);
  const [compare, setCompare] = useState(false);
  // 왼쪽 달력의 달 (오른쪽은 다음 달). 끝 날짜가 오른쪽 달력에 오도록
  const [view, setView] = useState(() => clampView(addMonths(value.end, -1)));
  const panelRef = useRef(null);

  useEffect(() => {
    panelRef.current.focus();
  }, []);

  // 두 달이 min ~ today 안에 들어오도록
  function clampView(month){
    const first = monthIndex(min);
    const last = monthIndex(today) - 1;
    const index = Math.min(Math.max(monthIndex(month), first), Math.max(first, last));
    return new Date(Math.floor(index / 12), index % 12, 1);
  }

  const applyPreset = (key) => {
    if (key === CUSTOM.key) {
      setDraft(prev => ({ ...prev, preset: key }));
      return;
    }
    const [start, end] = findPreset(key).range(today, min);
    setDraft({ preset: key, start, end });
    setView(clampView(addMonths(end, -1)));
  };

  // 첫 클릭은 시작일, 두 번째 클릭은 종료일 (앞 날짜를 누르면 서로 바꿈)
  const handleDayClick = (date) => {
    setDraft(prev => {
      if (!prev.start || prev.end) return { preset: CUSTOM.key, start: date, end: null };
      return date < prev.start
        ? { preset: CUSTOM.key, start: date, end: prev.start }
        : { preset: CUSTOM.key, start: prev.start, end: date };
    });
  };

  // 입력칸에서 직접 고친 날짜
  const handleDateInput = (field, date) => {
    setDraft(prev => {
      const next = { ...prev, preset: CUSTOM.key, [field]: date };
      if (next.start && next.end && next.start > next.end) [next.start, next.end] = [next.end, next.start];
      return next;
    });
    setView(clampView(addMonths(date, field === 'end' ? -1 : 0)));
  };

  const years = [];
  for (let year = min.getFullYear(); year <= today.getFullYear(); year++) years.push(year);

  const renderPresets = (keys, name) => keys.map(key => (
    <li key={`${name}-${key}`}>
      <label>
        <input type='radio' name={name} checked={draft.preset === key} onChange={() => applyPreset(key)} />
        {findPreset(key).label}
      </label>
    </li>
  ));

  return (
    <PanelWrap ref={panelRef} role='dialog' aria-label='Select report period' tabIndex={-1}
      onKeyDown={(e) => { if (e.key === 'Escape') onCancel(); }}>
      <div className='presets'>
        <p className='presets-title'>Recently used</p>
        <ul>{renderPresets(recent, 'recentPreset')}</ul>
        <hr />
        <ul>{renderPresets(DATE_PRESETS.map(({ key }) => key), 'datePreset')}</ul>
      </div>

      <div className='main'>
        <div className='months'>
          {[0, 1].map(offset => (
            <MonthCalendar key={offset} month={addMonths(view, offset)} years={years}
              start={draft.start} end={draft.end} today={today} min={min}
              onPrev={offset === 0 ? () => setView(clampView(addMonths(view, -1))) : null}
              onNext={offset === 1 ? () => setView(clampView(addMonths(view, 1))) : null}
              canPrev={monthIndex(view) > monthIndex(min)}
              canNext={monthIndex(view) + 1 < monthIndex(today)}
              onMonthChange={(month) => setView(clampView(addMonths(month, -offset)))}
              onDayClick={handleDayClick} />
          ))}
        </div>

        <label className='compare'>
          <input type='checkbox' checked={compare} onChange={(e) => setCompare(e.target.checked)} />
          Compare
        </label>

        <div className='inputs'>
          <span className='dot' aria-hidden='true' />
          <div className='select'>
            <select aria-label='Date range' value={draft.preset} onChange={(e) => applyPreset(e.target.value)}>
              {[...DATE_PRESETS, CUSTOM].map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
            </select>
            <ChevronDown size={18} strokeWidth={2.5} aria-hidden='true' />
          </div>
          <DateInput key={`start-${draft.start?.getTime()}`} label='Start date' value={draft.start}
            min={min} max={today} onCommit={(date) => handleDateInput('start', date)} />
          <span className='dash' aria-hidden='true'>-</span>
          <DateInput key={`end-${draft.end?.getTime()}`} label='End date' value={draft.end}
            min={min} max={today} onCommit={(date) => handleDateInput('end', date)} />
        </div>

        <div className='foot'>
          <p>Dates are shown in Kolkata Time</p>
          <button type='button' className='cancel' onClick={onCancel}>Cancel</button>
          {/* TODO: compare(이전 기간과 비교) 값도 함께 넘기기 */}
          <button type='button' className='update' disabled={!draft.start || !draft.end}
            onClick={() => onApply(draft)}>Update</button>
        </div>
      </div>
    </PanelWrap>
  )
}

function MonthCalendar({ month, years, start, end, today, min, onPrev, onNext, canPrev, canNext, onMonthChange, onDayClick }){
  const offset = month.getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1));
  const label = `${MONTHS[month.getMonth()]} ${month.getFullYear()}`;

  return (
    <div className='month'>
      <div className='month-head'>
        {onPrev ? (
          <button type='button' className='nav' aria-label='Previous month' disabled={!canPrev} onClick={onPrev}>
            <ChevronLeft size={20} strokeWidth={2.5} aria-hidden='true' />
          </button>
        ) : <span className='nav' />}
        <div className='select'>
          <select aria-label={`Month (${label})`} value={month.getMonth()}
            onChange={(e) => onMonthChange(new Date(month.getFullYear(), Number(e.target.value), 1))}>
            {MONTHS.map((name, i) => <option key={name} value={i}>{name}</option>)}
          </select>
          <ChevronDown size={16} strokeWidth={3} aria-hidden='true' />
        </div>
        <div className='select'>
          <select aria-label={`Year (${label})`} value={month.getFullYear()}
            onChange={(e) => onMonthChange(new Date(Number(e.target.value), month.getMonth(), 1))}>
            {years.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
          <ChevronDown size={16} strokeWidth={3} aria-hidden='true' />
        </div>
        {onNext ? (
          <button type='button' className='nav' aria-label='Next month' disabled={!canNext} onClick={onNext}>
            <ChevronRight size={20} strokeWidth={2.5} aria-hidden='true' />
          </button>
        ) : <span className='nav' />}
      </div>

      <div className='days' role='grid' aria-label={label}>
        {WEEKDAYS.map(day => <span key={day} className='weekday'>{day}</span>)}
        {offset > 0 && <span style={{ gridColumn: `span ${offset}` }} />}
        {days.map(date => {
          const column = date.getDay();
          const isStart = sameDay(date, start);
          const isEnd = sameDay(date, end);
          const inRange = isStart || isEnd || (!!start && !!end && date > start && date < end);
          // 범위 띠는 주의 처음 / 끝, 달의 처음 / 끝, 범위의 처음 / 끝에서 둥글게
          const roundLeft = isStart || column === 0 || date.getDate() === 1;
          const roundRight = isEnd || column === 6 || date.getDate() === daysInMonth;
          const className = [
            'day',
            inRange && 'in-range',
            inRange && roundLeft && 'round-l',
            inRange && roundRight && 'round-r',
            (isStart || isEnd) && 'edge',
            sameDay(date, today) && 'today',
          ].filter(Boolean).join(' ');
          return (
            <button key={date.getDate()} type='button' className={className}
              disabled={date > today || date < min} aria-pressed={inRange}
              aria-label={formatDate(date)} onClick={() => onDayClick(date)}>
              <span>{date.getDate()}</span>
            </button>
          );
        })}
      </div>
    </div>
  )
}

// 'Sep 9, 2026' 형식으로 직접 입력. 칸을 벗어나거나 Enter를 누르면 반영 (잘못된 값은 되돌림)
function DateInput({ label, value, min, max, onCommit }){
  const [text, setText] = useState(value ? formatDate(value) : '');

  const commit = () => {
    const parsed = new Date(text);
    if (Number.isNaN(parsed.getTime())) {
      setText(value ? formatDate(value) : '');
      return;
    }
    const date = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
    const clamped = date < min ? min : date > max ? max : date;
    if (sameDay(clamped, value)) setText(formatDate(clamped));
    else onCommit(clamped);
  };

  return (
    <input type='text' className='date' aria-label={label} value={text} placeholder='Select date'
      onChange={(e) => setText(e.target.value)} onBlur={commit}
      onKeyDown={(e) => { if (e.key === 'Enter') commit(); }} />
  )
}

const PickerWrap = styled.div`
  position:relative;

  .trigger {
    display:flex;
    align-items: center;
    gap:12px;
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
`

const PanelWrap = styled.div`
  position:absolute;
  top:calc(100% + 8px);
  right:0;
  z-index:20;
  display:flex;
  width:800px;
  height:500px;
  border:1px solid #D6DEE6;
  border-radius:6px;
  background:#fff;
  box-shadow:0 6px 24px 0 rgba(0, 0, 0, .2);
  font-family:'Poppins', sans-serif;
  color:#000;
  outline:none;

  .presets {
    flex-shrink:0;
    width:224px;
    padding:20px 14px 20px 20px;
    border-right:1px solid #E1E5EA;
    overflow-y:auto;

    .presets-title {
      margin-bottom:6px;
      font-weight:600;
      font-size:14px;
    }

    hr {
      margin:6px 0;
      border:0;
      border-top:1px solid #D6DEE6;
    }

    label {
      display:flex;
      align-items: center;
      gap:10px;
      min-height:32px;
      font-size:14px;
      white-space:nowrap;
      cursor:pointer;
    }
  }

  input[type='radio'] {
    flex-shrink:0;
    width:20px;
    height:20px;
    margin:0;
    border:1px solid #9AA3AD;
    border-radius:50%;
    background:#fff;
    appearance:none;
    cursor:pointer;

    &:checked {
      border-color:#0072B9;
      background:#0072B9;
      box-shadow:inset 0 0 0 4px #fff;
    }

    &:focus-visible {
      outline:2px solid #0072B9;
      outline-offset:2px;
    }
  }

  .main {
    display:flex;
    flex:1;
    flex-direction: column;
    min-width:0;
    padding:16px 20px 18px 22px;
  }

  .months {
    display:grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap:28px;
  }

  .month-head {
    display:flex;
    align-items: center;
    justify-content: space-between;
    gap:6px;
    margin-bottom:6px;

    .nav {
      display:flex;
      align-items: center;
      justify-content: center;
      width:28px;
      height:28px;
      border-radius:4px;
      color:#000;

      &:hover:not(:disabled) {
        background:#EEF3F8;
      }

      &:disabled {
        color:#C4C9CF;
        cursor:not-allowed;
      }
    }
  }

  .select {
    position:relative;
    display:flex;
    align-items: center;

    select {
      height:30px;
      padding:0 24px 0 6px;
      border:0;
      background:transparent;
      font-family:inherit;
      font-weight:600;
      font-size:14px;
      color:#000;
      appearance:none;
      cursor:pointer;

      &:focus-visible {
        outline:2px solid #0072B9;
        border-radius:4px;
      }
    }

    svg {
      position:absolute;
      right:4px;
      pointer-events:none;
    }
  }

  .days {
    display:grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    row-gap:4px;
    text-align:center;

    .weekday {
      font-size:12px;
      line-height:26px;
      color:#3C4043;
    }
  }

  .day {
    height:30px;
    padding:0;
    font-family:inherit;
    font-size:14px;
    color:#000;

    span {
      display:flex;
      align-items: center;
      justify-content: center;
      height:100%;
      border-radius:4px;
    }

    &:hover:not(:disabled) span {
      background:#E3EEF9;
    }

    &:disabled {
      color:#9AA0A6;
      cursor:default;
    }

    &.today {
      font-weight:600;
      color:#0072B9;
    }

    &.in-range {
      background:#C6DDF4;

      span {
        background:transparent;
      }
    }

    &.round-l {
      border-top-left-radius:4px;
      border-bottom-left-radius:4px;
    }

    &.round-r {
      border-top-right-radius:4px;
      border-bottom-right-radius:4px;
    }

    &.edge span {
      background:#0B6CB0;
      font-weight:600;
      color:#fff;
    }

    &:focus-visible {
      outline:2px solid #0072B9;
      outline-offset:-2px;
    }
  }

  .compare {
    display:flex;
    align-items: center;
    gap:10px;
    margin-top:28px;
    font-size:14px;
    cursor:pointer;

    input {
      width:20px;
      height:20px;
      margin:0;
      accent-color:#0072B9;
      cursor:pointer;
    }
  }

  .inputs {
    display:flex;
    align-items: center;
    gap:8px;
    margin-top:12px;

    .dot {
      flex-shrink:0;
      width:12px;
      height:12px;
      margin-right:4px;
      border-radius:50%;
      background:#C6DDF4;
    }

    .select {
      flex:1;
      min-width:0;

      select {
        width:100%;
        height:36px;
        padding:0 32px 0 12px;
        border:1px solid #BDC4CC;
        border-radius:4px;
        font-weight:400;
      }

      svg {
        right:10px;
      }
    }

    .date {
      width:136px;
      height:36px;
      padding:0 10px;
      border:1px solid #BDC4CC;
      border-radius:4px;
      font-family:inherit;
      font-size:14px;
      line-height:1.6;
      color:#000;
      outline:none;

      &:focus {
        border-color:#0072B9;
        box-shadow:0 0 0 3px rgba(0, 114, 185, .15);
      }
    }

    .dash {
      color:#5E5E5E;
    }
  }

  .foot {
    display:flex;
    align-items: flex-end;
    gap:8px;
    margin-top:auto;

    p {
      flex:1;
      font-size:11px;
      color:#5E5E5E;
    }

    button {
      min-width:76px;
      height:36px;
      padding:0 14px;
      border-radius:4px;
      font-family:inherit;
      font-weight:500;
      font-size:14px;

      &:focus-visible {
        outline:2px solid #000;
        outline-offset:2px;
      }
    }

    .cancel {
      border:1px solid #BDC4CC;
      background:#fff;
      color:#000;

      &:hover {
        background:#F3F5F7;
      }
    }

    .update {
      background:#0072B9;
      color:#fff;

      &:hover:not(:disabled) {
        filter:brightness(1.1);
      }

      &:disabled {
        opacity:.5;
        cursor:not-allowed;
      }
    }
  }
`
