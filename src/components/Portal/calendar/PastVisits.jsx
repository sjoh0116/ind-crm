import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { styled } from 'styled-components';

import VisitCard from '@/components/Portal/calendar/VisitCard.jsx';

// 지난 방문 카드 목록 — 가로로 넘겨 보며, 오른쪽 아래 화살표로 한 장씩 이동
export default function PastVisits({ visits, onViewReport, onViewSlip }){
  const trackRef = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  // 스크롤 위치에 따라 화살표 활성/비활성
  const updateEdges = () => {
    const track = trackRef.current;
    if (!track) return;
    setEdges({
      start: track.scrollLeft <= 1,
      end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 1,
    });
  };

  useEffect(() => {
    updateEdges();
    window.addEventListener('resize', updateEdges);
    return () => window.removeEventListener('resize', updateEdges);
  }, [visits]);

  const scrollByCard = (direction) => {
    const track = trackRef.current;
    const card = track.querySelector('li');
    if (!card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: 'smooth' });
  };

  return (
    <PastWrap aria-labelledby='pastVisitsTitle'>
      <h3 id='pastVisitsTitle'>PAST VISITS</h3>

      {visits.length > 0 ? (
        <>
          <ul className='track' ref={trackRef} onScroll={updateEdges}>
            {visits.map(visit => (
              <li key={visit.id}>
                <VisitCard
                  title='Completed Service'
                  visit={visit}
                  actions={[
                    { label: 'View Report', onClick: () => onViewReport?.(visit) },
                    { label: 'Completion Slip', onClick: () => onViewSlip?.(visit) },
                  ]}
                />
              </li>
            ))}
          </ul>

          <div className='arrows'>
            <button type='button' aria-label='Previous visits' disabled={edges.start} onClick={() => scrollByCard(-1)}>
              <ChevronLeft size={20} strokeWidth={3} aria-hidden='true' />
            </button>
            <button type='button' aria-label='Next visits' disabled={edges.end} onClick={() => scrollByCard(1)}>
              <ChevronRight size={20} strokeWidth={3} aria-hidden='true' />
            </button>
          </div>
        </>
      ) : <p className='empty'>No past visits yet.</p>}
    </PastWrap>
  )
}

const PastWrap = styled.section`
  border:1px solid #333;
  border-radius:10px;
  background:#fff;
  overflow:hidden;

  h3 {
    padding:0 32px;
    background:#0072B9;
    font-weight:700;
    font-size:16px;
    line-height:62px;
    color:#fff;
  }

  .track {
    display:grid;
    grid-auto-columns: 470px;
    grid-auto-flow: column;
    column-gap:14px;
    padding:30px 0 6px 32px;
    overflow-x:auto;
    scroll-snap-type:x mandatory;
    scroll-padding-left:32px;
    scrollbar-width:none;

    &::-webkit-scrollbar {
      display:none;
    }

    li {
      display:flex;
      scroll-snap-align:start;

      > article {
        flex:1;
      }
    }
  }

  .arrows {
    display:flex;
    justify-content: flex-end;
    gap:24px;
    padding:20px 54px 26px;

    button {
      display:flex;
      align-items: center;
      justify-content: center;
      width:36px;
      height:36px;
      border-radius:50%;
      background:#0072B9;
      color:#fff;
      transition:opacity .2s, filter .2s;

      &:hover:not(:disabled) {
        filter:brightness(1.1);
      }

      &:disabled {
        opacity:.35;
        cursor:default;
      }

      &:focus-visible {
        outline:2px solid #000;
        outline-offset:2px;
      }
    }
  }

  .empty {
    padding:30px 32px;
    font-size:14px;
    color:#746E6E;
  }
`
