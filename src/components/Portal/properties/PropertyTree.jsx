import { useState } from 'react';
import { Building2, ChevronDown, ChevronRight, Pencil } from 'lucide-react';
import { styled } from 'styled-components';

// 건물 > 층 > 구역 목록. 층을 누르면 구역이 펼쳐짐
// buildings: [{ id, name, floors: [{ id, name, areas: [] }] }]
export default function PropertyTree({ buildings, defaultOpenFloorIds = [], onEditFloor }){
  const [openFloors, setOpenFloors] = useState(() => new Set(defaultOpenFloorIds));

  const toggleFloor = (floorId) => {
    setOpenFloors(prev => {
      const next = new Set(prev);
      if (next.has(floorId)) next.delete(floorId);
      else next.add(floorId);
      return next;
    });
  };

  return (
    <TreeWrap>
      {buildings.map(building => (
        <section key={building.id}>
          <h3>
            <Building2 size={22} strokeWidth={2} aria-hidden='true' />
            {building.name}
          </h3>

          {building.floors.length > 0 ? (
            <ul>
              {building.floors.map(floor => {
                const open = openFloors.has(floor.id);
                return (
                  <li key={floor.id}>
                    <div className='floor'>
                      <button type='button' className='toggle' aria-expanded={open}
                        onClick={() => toggleFloor(floor.id)}>
                        {open
                          ? <ChevronDown size={16} strokeWidth={2.2} aria-hidden='true' />
                          : <ChevronRight size={16} strokeWidth={2.2} aria-hidden='true' />}
                        <span>{floor.name}</span>
                      </button>
                      <button type='button' className='edit' aria-label={`Edit ${floor.name}`}
                        onClick={() => onEditFloor?.(building, floor)}>
                        <Pencil size={14} strokeWidth={2} fill='#0072B9' aria-hidden='true' />
                      </button>
                    </div>
                    {open && (
                      floor.areas.length > 0 ? (
                        <ul className='areas'>
                          {floor.areas.map(area => <li key={area}>{area}</li>)}
                        </ul>
                      ) : <p className='empty'>No areas added yet.</p>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : <p className='empty no-floor'>No floors added yet.</p>}
        </section>
      ))}
    </TreeWrap>
  )
}

const TreeWrap = styled.div`
  border:2px solid #2E96E8;
  background:#fff;

  section + section {
    border-top:1px solid #333;
  }

  h3 {
    display:flex;
    align-items: center;
    gap:16px;
    padding:10px 18px;
    border-bottom:1px solid #333;
    font-weight:700;
    font-size:16px;
    line-height:1.4;
    color:#000;

    svg {
      flex-shrink:0;
      color:#0072B9;
    }
  }

  section > ul {
    padding:10px 24px 14px;
  }

  .floor {
    display:flex;
    align-items: center;
    justify-content: space-between;
    gap:8px;
    min-height:26px;
  }

  .toggle {
    display:flex;
    align-items: center;
    gap:18px;
    min-width:0;
    font-family:inherit;
    font-weight:700;
    font-size:13px;
    line-height:1.4;
    text-align:left;
    color:#000;

    svg {
      flex-shrink:0;
      color:#0072B9;
    }
  }

  .edit {
    display:flex;
    align-items: center;
    justify-content: center;
    flex-shrink:0;
    width:24px;
    height:24px;
    border-radius:4px;
    color:#0072B9;

    &:hover {
      background:rgba(0, 114, 185, .12);
    }
  }

  button:focus-visible {
    outline:2px solid #0072B9;
    outline-offset:2px;
  }

  .areas {
    padding:0 0 6px 60px;

    li {
      font-size:11px;
      line-height:1.9;
      color:#000;
    }
  }

  .empty {
    padding:0 0 6px 60px;
    font-size:11px;
    line-height:1.9;
    color:#9A9A9A;

    &.no-floor {
      padding:12px 24px 14px;
    }
  }
`
