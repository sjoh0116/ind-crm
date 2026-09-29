import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

// key: 각 단계 페이지 URL의 마지막 경로 (예: /commercial/information → 'information')
export const REGISTER_STEPS = [
  { key: 'category', label: 'Category' },
  { key: 'information', label: 'Information' },
  { key: 'plan', label: 'Plan & AMC' },
  { key: 'sign', label: 'T&C & Sign' },
];

// 매칭되는 단계가 없으면 (예: '/') 1단계로 본다
function getCurrentStep(pathname){
  const segment = pathname.split('/').filter(Boolean).pop();
  const index = REGISTER_STEPS.findIndex(step => step.key === segment);
  return index === -1 ? 1 : index + 1;
}

export default function RegisterStep(){
  const { pathname } = useLocation();
  const current = getCurrentStep(pathname);

  return (
    <StepWrap>
      <div className='inner'>
        <ul>
          {REGISTER_STEPS.map(({ key, label }, i) => {
            const step = i + 1;
            const className = [
              step <= current && 'active',
              step < current && 'done',
            ].filter(Boolean).join(' ');

            return (
              <li key={key} className={className} aria-current={step === current ? 'step' : undefined}>
                <span>{step}</span>
                <strong>{label}</strong>
              </li>
            );
          })}
        </ul>
      </div>
    </StepWrap>
  )
}

const StepWrap = styled.section`
  position:relative;
  z-index:1;
  width:100%;
  background:rgba(247, 249, 254, .2);
  box-shadow:0 2px 6px 0 rgba(0, 0, 0, .25);

  .inner {
    width:100%;
    padding:0 5.8%;

    ul {
      display:flex;
      align-items: center;
      height:90px;

      li {
        flex:1 1 auto;
        display:flex;
        align-items: center;
        gap:24px;

        &:not(:last-child)::after {
          content:'';
          flex:0 1 120px;
          height:2px;
          margin:0 auto;
          background:#D9D9D9;
          transition:background .3s;
        }

        &:last-child {
          flex:none;
        }

        span {
          display:flex;
          align-items: center;
          justify-content: center;
          flex-shrink:0;
          width:44px;
          height:44px;
          border-radius:50%;
          background:#ACACAC;
          font-family:'Poppins', sans-serif;
          font-weight:600;
          font-size:16px;
          color:#fff;
          transition:background .3s;
        }

        strong {
          font-family:'Poppins', sans-serif;
          font-weight:600;
          font-size:24px;
          line-height:1.2;
          color:#ACACAC;
          white-space:nowrap;
          transition:color .3s;
        }

        &.active {
          span {
            background:#0072B9;
          }

          strong {
            color:#0072B9;
          }
        }

        /* 완료된 단계 뒤의 연결선 */
        &.done::after {
          background:#0072B9;
        }
      }
    }
  }
`
