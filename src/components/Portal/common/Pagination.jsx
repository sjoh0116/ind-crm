import { ChevronLeft, ChevronRight } from 'lucide-react';
import { styled } from 'styled-components';

// 보여 줄 페이지 번호. 많으면 현재 페이지 주변 + 마지막 페이지만, 사이는 '…'
const pageItems = (page, total) => {
  if (total <= 9) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(1, Math.min(page - 3, total - 8));
  const end = Math.min(total, start + 6);
  const items = [];
  for (let n = start; n <= end; n++) items.push(n);
  if (end < total - 1) items.push('gap');
  if (end < total) items.push(total);
  return items;
};

// page: 1부터 시작
export default function Pagination({ page, total, onChange, className }){
  if (total <= 1) return null;

  return (
    <PaginationWrap className={className} aria-label='Pagination'>
      <button type='button' aria-label='Previous page' disabled={page === 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft size={16} strokeWidth={3} aria-hidden='true' />
      </button>
      {pageItems(page, total).map((item, i) => (item === 'gap' ? (
        <span key={`gap-${i}`} className='gap' aria-hidden='true'>…</span>
      ) : (
        <button key={item} type='button' aria-current={item === page ? 'page' : undefined}
          onClick={() => onChange(item)}>{item}</button>
      )))}
      <button type='button' aria-label='Next page' disabled={page === total} onClick={() => onChange(page + 1)}>
        <ChevronRight size={16} strokeWidth={3} aria-hidden='true' />
      </button>
    </PaginationWrap>
  )
}

const PaginationWrap = styled.nav`
  display:flex;
  align-items: center;
  justify-content: flex-end;
  gap:4px;

  button,
  .gap {
    display:flex;
    align-items: center;
    justify-content: center;
    min-width:24px;
    height:24px;
    padding:0 4px;
    border-radius:2px;
    background:#C6DDF4;
    font-family:inherit;
    font-weight:500;
    font-size:12px;
    color:#0B5C94;
  }

  button {
    transition:background .2s, color .2s;

    &:hover:not(:disabled):not([aria-current]) {
      background:#A9CBEE;
    }

    &[aria-current='page'] {
      background:#0072B9;
      color:#fff;
    }

    &:disabled {
      opacity:.45;
      cursor:not-allowed;
    }

    &:focus-visible {
      outline:2px solid #0072B9;
      outline-offset:2px;
    }
  }
`
