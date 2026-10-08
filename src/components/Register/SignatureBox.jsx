import { useEffect, useEffectEvent, useRef, useState } from 'react';
import SignaturePad from 'signature_pad';
import { styled } from 'styled-components';

// signature_pad 기반 전자서명 영역
// onChange(dataUrl | null): 획을 그릴 때마다 PNG data URL, 지우면 null
export default function SignatureBox({ label, required, error, onChange }){
  const canvasRef = useRef(null);
  const padRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleEndStroke = useEffectEvent(() => {
    setIsEmpty(false);
    onChange?.(padRef.current.toDataURL('image/png'));
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const pad = new SignaturePad(canvas, { penColor: '#000' });
    padRef.current = pad;

    // 고해상도 화면에서도 선이 흐려지지 않도록 실제 픽셀 크기를 맞추고, 크기가 바뀌면 기존 서명을 다시 그림
    const resize = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      // 상위 레이아웃에 CSS zoom이 걸려 있으면 포인터 좌표(화면 기준)와 캔버스 좌표가 어긋나므로
      // 화면에 보이는 크기 / 레이아웃 크기 비율만큼 보정
      const zoom = canvas.offsetWidth ? canvas.getBoundingClientRect().width / canvas.offsetWidth : 1;
      const data = pad.toData();
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d').scale(ratio / zoom, ratio / zoom);
      pad.clear();
      pad.fromData(data);
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    // 배율만 바뀌면 캔버스의 레이아웃 크기는 그대로라 ResizeObserver가 불리지 않음
    window.addEventListener('resize', resize);
    const onEndStroke = () => handleEndStroke();
    pad.addEventListener('endStroke', onEndStroke);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
      pad.removeEventListener('endStroke', onEndStroke);
      pad.off();
    };
  }, []);

  const handleClear = () => {
    padRef.current?.clear();
    setIsEmpty(true);
    onChange?.(null);
  };

  return (
    <SignatureWrap>
      <span className='label'>
        {label}
        {required && <em aria-hidden='true'>*</em>}
      </span>
      <div className={`pad-outer${error ? ' invalid' : ''}`}>
        <div className='pad-inner'>
          <canvas ref={canvasRef} aria-label={label} />
          {isEmpty && (
            <p className='guide' aria-hidden='true'>
              Draw signature with finger or mouse here
              <br />
              Sign within the bordered box
            </p>
          )}
        </div>
      </div>
      <div className='pad-foot'>
        {error && <p className='error' role='alert'>{error}</p>}
        <button type='button' className='clear' onClick={handleClear} disabled={isEmpty}>
          Clear Signature
        </button>
      </div>
    </SignatureWrap>
  )
}

const SignatureWrap = styled.div`
  display:flex;
  flex-direction: column;
  font-family:'Poppins', sans-serif;

  .label {
    margin-bottom:14px;
    font-weight:600;
    font-size:26px;
    line-height:1.2;
    color:#000;

    em {
      margin-left:6px;
      font-style:normal;
    }
  }

  .pad-outer {
    padding:15px;
    border:1px dashed #000;
    border-radius:8px;

    &.invalid {
      border-color:#D93025;
    }
  }

  .pad-inner {
    position:relative;
    height:222px;
    border:1px solid #CFCFCF;
    border-radius:8px;
    background:#fff;
    box-shadow:inset 0 0 12px rgba(0, 0, 0, .04);
    overflow:hidden;

    canvas {
      display:block;
      width:100%;
      height:100%;
      cursor:crosshair;
      /* 터치로 서명할 때 화면이 스크롤되지 않도록 */
      touch-action:none;
    }

    .guide {
      position:absolute;
      inset:0;
      display:flex;
      align-items: center;
      justify-content: center;
      padding-bottom:20px;
      font-size:18px;
      line-height:2;
      text-align:center;
      color:#9A9A9A;
      pointer-events:none;
      user-select:none;
    }
  }

  .pad-foot {
    display:flex;
    align-items: center;
    gap:16px;
    margin-top:8px;

    .error {
      font-size:16px;
      color:#D93025;
    }

    .clear {
      margin-left:auto;
      font-family:inherit;
      font-size:16px;
      color:#B00000;

      &:hover:not(:disabled) {
        text-decoration:underline;
      }

      &:disabled {
        opacity:.5;
        cursor:default;
      }

      &:focus-visible {
        outline:2px solid #0072B9;
        outline-offset:2px;
      }
    }
  }
`
