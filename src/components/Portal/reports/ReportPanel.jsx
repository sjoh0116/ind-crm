import { NotepadText } from 'lucide-react';
import { styled } from 'styled-components';

// 파란 머리말(아이콘 + 제목·부제 + 오른쪽 버튼들) + 흰 본문 상자. Site Observation / Pest Device 탭이 함께 씀
export default function ReportPanel({ title, subtitle, before, actions, children, ...props }){
  return (
    <PanelWrap {...props}>
      <div className='panel-head'>
        {before}
        <NotepadText size={34} strokeWidth={1.75} aria-hidden='true' />
        <div className='panel-title'>
          <h4>{title}</h4>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {actions && <div className='panel-actions'>{actions}</div>}
      </div>
      <div className='panel-body'>{children}</div>
    </PanelWrap>
  )
}

const PanelWrap = styled.section`
  margin-top:32px;
  border:1px solid #9A9A9A;
  border-radius:8px;
  background:#fff;
  overflow:hidden;

  .panel-head {
    display:flex;
    align-items: center;
    gap:20px;
    min-height:70px;
    padding:10px 30px 10px 40px;
    background:#0072B9;
    color:#fff;

    .panel-title {
      flex:1;
      min-width:0;
    }

    h4 {
      font-weight:600;
      font-size:20px;
      line-height:1.4;
    }

    p {
      font-size:13px;
      line-height:1.5;
    }
  }

  /* 상세 화면의 목록으로 돌아가기 버튼 */
  .back {
    display:flex;
    margin-right:-8px;
    border-radius:4px;
    color:#fff;

    &:hover {
      background:rgba(255, 255, 255, .2);
    }

    &:focus-visible {
      outline:2px solid #fff;
      outline-offset:2px;
    }
  }

  .panel-actions {
    display:flex;
    flex-shrink:0;
    align-items: center;
    gap:12px;
  }

  .panel-body {
    padding:26px 40px 40px;
  }
`
