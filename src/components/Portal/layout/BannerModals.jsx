import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { styled } from 'styled-components';

import PortalModal from '@/components/Portal/common/PortalModal.jsx';
import StarRating from '@/components/Portal/common/StarRating.jsx';
import { SERVICE_OPTIONS } from '@/constants/services.js';

// 배너의 세 버튼(Request Additional Services / Give Feedback / Raise Complaint)이 여는 모달
// 폼 상태는 모달 안쪽 컴포넌트가 들고 있어서, 닫았다 다시 열면 초기화됨

const PRIORITY_LEVELS = [
  'Medium Priority',
  'High Priority (Urgent Pest Outbreak)',
  'Low Priority (General)',
];

const FEEDBACK_SECTIONS = [
  {
    key: 'operator',
    label: "Rate Our Operator's Service Quality (1 to 5 Stars):",
    placeholder: 'Comments on Operator behavior, punctuality, cleanness.....',
  },
  {
    key: 'sales',
    label: 'Rate Our Sales Person (1 to 5 Stars):',
    placeholder: 'Share your thoughts, suggestions or any feedback on our sales person.....',
  },
  {
    key: 'company',
    label: 'Overall UST Company Experience:',
    placeholder: 'Feedback on customer support, digital reports, billing....',
  },
];

function FeedbackForm({ onSubmit }){
  const [form, setForm] = useState(
    () => Object.fromEntries(FEEDBACK_SECTIONS.map(({ key }) => [key, { rating: 0, comment: '' }])),
  );

  const update = (key, values) => {
    setForm(prev => ({ ...prev, [key]: { ...prev[key], ...values } }));
  };

  // 별점이나 의견이 하나라도 있어야 제출
  const isEmpty = Object.values(form).every(({ rating, comment }) => !rating && !comment.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEmpty) return;
    onSubmit(form);
  };

  return (
    <ModalForm onSubmit={handleSubmit}>
      {FEEDBACK_SECTIONS.map(({ key, label, placeholder }) => (
        <div className='group' key={key}>
          <span className='label' id={`feedback-${key}`}>{label}</span>
          <StarRating value={form[key].rating} labelledBy={`feedback-${key}`} size={30}
            onChange={(rating) => update(key, { rating })} />
          <textarea rows={2} aria-labelledby={`feedback-${key}`} placeholder={placeholder}
            value={form[key].comment} onChange={(e) => update(key, { comment: e.target.value })} />
        </div>
      ))}
      <SubmitButton type='submit' $tone='green' disabled={isEmpty}>Submit Feedback</SubmitButton>
    </ModalForm>
  )
}

