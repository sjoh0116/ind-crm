import { styled } from 'styled-components';

// 아직 만들지 않은 Portal 화면 자리 표시 — 각 화면 구현 시 교체
export default function PortalPlaceholder({ title }){
  return (
    <PlaceholderWrap>
      <h2>{title}</h2>
      <p>This screen is not built yet.</p>
    </PlaceholderWrap>
  )
}

const PlaceholderWrap = styled.section`
  padding:60px 58px;
  text-align:center;

  h2 {
    font-weight:600;
    font-size:22px;
    color:#000;
  }

  p {
    margin-top:10px;
    font-size:14px;
    color:#746E6E;
  }
`
