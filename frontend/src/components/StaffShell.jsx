import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { STAFF_LINKS, STAFF_PROFILES } from '../data/mock';
import { MOCK_RED_FLAGS, MOCK_OCR_STACK } from '../data/doctorMock';
import { getQueue, getCalledToken, subscribeQueue, subscribeCalled } from '../data/queueStore';
import BrandLogo from './BrandLogo';

const READ_KEY = 'medikiosk_notif_read_v1';

function loadRead() {
  try {
    const raw = localStorage.getItem(READ_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

function buildNotifications(role, queue, called) {
  const items = [];
  const caseLink = (tokenNo) =>
    role === 'nurse' ? `/triage/assessment/${tokenNo}` : `/doctor/case/${tokenNo}`;
  const queueLink = role === 'nurse' ? '/triage/queue' : role === 'admin' ? '/admin/opd' : '/doctor/queue';
  const alertsLink = role === 'nurse' ? '/triage/alerts' : role === 'admin' ? '/admin/alerts' : '/doctor/alerts';

  if (called?.tokenNo) {
    items.push({
      id: `called-${called.tokenNo}`,
      level: 'info',
      icon: '📢',
      title: `Now calling ${called.tokenNo} — ${called.name || ''}`.trim(),
      sub: `Please proceed to ${called.room || 'Room 104'}`,
      time: 'now',
      to: queueLink,
    });
  }

  const p1s = (queue || []).filter((t) => t.priority === 'P1');
  const seen = new Set();
  [...MOCK_RED_FLAGS, ...p1s.map((t) => ({
    id: t.tokenNo, tokenNo: t.tokenNo, patientName: t.name,
    reason: t.complaint || 'Emergency symptoms detected', severity: 'STAT', priority: 'P1',
  }))].forEach((f) => {
    const key = `rf-${f.tokenNo}`;
    if (seen.has(key)) return;
    seen.add(key);
    items.push({
      id: key,
      level: f.priority === 'P2' ? 'P2' : 'P1',
      icon: f.priority === 'P2' ? '⚠️' : '🚨',
      title: `${f.tokenNo} · ${f.patientName || f.name || 'Patient'} — ${f.severity || 'STAT'}`,
      sub: f.reason || f.message || '',
      time: 'STAT',
      to: caseLink(f.tokenNo),
    });
  });

  const waiting = (queue || []).filter((t) => t.status === 'waiting');
  if (waiting.length >= 4) {
    items.push({
      id: 'queue-pressure',
      level: 'info',
      icon: '👥',
      title: `${waiting.length} waiting · est ~${waiting.length * 6} min`,
      sub: 'OPD queue building — consider second chamber',
      time: 'live',
      to: queueLink,
    });
  }

  const pending = MOCK_OCR_STACK.filter((d) => d.status !== 'complete');
  if (pending.length && role !== 'admin') {
    items.push({
      id: 'ocr-pending',
      level: 'info',
      icon: '📄',
      title: `${pending.length} documents in OCR stack`,
      sub: pending.map((d) => d.fileName).join(' · '),
      time: 'live',
      to: '/doctor/documents',
    });
  }

  if (role === 'nurse') {
    items.push({
      id: 'vitals-a129',
      level: 'P2',
      icon: '⚠️',
      title: 'Vitals breach · A-129 glucose HI',
      sub: 'Recheck glucometer · inform MD',
      time: '8m',
      to: '/triage/vitals/A-129',
    });
  }

  const rank = { P1: 0, P2: 1, info: 2 };
  void alertsLink;
  return items.sort((a, b) => (rank[a.level] ?? 9) - (rank[b.level] ?? 9)).slice(0, 7);
}

function initials(name = '') {
  return name
    .replace(/^(Dr\.|Sr\.)\s*/i, '')
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || '•';
}

export default function StaffShell({ children, role = 'doctor', title, subtitle, actions }) {
  const { state, patch } = useApp();
  const nav = useNavigate();
  const links = STAFF_LINKS[role] || STAFF_LINKS.doctor;
  const fallback = STAFF_PROFILES[role] || STAFF_PROFILES.doctor;
  // Logged-in staff (from StaffLogin) merged over role defaults so details always show.
  const profile = { ...fallback, ...(state.staff || {}) };
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [queue, setQueue] = useState(() => getQueue());
  const [called, setCalled] = useState(() => getCalledToken());
  const [readIds, setReadIds] = useState(loadRead);
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const offQ = subscribeQueue((list) => setQueue(list || []));
    const offC = subscribeCalled((c) => setCalled(c));
    return () => { offQ(); offC(); };
  }, []);

  const notifs = useMemo(() => buildNotifications(role, queue, called), [role, queue, called]);
  const unread = notifs.filter((n) => !readIds.includes(n.id));

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return (queue || [])
      .filter((t) =>
        `${t.tokenNo || ''} ${t.name || ''} ${t.complaint || t.chiefComplaint || ''} ${t.priority || ''} ${t.status || ''} ${t.age || ''}`
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 7);
  }, [queue, query]);

  const goToResult = (tokenNo) => {
    setQuery('');
    setSearchOpen(false);
    if (!tokenNo) return;
    if (role === 'nurse') nav(`/triage/assessment/${tokenNo}`);
    else nav(`/doctor/case/${tokenNo}`);
  };
  const alertsLink = role === 'nurse' ? '/triage/alerts' : role === 'admin' ? '/admin/alerts' : '/doctor/alerts';

  const markOne = (id) => {
    setReadIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try { localStorage.setItem(READ_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };
  const markAll = () => {
    const all = notifs.map((n) => n.id);
    setReadIds(all);
    try { localStorage.setItem(READ_KEY, JSON.stringify(all)); } catch { /* ignore */ }
  };

  useEffect(() => {
    if (!open && !notifOpen && !searchOpen) return;
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); setNotifOpen(false); setSearchOpen(false); }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, notifOpen, searchOpen]);

  useEffect(() => {
    const onShortcut = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', onShortcut);
    return () => document.removeEventListener('keydown', onShortcut);
  }, []);

  const logout = () => { patch({ staff: null }); nav('/staff/login'); };
  return (
    <div className="staff-layout">
      <aside className="sidebar">
        <div className="brand">
            <BrandLogo size={20} />
            <div className="sub small" style={{ opacity: .75 }}>{role === 'doctor' ? 'Doctor Portal' : role === 'nurse' ? 'Nurse Portal · Triage' : 'Enterprise Ops'}</div>
        </div>
        <nav>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => 'side-link' + (isActive ? ' active' : '')}>
              <span>{l.icon}</span><span className="label">{l.label}</span>
            </NavLink>
          ))}
          <Link to="/" className="side-link"><span>🏠</span><span className="label">Kiosk Welcome</span></Link>
          <button onClick={logout} className="side-link" style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}><span>⎋</span><span className="label">Logout / Handover</span></button>
        </nav>
        <div className="doc-card"><div style={{ fontWeight: 700 }}>{profile.name}</div><div style={{ opacity: .8 }}>{profile.department} · {profile.room} · {profile.hospital}</div><div className="small" style={{ marginTop: 6 }}>🟢 {profile.status} · ABDM Sync Live</div></div>
      </aside>
      <div className="staff-main">
        <div className="topbar">
          <div className="search" ref={searchRef} style={{ position: 'relative' }}>
            <input
              ref={searchInputRef}
              className="input staff"
              placeholder="Search — token, patient, UHID…  (⌘K)"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(e) => { if (e.key === 'Enter' && searchResults.length) goToResult(searchResults[0].tokenNo); }}
            />
            {searchOpen && query.trim() && (
              <div className="search-menu">
                {searchResults.length === 0 && (
                  <div className="small muted" style={{ padding: '10px 12px' }}>No matches for “{query.trim()}”.</div>
                )}
                {searchResults.map((t) => (
                  <button
                    key={t.tokenNo}
                    type="button"
                    className="search-item"
                    onClick={() => goToResult(t.tokenNo)}
                  >
                    <span style={{ minWidth: 0, flex: 1 }}>
                      <span style={{ fontWeight: 800 }}>{t.tokenNo}</span>
                      <span> · {t.name}</span>
                      <span className="small muted search-sub">{t.complaint || t.chiefComplaint || t.status || ''}</span>
                    </span>
                    <span className={`tag ${t.priority === 'P1' ? 'tag-p1' : t.priority === 'P2' ? 'tag-p2' : 'tag-neutral'}`} style={{ flexShrink: 0 }}>{t.priority || t.status || ''}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="tag tag-info">ABDM v2 Sync</span>
          <span className="tag tag-neutral">AIIMS New Delhi</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center', position: 'relative' }} className="no-print">
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                type="button"
                className="notif-btn"
                onClick={() => { setNotifOpen((o) => !o); setOpen(false); }}
                aria-haspopup="menu"
                aria-expanded={notifOpen}
                title="Notifications"
              >
                <span aria-hidden>🔔</span>
                {unread.length > 0 && (
                  <span className="notif-badge">{unread.length > 9 ? '9+' : unread.length}</span>
                )}
              </button>
              {notifOpen && (
                <div className="notif-menu" role="menu" aria-label="Notifications">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong>Notifications</strong>
                    <span className="small muted">{unread.length} unread</span>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ marginLeft: 'auto' }}
                      onClick={markAll}
                      disabled={!unread.length}
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="notif-list">
                    {notifs.map((n) => {
                      const isRead = readIds.includes(n.id);
                      return (
                        <button
                          key={n.id}
                          type="button"
                          className={'notif-item' + (isRead ? ' read' : '') + (n.level === 'P1' ? ' flag-p1' : n.level === 'P2' ? ' flag-p2' : '')}
                          onClick={() => { markOne(n.id); setNotifOpen(false); nav(n.to); }}
                        >
                          <span className="notif-icon" aria-hidden>{n.icon}</span>
                          <span style={{ minWidth: 0, flex: 1 }}>
                            <span className="notif-title">{!isRead && <i className="notif-dot" />} {n.title}</span>
                            {n.sub && <span className="small muted notif-sub">{n.sub}</span>}
                          </span>
                          <span className="small muted" style={{ flexShrink: 0 }}>{n.time}</span>
                        </button>
                      );
                    })}
                    {!notifs.length && <div className="notice small">No notifications. 🎉</div>}
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-block"
                    onClick={() => { setNotifOpen(false); nav(alertsLink); }}
                  >
                    View all alerts →
                  </button>
                </div>
              )}
            </div>
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button
                type="button"
                className="avatar"
                style={{ width: 36, height: 36, border: 'none', cursor: 'pointer', fontSize: 13 }}
                onClick={() => { setOpen((o) => !o); setNotifOpen(false); }}
                aria-haspopup="menu"
                aria-expanded={open}
                title={`${profile.name} — view profile`}
              >
                {initials(profile.name)}
              </button>
              {open && (
                <div className="profile-menu" role="menu" aria-label={`${profile.roleLabel} profile`}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div className="avatar" style={{ width: 44, height: 44 }}>{initials(profile.name)}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 800 }}>{profile.name}</div>
                      <div className="small muted">{profile.roleLabel} · {profile.staffId}</div>
                    </div>
                  </div>
                  <div className="profile-rows">
                    <div><span>Department</span><strong>{profile.department}</strong></div>
                    <div><span>Location</span><strong>{profile.room} · {profile.hospital}</strong></div>
                    <div><span>Qualification</span><strong>{profile.qualification}</strong></div>
                    <div><span>Experience</span><strong>{profile.experience}</strong></div>
                    <div><span>Shift</span><strong>{profile.shift}</strong></div>
                    <div><span>Phone</span><strong>{profile.phone}</strong></div>
                    <div><span>Email</span><strong style={{ overflowWrap: 'anywhere' }}>{profile.email}</strong></div>
                    <div><span>Status</span><strong>🟢 {profile.status}</strong></div>
                  </div>
                  <button className="btn btn-ghost btn-sm btn-block" onClick={logout}>Logout / Handover</button>
                </div>
              )}
            </div>
            {actions}
          </div>
        </div>
        <div className="staff-body">
          {(title || subtitle) && (
            <div className="doc-head">
              <div><h2>{title}</h2>{subtitle && <div className="muted">{subtitle}</div>}</div>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
