import { styled } from 'styled-components';

export default function Register(){
  return (
    <RegisterWrap>
      <div className="inner">
        <div className='logo'>
          <img src='https://ust-india.s3.ap-northeast-2.amazonaws.com/crm/ust_logo_w.webp' alt='UST INDIA' />
        </div>
        <div className='desc'>
          <div className='txt-desc'>
            <strong>India's Most Trusted</strong>
            <span>Pest Control Expert.</span>
          </div>
          <button>New Customer Registration</button>
        </div>
        <div className='help'>
          <ul>
            <li>Change Language</li>
            <li>Get Help</li>
          </ul>
        </div>
      </div>
      <div className='decoration'>
        <img src='https://ust-india.s3.ap-northeast-2.amazonaws.com/crm/crm_people1.webp' alt='ust officer' />
      </div>
    </RegisterWrap>
  )
}

const RegisterWrap = styled.section`
  position:relative;
  width:100vw;
  height:100vh;
  background:url('https://ust-india.s3.ap-northeast-2.amazonaws.com/crm/crm_bg.webp') no-repeat;
  background-size:cover;
  overflow:hidden;
  
  .inner {
    position:relative;
    z-index:1;
    display:flex;
    flex-direction: column;
    height:100%;
    padding:5.2%;
    font-family:'Poppins', sans-serif;

    .logo img {
      display:block;
      max-width:317px;
    }

    .desc {
      flex:1;
      display:flex;
      flex-direction: column;
      justify-content: center;
      gap:30px;

      .txt-desc {
        display:flex;
        flex-direction: column;

        strong, span {
          font-family:'Poppins', sans-serif;
          font-weight:800;
          font-size:64px;
          line-height:1.2;
          letter-spacing:-0.01em;
        }

        strong {
          color:#fff;
        }

        span {
          color:#000;
        } 
      }
      
      button {
        display:block;
        padding:13px 0;
        width:425px;
        background:rgba(255, 255, 255, 0.1);
        border-radius:10px;
        border:1px solid #fff;
        font-family:'Poppins', sans-serif;
        font-weight:400;
        font-size:18px;
        color:#000;
        text-align:center;
        backdrop-filter:blur(4px);
      }
    }
    
    .help {
      position:relative;
      
      ul {
        display:flex;
        align-items: center;
        gap:120px;
        
        li {
          cursor:pointer;
          font-weight:400;
          font-size:18px;
          font-family:'Poppins', serif;
          color:#000;
        }
      }
    }
  }
  
  .decoration {
    position:absolute;
    z-index:0;
    right:0;
    bottom:-10%;
  }
`