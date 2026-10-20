import { styled } from 'styled-components';

// 색 짧은 선 + 이름 범례. items: [{ key, label, color }], count가 있으면 'label : count'
export default function PestLegend({ items, counts, ...props }){
  return (
    <LegendWrap {...props}>
      {items.map(({ key, label, color }) => (
        <li key={key} style={{ '--color': color }}>
          {counts ? `${label} : ${counts[key]}` : label}
        </li>
      ))}
    </LegendWrap>
  )
}

const LegendWrap = styled.ul`
  display:flex;
  flex-wrap:wrap;
  gap:2px 22px;

  li {
    display:flex;
    align-items: center;
    gap:8px;
    font-size:14px;
    line-height:1.5;
    color:#000;

    &::before {
      content:'';
      width:12px;
      height:3px;
      background:var(--color);
    }
  }
`
