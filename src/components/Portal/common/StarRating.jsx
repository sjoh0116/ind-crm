import { useState } from 'react';
import { Star } from 'lucide-react';
import { styled } from 'styled-components';

const STARS = [1, 2, 3, 4, 5];

// 별점 입력 (1~5). 마우스를 올리면 미리 채워지고, 누르면 선택됨
export default function StarRating({ value, onChange, labelledBy, size = 34 }){
  const [hovered, setHovered] = useState(0);

  return (
    <StarsWrap role='radiogroup' aria-labelledby={labelledBy} onMouseLeave={() => setHovered(0)}>
      {STARS.map(star => {
        const active = star <= (hovered || value);
        return (
          <button key={star} type='button' role='radio' aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            onMouseEnter={() => setHovered(star)}
            onClick={() => onChange(star)}>
            <Star size={size} strokeWidth={1.2} className={active ? 'on' : ''}
              fill={active ? '#F5A623' : 'none'} aria-hidden='true' />
          </button>
        );
      })}
    </StarsWrap>
  )
}

const StarsWrap = styled.div`
  display:flex;
  gap:8px;

  button {
    display:flex;
    border-radius:4px;
    color:#333;

    &:focus-visible {
      outline:2px solid #0072B9;
      outline-offset:2px;
    }
  }

  svg.on {
    color:#F5A623;
  }
`
