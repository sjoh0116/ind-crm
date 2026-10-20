import { useState } from 'react';
import { CirclePlus, Plus } from 'lucide-react';
import { styled } from 'styled-components';

import PropertyTree from '@/components/Portal/properties/PropertyTree.jsx';
import PortalModal from '@/components/Portal/common/PortalModal.jsx';
import { CardButton } from '@/components/Portal/common/PortalCard.jsx';
import { SAMPLE_PROPERTY } from '@/pages/portal/sampleData.js';

const MAX_BUILDINGS_AT_ONCE = 20;

// 'Building 3'처럼 아직 쓰이지 않은 다음 건물 이름들을 count개 만듦
function nextBuildingNames(existingNames, count){
  const used = new Set(existingNames.map(name => name.trim().toLowerCase()));
  const names = [];
  for (let n = 1; names.length < count; n += 1) {
    const name = `Building ${n}`;
    if (!used.has(name.toLowerCase())) {
      names.push(name);
      used.add(name.toLowerCase());
    }
  }
  return names;
}

// Portal > My Properties
export default function PortalProperties(){
  const [buildings, setBuildings] = useState(SAMPLE_PROPERTY.buildings);
  const [addOpen, setAddOpen] = useState(false);
  // Add - Building 모달의 입력 줄들
  const [newNames, setNewNames] = useState(['']);
  const [addError, setAddError] = useState('');

  const existingNames = buildings.map(building => building.name);

  const addBuildings = (names) => {
    // TODO: 건물 추가 API 연동
    const stamp = Date.now();
    const added = names.map(name => ({ id: `b-${stamp}-${name}`, name, floors: [] }));
    setBuildings(prev => [...prev, ...added]);
  };

  const openAddModal = () => {
    setNewNames(['']);
    setAddError('');
    setAddOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    // 비워 둔 줄은 안내 문구에 보이는 기본 이름(Building N)으로 채움
    const defaults = nextBuildingNames([...existingNames, ...newNames], newNames.length);
    const names = newNames.map((name, i) => name.trim().replace(/\s+/g, ' ') || defaults[i]);
    const lower = names.map(name => name.toLowerCase());

    const duplicate = names.find((name, i) => (
      lower.indexOf(name.toLowerCase()) !== i
      || existingNames.some(existing => existing.toLowerCase() === name.toLowerCase())
    ));
    if (duplicate) {
      setAddError(`"${duplicate}" already exists.`);
      return;
    }

    addBuildings(names);
    setAddOpen(false);
  };

  const placeholders = nextBuildingNames([...existingNames, ...newNames], newNames.length);

  return (
    <PropertiesWrap>
      <div className='type-bar'>
        <p>PROPERTY TYPE : <strong>{SAMPLE_PROPERTY.type}</strong></p>
        <div className='bar-actions'>
          <button type='button' onClick={openAddModal}>
            <CirclePlus size={18} strokeWidth={2.5} aria-hidden='true' />
            Add Building
          </button>
          {/* TODO: Add Property Areas 동작(화면/모달) 연동 */}
          <button type='button'>
            <CirclePlus size={18} strokeWidth={2.5} aria-hidden='true' />
            Add Property Areas
          </button>
        </div>
      </div>

      <div className='content'>
        <PropertyTree
          buildings={buildings}
          defaultOpenFloorIds={SAMPLE_PROPERTY.buildings[0].floors.map(floor => floor.id)}
          // TODO: 층 수정 동작 연동
          onEditFloor={() => {}}
        />
      </div>

      <PortalModal open={addOpen} title='Add - Building' onClose={() => setAddOpen(false)}>
        <ModalForm onSubmit={handleAddSubmit}>
          <label htmlFor='newBuilding-0'>New Building</label>
          {newNames.map((name, i) => {
            const isLast = i === newNames.length - 1;
            return (
              <div className='name-row' key={i}>
                <input id={`newBuilding-${i}`} type='text' autoFocus={isLast} autoComplete='off'
                  aria-label={i > 0 ? `New building ${i + 1}` : undefined}
                  placeholder={placeholders[i]}
                  value={name}
                  onChange={(e) => {
                    setNewNames(prev => prev.map((value, index) => (index === i ? e.target.value : value)));
                    setAddError('');
                  }} />
                {isLast && newNames.length < MAX_BUILDINGS_AT_ONCE && (
                  <button type='button' aria-label='Add another building'
                    onClick={() => setNewNames(prev => [...prev, ''])}>
                    <Plus size={22} strokeWidth={2.5} aria-hidden='true' />
                  </button>
                )}
              </div>
            );
          })}
          {addError && <p className='error' role='alert'>{addError}</p>}
          <CardButton type='submit' className='small'>Submit</CardButton>
        </ModalForm>
      </PortalModal>
    </PropertiesWrap>
  )
}

const PropertiesWrap = styled.div`
  padding:16px 46px 80px 58px;

  .type-bar {
    display:flex;
    flex-wrap:wrap;
    align-items: center;
    justify-content: space-between;
    gap:12px 24px;
    min-height:66px;
    padding:10px 24px;
    border:1px solid #333;

    p {
      font-weight:700;
      font-size:14px;
      color:#000;

      strong {
        font-weight:700;
        text-transform:uppercase;
        color:#0072B9;
      }
    }
  }

  .bar-actions {
    display:flex;
    align-items: center;
    gap:16px;

    /* 두 버튼은 같은 크기 */
    button {
      display:flex;
      align-items: center;
      justify-content: center;
      gap:10px;
      min-width:220px;
      height:40px;
      padding:0 20px;
      border-radius:8px;
      font-size:14px;
      background:#0072B9;
      box-shadow:inset 0 4px 40px 0 rgba(0, 0, 0, .2);
      font-family:inherit;
      font-weight:700;
      white-space:nowrap;
      color:#fff;
      transition:filter .2s;

      &:hover {
        filter:brightness(1.1);
      }

      &:focus-visible {
        outline:2px solid #000;
        outline-offset:2px;
      }
    }

  }

  .content {
    max-width:370px;
    margin-top:22px;
  }

`

const ModalForm = styled.form`
  label {
    display:block;
    margin-bottom:12px;
    font-weight:700;
    font-size:17px;
    color:#000;
  }

  .name-row {
    position:relative;

    & + .name-row {
      margin-top:10px;
    }

    input {
      width:100%;
      height:46px;
      padding:0 56px 0 14px;
      border:1px solid #333;
      border-radius:10px;
      background:#fff;
      font-family:inherit;
      font-size:13px;
      line-height:1.6;
      color:#000;
      outline:none;

      &::placeholder {
        color:#746E6E;
      }

      &:focus {
        border-color:#0072B9;
        box-shadow:0 0 0 3px rgba(0, 114, 185, .15);
      }
    }

    button {
      position:absolute;
      top:50%;
      right:12px;
      display:flex;
      align-items: center;
      justify-content: center;
      width:32px;
      height:32px;
      border-radius:6px;
      transform:translateY(-50%);
      color:#000;

      &:hover {
        background:rgba(0, 114, 185, .12);
      }

      &:focus-visible {
        outline:2px solid #0072B9;
      }
    }
  }

  .error {
    margin-top:8px;
    font-size:12px;
    color:#D7191F;
  }

  .small {
    min-width:124px;
    height:34px;
    margin-top:30px;
    font-size:12px;
  }
`