function ComplaintForm({ onSubmit }){
  const [form, setForm] = useState({ subject: '', area: '', priority: PRIORITY_LEVELS[0], description: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <ModalForm onSubmit={handleSubmit}>
      <div className='group'>
        <label className='label' htmlFor='complaintSubject'>Complaint Subject / Issue Type*</label>
        <input id='complaintSubject' name='subject' type='text' required autoFocus
          placeholder='Pest recurring in kitchen / Request immediate revisit'
          value={form.subject} onChange={handleChange} />
      </div>
      <div className='group'>
        <label className='label' htmlFor='complaintArea'>Area</label>
        <input id='complaintArea' name='area' type='text' placeholder='Kitchen Area'
          value={form.area} onChange={handleChange} />
      </div>
      <div className='group'>
        <label className='label' htmlFor='complaintPriority'>Priority Level</label>
        <div className='select'>
          <select id='complaintPriority' name='priority' value={form.priority} onChange={handleChange}>
            {PRIORITY_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
          </select>
          <ChevronDown size={24} strokeWidth={2} aria-hidden='true' />
        </div>
      </div>
      <div className='group'>
        <label className='label' htmlFor='complaintDescription'>Detailed Complaint Description</label>
        <textarea id='complaintDescription' name='description' rows={4}
          placeholder='Describe location, pest type or and other issue.....'
          value={form.description} onChange={handleChange} />
      </div>
      <SubmitButton type='submit' $tone='red'>Submit Complaint</SubmitButton>
    </ModalForm>
  )
}

function ServiceRequestForm({ onSubmit }){
  const [services, setServices] = useState([]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const available = SERVICE_OPTIONS.filter(option => !services.includes(option));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (services.length === 0) {
      setError('Please select at least one service.');
      return;
    }
    onSubmit({ services, notes: notes.trim() });
  };

  return (
    <ModalForm onSubmit={handleSubmit}>
      <div className='group'>
        <label className='label' htmlFor='requestService'>Service*</label>
        <div className='select'>
          {/* 고르면 아래 목록에 추가되고 셀렉트는 다시 안내 문구로 돌아감 */}
          <select id='requestService' className='placeholder' value='' autoFocus
            aria-invalid={error ? 'true' : undefined}
            onChange={(e) => { setServices(prev => [...prev, e.target.value]); setError(''); }}>
            <option value='' disabled>e.g. Pigeon Netting</option>
            {available.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
          <ChevronDown size={24} strokeWidth={2} aria-hidden='true' />
        </div>
        {error && <p className='error' role='alert'>{error}</p>}
        {services.length > 0 && (
          <ul className='chips'>
            {services.map(service => (
              <li key={service}>
                <button type='button' aria-label={`Remove ${service}`}
                  onClick={() => setServices(prev => prev.filter(item => item !== service))}>
                  <X size={12} strokeWidth={3} aria-hidden='true' />
                </button>
                <span>{service}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className='group'>
        <label className='label' htmlFor='requestNotes'>Site Specific Notes / Urgent Target Area</label>
        <textarea id='requestNotes' rows={4} placeholder='e.g. Basement Storage Room'
          value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <SubmitButton type='submit' $tone='yellow'>Submit Service Request</SubmitButton>
    </ModalForm>
  )
}

const MODALS = {
  request: { title: 'Request Additional Pest Service', tone: 'yellow', Form: ServiceRequestForm },
  feedback: { title: 'Service Quality & Operator Feedback', tone: 'green', Form: FeedbackForm },
  complaint: { title: 'Raise Customer Complaint / Ticket', tone: 'red', Form: ComplaintForm },
};

// active: 'request' | 'feedback' | 'complaint' | null
export default function BannerModals({ active, onClose }){
  // type: 'request' | 'feedback' | 'complaint', data: 각 폼의 입력값
  const handleSubmit = () => {
    // TODO: 요청 / 피드백 / 불만 접수 API 연동 (type, data 전달)
    onClose();
  };

  return Object.entries(MODALS).map(([type, { title, tone, Form }]) => (
    <PortalModal key={type} open={active === type} title={title} tone={tone} width={600} onClose={onClose}>
      <Form onSubmit={(data) => handleSubmit(type, data)} />
    </PortalModal>
  ));
}

const SUBMIT_TONES = {
  green: { background: '#1E6B12', color: '#fff' },
  red: { background: '#B80D0D', color: '#fff' },
  yellow: { background: '#D9A032', color: '#000' },
};

const SubmitButton = styled.button`
  display:block;
  min-width:230px;
  height:36px;
  margin:22px auto 0;
  padding:0 24px;
  border-radius:8px;
  background:${({ $tone }) => SUBMIT_TONES[$tone].background};
  box-shadow:inset 0 4px 30px 0 rgba(0, 0, 0, .18);
  font-family:inherit;
  font-weight:700;
  font-size:13px;
  white-space:nowrap;
  color:${({ $tone }) => SUBMIT_TONES[$tone].color};
  transition:filter .2s;

  &:hover:not(:disabled) {
    filter:brightness(1.1);
  }

  &:disabled {
    opacity:.5;
    cursor:not-allowed;
  }

  &:focus-visible {
    outline:2px solid #000;
    outline-offset:2px;
  }
`

const ModalForm = styled.form`
  .group + .group {
    margin-top:16px;
  }

  .label {
    display:block;
    margin-bottom:8px;
    font-weight:700;
    font-size:15px;
    line-height:1.4;
    color:#000;
  }

  input,
  select,
  textarea {
    display:block;
    width:100%;
    border:1px solid #333;
    border-radius:8px;
    background:#fff;
    font-family:inherit;
    font-size:14px;
    /* Poppins의 g, q 꼬리가 입력칸 안에서 잘리지 않도록 줄 높이를 넉넉히 */
    line-height:1.6;
    color:#000;
    outline:none;
    transition:border-color .2s, box-shadow .2s;

    &::placeholder {
      color:#8A8A8A;
    }

    &:focus {
      border-color:#0072B9;
      box-shadow:0 0 0 3px rgba(0, 114, 185, .15);
    }
  }

  input,
  select {
    height:44px;
    padding:0 14px;
  }

  textarea {
    min-height:64px;
    margin-top:8px;
    padding:8px 14px;
    border-color:#BDBDBD;
    border-radius:4px;
    font-size:12px;
    resize:vertical;
  }

  /* 라벨 바로 아래의 큰 입력칸(Complaint / Request)은 입력칸과 같은 모양 */
  .label + textarea {
    min-height:110px;
    margin-top:0;
    border-color:#333;
    border-radius:8px;
    font-size:14px;
  }

  .select {
    position:relative;

    select {
      padding-right:48px;
      appearance:none;
      cursor:pointer;

      &.placeholder {
        color:#8A8A8A;
      }

      option {
        color:#000;
      }
    }

    svg {
      position:absolute;
      top:50%;
      right:14px;
      transform:translateY(-50%);
      color:#000;
      pointer-events:none;
    }
  }

  .chips {
    display:flex;
    flex-wrap:wrap;
    gap:2px 22px;
    margin-top:8px;

    li {
      display:flex;
      align-items: center;
      gap:8px;
      min-height:26px;
      font-weight:500;
      font-size:13px;
      color:#746E6E;
    }

    button {
      display:flex;
      align-items: center;
      justify-content: center;
      width:20px;
      height:20px;
      border-radius:50%;
      color:#746E6E;

      &:hover {
        background:rgba(0, 0, 0, .08);
        color:#000;
      }

      &:focus-visible {
        outline:2px solid #0072B9;
      }
    }
  }

  .error {
    margin-top:6px;
    font-size:12px;
    color:#D7191F;
  }
`
