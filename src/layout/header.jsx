import { styled } from 'styled-components';

export default function Header(){
  return (
    <HeaderWrap>
      <div className='inner'>
        <div className='logo'>
          <img src='https://ust-india.s3.ap-northeast-2.amazonaws.com/crm/ust_logo.webp' alt='ust logo' />
        </div>
        <div className='txt-desc'>
          <strong>Digital Customer Registration Form</strong>
          <p>India’s Most Trusted Pest Control Experts.</p>
        </div>
      </div>
    </HeaderWrap>
  )
}

const HeaderWrap = styled.header`
  position:relative;
  width:100%;
  background:#fff url('https://ust-india.s3.ap-northeast-2.amazonaws.com/crm/header_deco.webp') left -50px top 50% no-repeat;

  .inner {
    display:flex;
    align-items: center;
    justify-content: space-between;
    width:100%;
    height:102px;
    padding:0 5.8% 0 220px;

    .logo img {
      display:block;
      width:auto;
      height:42px;
    }

    .txt-desc {
      display:flex;
      flex-direction: column;
      gap:8px;
      text-align:right;

      strong {
        font-family:'Poppins', sans-serif;
        font-weight:600;
        font-size:24px;
        line-height:1.2;
        color:#0072B9;
      }

      p {
        font-family:'Poppins', sans-serif;
        font-weight:400;
        font-size:16px;
        line-height:1.2;
        color:#000;
      }
    }
  }
`
