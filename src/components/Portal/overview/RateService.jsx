import { useState } from 'react';
import { ArrowLeft, Check, Star } from 'lucide-react';
import { styled } from 'styled-components';

import PortalCard, { CardButton } from '@/components/Portal/common/PortalCard.jsx';
import StarRating from '@/components/Portal/common/StarRating.jsx';

const STARS = [1, 2, 3, 4, 5];

// 서비스 평가: 별점 + 의견 입력 → Submit 하면 감사 화면으로 전환
export default function RateService({ onSubmit }){
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) return;
    // TODO: 평가 저장 API 연동
    onSubmit?.({ rating, comment: comment.trim() });
    setSubmitted(true);
  };

  const handleBack = () => {
    setRating(0);
    setComment('');
    setSubmitted(false);
  };

  return (
    <RateWrap title='RATE OUR SERVICE'>
      {submitted ? (
        <div className='panel thanks' role='status'>
          <span className='check'>
            <Check size={30} strokeWidth={2.5} aria-hidden='true' />
          </span>
          <h4>Thank you for your feedback!</h4>
          <p>
            Your {rating}-star rating has been submitted successfully. Your feedback helps us improve every
            service visit.
          </p>
          <div className='result'>
            <span className='stars' aria-hidden='true'>
              {STARS.map(star => (
                <Star key={star} size={22} strokeWidth={1.5}
                  className={star <= rating ? 'on' : ''} fill={star <= rating ? '#F5A623' : 'none'} />
              ))}
            </span>
            <span>{rating.toFixed(1)} submitted</span>
          </div>
          <CardButton type='button' onClick={handleBack}>
            <ArrowLeft size={18} strokeWidth={2.5} aria-hidden='true' />
            Back to Overview
          </CardButton>
        </div>
      ) : (
        <form className='panel' onSubmit={handleSubmit}>
          <h4 id='rateQuestion'>How would you rate our Service?</h4>
          <StarRating value={rating} onChange={setRating} labelledBy='rateQuestion' />
          <textarea rows={4} aria-label='Feedback'
            placeholder='Share your thoughts suggestions or any feedback....'
            value={comment} onChange={(e) => setComment(e.target.value)} />
          <CardButton type='submit' className='submit' disabled={!rating}>Submit</CardButton>
        </form>
      )}
    </RateWrap>
  )
}

const RateWrap = styled(PortalCard)`
  padding:6px 25px 22px 45px;

  .panel {
    margin-top:6px;
    padding:8px 13px 16px;
    border:1px solid #9FB8CC;
    border-radius:8px;
    background:#F1F7FC;

    h4 {
      font-weight:700;
      font-size:16px;
      line-height:1.6;
      color:#0072B9;
    }
  }

  .stars {
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
  }

  form [role='radiogroup'] {
    margin-top:6px;
  }

  textarea {
    display:block;
    width:100%;
    min-height:103px;
    margin-top:12px;
    padding:6px 10px;
    border:1px solid #BDBDBD;
    border-radius:4px;
    background:#fff;
    font-family:inherit;
    font-size:12px;
    line-height:1.6;
    color:#000;
    outline:none;
    resize:vertical;

    &::placeholder {
      color:#9A9A9A;
    }

    &:focus {
      border-color:#0072B9;
      box-shadow:0 0 0 3px rgba(0, 114, 185, .15);
    }
  }

  .submit {
    width:100%;
    height:31px;
    margin-top:26px;
  }

  .thanks {
    display:flex;
    flex-direction: column;
    align-items: center;
    padding:24px 40px 26px;
    text-align:center;

    .check {
      display:flex;
      align-items: center;
      justify-content: center;
      width:58px;
      height:58px;
      border-radius:50%;
      background:#0072B9;
      color:#fff;
    }

    h4 {
      margin-top:14px;
      font-size:22px;
    }

    p {
      max-width:520px;
      margin-top:6px;
      font-size:14px;
      line-height:1.6;
      color:#000;
    }

    .result {
      display:flex;
      align-items: center;
      gap:10px;
      margin-top:12px;
      font-size:11px;
      color:#333;

      .stars {
        gap:4px;
        color:#BDBDBD;
      }
    }
  }
`
