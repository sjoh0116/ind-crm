import { NavLink } from 'react-router-dom';
import { styled } from 'styled-components';

// Portal 공통 메뉴. path는 '/portal' 기준 상대 경로 ('' = Overview)
export const PORTAL_MENUS = [
  { path: '', label: 'Overview & Services' },
  { path: 'properties', label: 'My Properties' },
  { path: 'calendar', label: 'Monthly Service Calendar' },
  { path: 'slips', label: 'Services Completion Slips' },
  { path: 'invoices', label: 'Invoice & Pay Bill' },
  { path: 'reports', label: 'Reports' },
  { path: 'complaints', label: 'My Complaints' },
];

export default function PortalNav(){
  return (
    <NavWrap aria-label='Portal'>
      <ul>
        {PORTAL_MENUS.map(({ path, label }) => (
          <li key={label}>
            {/* end: Overview('/portal')가 하위 경로에서도 활성으로 잡히지 않도록 */}
            <NavLink to={path ? `/portal/${path}` : '/portal'} end={!path}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </NavWrap>
  )
}

const NavWrap = styled.nav`
  ul {
    display:flex;
    flex-wrap:wrap;
    align-items: center;
    justify-content: center;
    gap:0 10px;
    min-height:69px;
    padding:0 28px;
  }

  a {
    position:relative;
    display:block;
    padding:14px 8px 16px;
    font-weight:600;
    font-size:16px;
    line-height:1.2;
    white-space:nowrap;
    color:#000;
    transition:color .2s;

    &::after {
      content:'';
      position:absolute;
      right:8px;
      bottom:8px;
      left:8px;
      height:2px;
      background:#0072B9;
      transform:scaleX(0);
      transition:transform .2s;
    }

    &:hover {
      color:#0072B9;
    }

    &.active {
      color:#0072B9;

      &::after {
        transform:scaleX(1);
      }
    }

    &:focus-visible {
      outline:2px solid #0072B9;
      outline-offset:2px;
    }
  }
`
