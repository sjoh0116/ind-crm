import { Link } from 'react-router-dom';
import { Bell, Megaphone, Search, UserRound } from 'lucide-react';
import { styled } from 'styled-components';

// Portal 공통 상단 헤더: 로고 + 검색 + 공지/알림/프로필
export default function PortalHeader(){
  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: 검색 연동
  };

  return (
    <HeaderWrap>
      <div className='inner'>
        <Link to='/portal' className='logo'>
          <img src='https://ust-india.s3.ap-northeast-2.amazonaws.com/crm/ust_logo.webp' alt='UST India' />
        </Link>

        <div className='tools'>
          <form className='search' role='search' onSubmit={handleSearch}>
            <input type='search' name='q' placeholder='Search' aria-label='Search' />
            <button type='submit' aria-label='Search'>
              <Search size={26} strokeWidth={2} aria-hidden='true' />
            </button>
          </form>

          {/* TODO: 공지 / 알림 / 프로필 메뉴 연동 */}
          <button type='button' className='icon' aria-label='Announcements'>
            <img src='https://ust-india.s3.ap-northeast-2.amazonaws.com/crm/portal/portal_notice_ic.svg' alt='notice' />
          </button>
          <button type='button' className='icon' aria-label='Notifications'>
            <img src='https://ust-india.s3.ap-northeast-2.amazonaws.com/crm/portal/portal_alram_ic.svg' alt='alram' />
          </button>
          <button type='button' className='profile' aria-label='My profile'>
            <img src='https://ust-india.s3.ap-northeast-2.amazonaws.com/crm/portal/portal_profile_ic.svg' alt='alram' />
          </button>
        </div>
      </div>
    </HeaderWrap>
  )
}

const HeaderWrap = styled.header`
  width:100%;
  background:#fff url('https://ust-india.s3.ap-northeast-2.amazonaws.com/crm/header_deco.webp') left -102px top 50% no-repeat;

  .inner {
    display:flex;
    align-items: center;
    justify-content: space-between;
    height:103px;
    padding:0 46px 0 160px;
  }

  .logo img {
    display:block;
    width:auto;
    height:61px;
  }

  .tools {
    display:flex;
    align-items: center;
    gap:20px;
  }

  .search {
    position:relative;
    width:324px;

    input {
      width:100%;
      height:53px;
      padding:0 52px 0 24px;
      border:1px solid #0072B9;
      border-radius:10px;
      background:rgba(255, 255, 255, .1);
      font-family:inherit;
      font-weight:500;
      font-size:20px;
      line-height:1.6;
      color:#0072B9;
      outline:none;
      transition:box-shadow .2s;

      &::placeholder {
        color:rgba(0, 114, 185, .45);
      }

      &:focus {
        box-shadow:0 0 0 3px rgba(0, 114, 185, .15);
      }

      /* 브라우저 기본 지우기(x) 버튼 숨김 */
      &::-webkit-search-cancel-button {
        appearance:none;
      }
    }

    button {
      position:absolute;
      top:50%;
      right:10px;
      display:flex;
      align-items: center;
      justify-content: center;
      width:36px;
      height:36px;
      border-radius:6px;
      transform:translateY(-50%);
      color:#0072B9;
    }
  }

  .icon,
  .profile {
    display:flex;
    align-items: center;
    justify-content: center;
    width:38px;
    height:38px;
    border-radius:10px;
    color:#0072B9;
    transition:background .2s;

    &:hover {
      background:rgba(0, 114, 185, .1);
    }
  }

  .profile {
    margin:0 14px 0 9px;
    border:1px solid #0072B9;
    background:rgba(217, 217, 217, .47);
  }

  button:focus-visible {
    outline:2px solid #0072B9;
    outline-offset:2px;
  }
`
