import { styled } from 'styled-components';

import ReportCard from '@/components/Portal/reports/ReportCard.jsx';

// 쥐덫(Rodent Box)과 포충기(Flies Catcher Machine) 점검 현황
// devices: { rodentBox: { installed, gluePadChanged, checked, alerts }, flyCatcher: { installed, boardChanged, checked, alerts } }
export default function DeviceUpdates({ period, devices }){
  const { rodentBox, flyCatcher } = devices;
  const groups = [
    {
      title: `Rodent Box : ${rodentBox.installed} Boxes Installed`,
      lines: [`Glue Pad Change : ${rodentBox.gluePadChanged}`, `Checked and Clean Box : ${rodentBox.checked}`],
      alerts: rodentBox.alerts,
    },
    {
      title: `Flies Catcher Machine : ${flyCatcher.installed} Installed`,
      lines: [`Fly Catcher Control board Change : ${flyCatcher.boardChanged}`, `Checked and Clean Control board : ${flyCatcher.checked}`],
      alerts: flyCatcher.alerts,
    },
  ];

  return (
    <ReportCard title={`Rodent Box and Flies Catcher Machine Updates ${period}`}>
      <DevicesWrap>
        {groups.map(({ title, lines, alerts }) => (
          <div className='group' key={title}>
            <h5>{title}</h5>
            {lines.map(line => <p key={line}>{line}</p>)}
            {alerts.map(alert => <p key={alert} className='alert'>Alert : {alert}</p>)}
          </div>
        ))}
      </DevicesWrap>
    </ReportCard>
  )
}

const DevicesWrap = styled.div`
  padding:0 26px 0 24px;

  .group {
    margin-top:28px;

    & + .group {
      margin-top:34px;
    }
  }

  h5 {
    font-weight:700;
    font-size:17px;
    line-height:1.5;
    color:#000;
  }

  p {
    margin-top:12px;
    font-size:17px;
    line-height:1.5;
    color:#000;
  }

  .alert {
    margin-top:20px;
    padding:4px 12px;
    border:1px solid #C4161C;
    border-radius:8px;
    background:#FDEFEF;
    font-size:16px;
    text-align:center;
    color:#C4161C;
  }
`
