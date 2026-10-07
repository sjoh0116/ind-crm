import { useState } from 'react';
import { styled } from 'styled-components';

export const SALES_PERSONS = [];

export function useInfoForm(initialForm){
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return { form, setForm, handleChange };
}

export function Field({ id, label, required, full, area, children }){
  return (
    <div className={`field${full ? ' full' : ''}`} style={area ? { gridArea: area } : undefined}>
      <label htmlFor={id}>
        {label}
        {required && <em aria-hidden='true'>*</em>}
      </label>
      {children}
    </div>
  )
}

export const FormWrap = styled.section`
  width:100%;
  padding:50px 5.9% 60px;
  font-family:'Poppins', sans-serif;

  .grid {
    display:grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap:40px;
    row-gap:30px;
  }

  .field {
    display:flex;
    flex-direction: column;
    gap:14px;

    &.full {
      grid-column:1 / -1;
    }

    > label,
    > .label {
      font-weight:600;
      font-size:26px;
      line-height:1.2;
      color:#000;

      em {
        margin-left:6px;
        font-style:normal;
      }
    }
  }

  input[type='text'],
  input[type='tel'],
  input[type='email'],
  input[type='date'],
  select {
    width:100%;
    height:52px;
    padding:0 14px;
    border:1px solid #333;
    border-radius:8px;
    background-color:#fff;
    font-family:inherit;
    font-size:20px;
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

    &[readonly] {
      background-color:#F5F5F5;
      color:#666;
    }
  }

  select {
    padding-right:56px;
    cursor:pointer;

    &.placeholder {
      color:#8A8A8A;
    }

    option {
      color:#000;
    }
  }

  .check {
    grid-column:1 / -1;
    display:flex;
    align-items: center;
    gap:14px;
    cursor:pointer;

    input {
      appearance:none;
      flex-shrink:0;
      width:30px;
      height:30px;
      border:1px solid #333;
      border-radius:2px;
      background:#fff;
      cursor:pointer;
      transition:background .2s, border-color .2s;

      &:checked {
        border-color:#0072B9;
        background:#0072B9 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='3'%3E%3Cpath d='M5 12l5 5 9-10'/%3E%3C/svg%3E") center / 20px no-repeat;
      }

      &:focus-visible {
        outline:2px solid #0072B9;
        outline-offset:2px;
      }
    }

    span {
      font-weight:500;
      font-size:20px;
      color:#666;
    }
  }
`
