import { ChevronDown } from 'lucide-react';
import { styled } from 'styled-components';

// select + 우측 lucide 아이콘 (기본: ChevronDown). 테두리/폰트 등은 상위 폼 스타일을 따름
export default function SelectBox({ icon: Icon = ChevronDown, iconSize = 26, children, ...props }){
  return (
    <SelectWrap>
      <select {...props}>{children}</select>
      <Icon size={iconSize} strokeWidth={2} aria-hidden='true' />
    </SelectWrap>
  )
}

const SelectWrap = styled.div`
  position:relative;
  width:100%;

  select {
    padding-right:56px;
    background-image:none;
    appearance:none;
    cursor:pointer;
  }

  > svg {
    position:absolute;
    top:50%;
    right:16px;
    transform:translateY(-50%);
    color:#000;
    pointer-events:none;
  }
`
