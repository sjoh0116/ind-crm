import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { styled } from 'styled-components';

// 제목 줄 색상. tone: 'blue'(기본) | 'green' | 'red' | 'yellow'
export const MODAL_TONES = {
  blue: { background: '#0072B9', color: '#fff' },
  green: { background: '#1E7B1E', color: '#fff' },
  red: { background: '#C4161C', color: '#fff' },
  yellow: { background: '#F8B62D', color: '#000' },
};

// 색 제목 줄 + 닫기(×) + 본문으로 된 Portal 공용 상자. 화면 안에 그대로 놓을 때 사용
export function PortalPanel({ title, tone = 'blue', onClose, children, ...props }){
  return (
    <PanelWrap $tone={MODAL_TONES[tone] ?? MODAL_TONES.blue} {...props}>
      <div className='panel-head'>
        <h3>{title}</h3>
        {onClose && (
          <button type='button' aria-label='Close' onClick={onClose}>
            <X size={22} strokeWidth={3} aria-hidden='true' />
          </button>
        )}
      </div>
      <div className='panel-body'>{children}</div>
    </PanelWrap>
  )
}

// 같은 상자를 모달로 띄울 때 사용. <dialog>의 showModal()이 포커스 가두기와 Esc 닫기를 처리
export default function PortalModal({ open, title, tone, onClose, width = 560, children }){
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <DialogWrap ref={dialogRef} style={{ width }}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      // 바깥(배경)을 누르면 닫힘
      onClick={(e) => { if (e.target === dialogRef.current) onClose(); }}>
      {open && <PortalPanel title={title} tone={tone} onClose={onClose}>{children}</PortalPanel>}
    </DialogWrap>
  )
}

const PanelWrap = styled.section`
  border:1px solid #333;
  border-radius:10px;
  background:#fff;
  font-family:'Poppins', sans-serif;
  color:#000;
  overflow:hidden;

  .panel-head {
    display:flex;
    align-items: center;
    justify-content: space-between;
    min-height:54px;
    padding:0 22px 0 36px;
    background:${({ $tone }) => $tone.background};
    color:${({ $tone }) => $tone.color};

    h3 {
      font-weight:700;
      font-size:17px;
      line-height:1.3;
    }

    button {
      display:flex;
      border-radius:4px;
      color:inherit;

      &:hover {
        background:rgba(255, 255, 255, .25);
      }

      &:focus-visible {
        outline:2px solid currentColor;
        outline-offset:2px;
      }
    }
  }

  .panel-body {
    max-height:calc((100vh - 120px) / var(--zoom, 1));
    padding:24px 36px 28px;
    overflow-y:auto;
  }
`

const DialogWrap = styled.dialog`
  max-width:calc((100vw - 32px) / var(--zoom, 1));
  max-height:calc((100vh - 32px) / var(--zoom, 1));
  margin:auto;
  padding:0;
  border:0;
  border-radius:10px;
  background:transparent;
  overflow:visible;

  &::backdrop {
    background:rgba(0, 0, 0, .45);
  }
`
