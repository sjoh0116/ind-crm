import { styled } from 'styled-components';

// Reports 화면의 회색 카드 (제목 + 부제 + 구분선 + 본문)
export default function ReportCard({ title, subtitle, divider = true, children, ...props }){
  return (
    <CardWrap $divider={divider} {...props}>
      <div className='card-head'>
        <h4>{title}</h4>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </CardWrap>
  )
}

const CardWrap = styled.section`
  display:flex;
  flex-direction: column;
  min-width:0;
  padding:22px 0 26px;
  border-radius:14px;
  background:#F8F9FB;
  box-shadow:0 2px 8px 0 rgba(0, 0, 0, .18);

  .card-head {
    margin:0 22px;
    padding-bottom:${({ $divider }) => ($divider ? '6px' : '0')};
    border-bottom:${({ $divider }) => ($divider ? '1px solid #C9CDD2' : '0')};

    h4 {
      font-weight:600;
      font-size:22px;
      line-height:1.35;
      color:#000;
    }

    p {
      font-size:13px;
      line-height:1.5;
      color:#5E5E5E;
    }
  }
`
