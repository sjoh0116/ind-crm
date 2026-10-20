import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

// Portal 화면의 테두리 카드 + 제목 줄 (제목, 제목 옆 배지, 오른쪽 'View All' 링크)
export default function PortalCard({ title, badge, viewAllTo, underline, accent, tone, children, ...props }){
  return (
    <CardWrap $tone={tone} {...props}>
      <div className={`card-head${underline ? ' underline' : ''}`}>
        <h3 className={accent ? 'accent' : ''}>{title}</h3>
        {badge}
        {viewAllTo && <Link to={viewAllTo} className='view-all'>View All</Link>}
      </div>
      {children}
    </CardWrap>
  )
}

const CardWrap = styled.section`
  padding:16px 24px 22px;
  border:1px solid #333;
  border-radius:10px;
  background:${({ $tone }) => ($tone === 'note' ? 'rgba(185, 185, 0, .08)' : '#fff')};

  .card-head {
    display:flex;
    align-items: center;
    gap:12px;
    min-height:34px;

    &.underline {
      margin-bottom:6px;
      border-bottom:1px solid #333;
    }

    h3 {
      font-weight:700;
      font-size:16px;
      line-height:1.3;
      color:#000;

      &.accent {
        color:#0072B9;
      }
    }

    .view-all {
      margin-left:auto;
      font-weight:600;
      font-size:12px;
      color:#0072B9;
      text-decoration:underline;

      &:focus-visible {
        outline:2px solid #0072B9;
        outline-offset:2px;
      }
    }
  }
`

// 상태 배지 (Assigned / Completed / Slot Confirmed 등)
export const StatusBadge = styled.span`
  padding:0 8px;
  border-radius:3px;
  font-weight:700;
  font-size:10px;
  line-height:14px;
  white-space:nowrap;
  background:${({ $tone }) => ({ blue: '#CFE3F3', green: '#CFE8CF', red: '#F8D4D5' }[$tone] ?? '#E9E9E9')};
  color:${({ $tone }) => ({ blue: '#0072B9', green: '#1E7B1E', red: '#D7191F' }[$tone] ?? '#333')};
`

// 카드 안의 파란 버튼 (아이콘 + 문구)
export const CardButton = styled.button`
  display:flex;
  align-items: center;
  justify-content: center;
  gap:10px;
  min-width:250px;
  height:38px;
  margin:14px auto 0;
  padding:0 22px;
  border-radius:8px;
  background:#0072B9;
  box-shadow:inset 0 4px 40px 0 rgba(0, 0, 0, .2);
  font-family:inherit;
  font-weight:700;
  font-size:14px;
  white-space:nowrap;
  color:#fff;
  transition:filter .2s;

  &:hover:not(:disabled) {
    filter:brightness(1.1);
  }

  &:disabled {
    opacity:.5;
    cursor:not-allowed;
  }

  &:focus-visible {
    outline:2px solid #000;
    outline-offset:2px;
  }
`
