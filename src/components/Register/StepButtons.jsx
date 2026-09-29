import { ChevronLeft, ChevronRight } from 'lucide-react';
import { styled } from 'styled-components';

export default function StepButtons({ onBack, onNext, nextDisabled = false, nextType = 'button' }){
  return (
    <ButtonWrap>
      <button type='button' className='prev' onClick={onBack}>
        <ChevronLeft size={26} strokeWidth={2} aria-hidden='true' />
        <span>Back</span>
      </button>
      <button type={nextType} className='next' onClick={onNext} disabled={nextDisabled}>
        <span>Continue</span>
        <ChevronRight size={26} strokeWidth={2} aria-hidden='true' />
      </button>
    </ButtonWrap>
  )
}

const ButtonWrap = styled.div`
  display:flex;
  justify-content: flex-end;
  gap:24px;
  margin-top:70px;

  button {
    display:flex;
    align-items: center;
    justify-content: space-between;
    width:193px;
    height:60px;
    border-radius:6px;
    background:linear-gradient(90deg, #0A5C9C 0%, #0072B9 100%);
    box-shadow:0 2px 6px rgba(0, 0, 0, .15);
    font-family:'Poppins', sans-serif;
    font-weight:600;
    font-size:22px;
    color:#fff;
    transition:opacity .2s;

    svg {
      flex-shrink:0;
    }

    span {
      flex:1;
      text-align:center;
    }

    &.prev {
      padding:0 20px 0 16px;
    }

    &.next {
      padding:0 16px 0 20px;
    }

    &:hover:not(:disabled) {
      opacity:.9;
    }

    &:disabled {
      opacity:.5;
      cursor:not-allowed;
    }
  }
`
