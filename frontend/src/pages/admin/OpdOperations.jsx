import { useState } from 'react';
import { Link } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import { Kpi, StatusTag } from '../../components/ui';

const ROOMS = [
  { room: 'Room 104', dept: 'General Medicine', doctor: 'Dr. R. Sharma', inChamber: 'A-127', waiting: 24, avg: '6 min', status: 'Live' },
  { room: 'Room 201', dept: 'Orthopedics', doctor: 'Dr. S. Iyer', inChamber: 'B-088', waiting: 17, avg: '8 min', status: 'Live' },
  { room: 'Room 112', dept: 'Pediatrics', doctor: 'Dr. N. Rao', inChamber: 'C-041', waiting: 11, avg: '5 min', status: 'Paused' },
];

export default function OpdOperations() {
  const [intakeOpen, setIntakeOpen] = useState(true);
  const [paused, setPaused] = useState(false);
  const [rooms, setRooms] = useState(ROOMS);
  const toggleRoom = (room) => setRooms(r => r.map(x => x.room === room ? { ...x, status: x.status === 'Live' ? 'Paused' : 'Live' } : x));
  return (
    <StaffShell role="admin" title="OPD Operations" subtitle="Room-wise load · session controls · dispatch">
      <div className="card" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <StatusTag kind={intakeOpen ? 'info' : 'warn'}>{intakeOpen ? 'Intake OPEN' : 'Intake CLOSED'}</StatusTag>
        <StatusTag kind={paused ? 'warn' : 'info'}>{paused ? 'Sessions PAUSED' : 'Sessions LIVE'}</StatusTag>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-blue btn-sm" onClick={() => setIntakeOpen(v => !v)}>{intakeOpen ? 'Close Intake' : 'Open Intake'}</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setPaused(v => !v)}>{paused ? 'Resume All' : 'Pause All'}</button>
        </span>
      </div>
      <div className="kpi-row" style={{ marginTop: 12 }}>
        <Kpi v="52" l="In Waiting" sub="3 rooms" /><Kpi v="3" l="In Chamber" sub="now serving" /><Kpi v="6.3m" l="Avg Consult" sub="today" /><Kpi v="96%" l="SLA Met" sub="P2 < 30 min" />
      </div>
      <div className="card" style={{ marginTop: 12 }}>
        <h3 style={{ marginTop: 0 }}>Room-wise Load</h3>
        <div className="table-wrap"><table className="tbl">
          <thead><tr><th>Room</th><th>Doctor</th><th>In Chamber</th><th>Waiting</th><th>Avg</th><th>Status</th><th></th></tr></thead>
          <tbody>{rooms.map(r => (
            <tr key={r.room}><td><strong>{r.room}</strong><br /><span className="small muted">{r.dept}</span></td>
              <td>{r.doctor}</td><td>{r.inChamber}</td><td>{r.waiting}</td><td>{r.avg}</td>
              <td><StatusTag kind={r.status === 'Live' ? 'info' : 'warn'}>{r.status}</StatusTag></td>
              <td style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => toggleRoom(r.room)}>{r.status === 'Live' ? 'Pause' : 'Resume'}</button>
                <Link className="btn btn-blue btn-sm" to="/doctor/queue">Dispatch</Link>
              </td></tr>
          ))}</tbody></table></div>
      </div>
    </StaffShell>
  );
}
