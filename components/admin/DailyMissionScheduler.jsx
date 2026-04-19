"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Download, Upload, Plus, Trash2, CheckCircle, AlertCircle,
  ChevronDown, X, Zap
} from "lucide-react";

/* ── Reusable custom dropdown with inline "+ Add custom" at bottom ── */
function CustomSelect({ value, options, onChange, disabled, placeholder }) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newVal, setNewVal] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setAdding(false); setNewVal(''); } };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => o.value === value);
  const displayLabel = selected ? selected.label : (value || placeholder || 'Select...');

  const commitAdd = () => {
    if (!newVal.trim()) { setAdding(false); return; }
    const v = newVal.trim().toLowerCase().replace(/\s+/g, '_');
    onChange({ value: v, label: newVal.trim(), isCustom: true });
    setNewVal(''); setAdding(false); setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => !disabled && setOpen(o => !o)} disabled={disabled}
        style={{ width: '100%', padding: '7px 28px 7px 9px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)', fontSize: '12px', background: disabled ? '#f8fafc' : '#fff', cursor: disabled ? 'default' : 'pointer', textAlign: 'left', fontFamily: 'inherit', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#0f172a' }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayLabel}</span>
        <ChevronDown size={12} style={{ position: 'absolute', right: '8px', top: '50%', transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`, color: '#94a3b8', transition: 'transform 0.15s', flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, minWidth: '100%', background: '#fff', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 999, overflow: 'hidden', maxHeight: '240px', overflowY: 'auto' }}>
          {options.map(o => (
            <button key={o.value} onClick={() => { onChange(o); setOpen(false); }}
              style={{ display: 'block', width: '100%', padding: '8px 12px', background: o.value === value ? '#eef2ff' : 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', textAlign: 'left', color: o.value === value ? '#6366f1' : '#0f172a', fontWeight: o.value === value ? '700' : '400' }}>
              {o.label}
            </button>
          ))}
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', padding: '6px 8px' }}>
            {adding ? (
              <div style={{ display: 'flex', gap: '4px' }}>
                <input autoFocus value={newVal} onChange={e => setNewVal(e.target.value)}
                  placeholder="Custom value..."
                  onKeyDown={e => { if (e.key === 'Enter') commitAdd(); if (e.key === 'Escape') { setAdding(false); setNewVal(''); } }}
                  style={{ flex: 1, padding: '5px 8px', borderRadius: '6px', border: '1.5px solid #6366f1', fontSize: '11px', outline: 'none' }} />
                <button onClick={commitAdd} style={{ padding: '5px 10px', borderRadius: '6px', background: '#6366f1', color: '#fff', border: 'none', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>Add</button>
                <button onClick={() => { setAdding(false); setNewVal(''); }} style={{ padding: '5px 7px', borderRadius: '6px', background: '#f1f5f9', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={10} /></button>
              </div>
            ) : (
              <button onClick={() => setAdding(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 8px', borderRadius: '6px', border: '1.5px dashed rgba(99,102,241,0.35)', background: 'transparent', cursor: 'pointer', fontSize: '11px', fontWeight: '700', color: '#6366f1', width: '100%' }}>
                <Plus size={11} /> Add custom
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Daily Missions = user CREATES content. No target URL ever needed. ── */
const CSV_HEADERS = [
  'scheduled_date',  // YYYY-MM-DD  e.g. 2026-04-01
  'platform',        // youtube | instagram | twitter | tiktok | facebook | linkedin | medium | coinmarketcap
  'action',          // create_short | create_reel | create_post | create_video | create_thread | story_mention | review
  'title',           // Mission title shown to user
  'brief',           // What to create, hashtags to use, style requirements, etc.
  'points',          // Number e.g. 100
  'max_completions', // Usually 1
];

const PLATFORMS = ['youtube','instagram','twitter','tiktok','facebook','linkedin','medium','coinmarketcap'];
const ACTIONS = [
  { value: 'create_short',   label: 'Create a Short',         points: 100 },
  { value: 'create_reel',    label: 'Create a Reel',          points: 100 },
  { value: 'create_post',    label: 'Create a Post',          points: 75  },
  { value: 'create_video',   label: 'Create a Video (3min+)', points: 150 },
  { value: 'create_thread',  label: 'Create a Thread',        points: 75  },
  { value: 'story_mention',  label: 'Post a Story / Mention', points: 75  },
  { value: 'review',         label: 'Write a Review',         points: 100 },
];

const EMPTY_ROW = () => ({
  _id: Math.random().toString(36).slice(2),
  scheduled_date: '',
  platform: 'youtube',
  action: 'create_short',
  title: '',
  brief: '',
  points: 100,
  max_completions: 1,
  _status: 'draft',
  _error: '',
});

const inputStyle = {
  width: '100%', padding: '7px 9px', borderRadius: '8px',
  border: '1px solid rgba(0,0,0,0.08)', fontSize: '12px', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit', background: '#fff',
};

/* ── parse CSV text into rows ── */
function parseCSV(text) {
  const lines = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[^a-z_]/g, ''));
  return lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i] || ''; });
    const action = ACTIONS.find(a => a.value === obj.action) || ACTIONS[0];
    return {
      _id: Math.random().toString(36).slice(2),
      scheduled_date: obj.scheduled_date || '',
      platform: PLATFORMS.includes(obj.platform) ? obj.platform : 'youtube',
      action: action.value,
      title: obj.title || '',
      brief: obj.brief || '',
      points: parseInt(obj.points) || action.points,
      max_completions: parseInt(obj.max_completions) || 1,
      _status: 'draft',
      _error: '',
    };
  });
}

export default function DailyMissionScheduler() {
  const [rows, setRows]           = useState([EMPTY_ROW()]);
  const [saving, setSaving]       = useState(false);
  const [globalMsg, setGlobalMsg] = useState({ type: '', text: '' });
  const [dragOver, setDragOver]   = useState(false);
  const [extraPlatforms, setExtraPlatforms] = useState([]);
  const [extraActions, setExtraActions]     = useState([]);
  const fileRef = useRef(null);

  const userEmail = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('dagarmy_user') || '{}').email : '';

  /* ── helpers ── */
  const updateRow = useCallback((id, field, value) => {
    setRows(rs => rs.map(r => r._id === id ? { ...r, [field]: value, _status: 'draft', _error: '' } : r));
  }, []);

  const addRow = () => setRows(rs => [...rs, EMPTY_ROW()]);
  const deleteRow = (id) => setRows(rs => rs.filter(r => r._id !== id));
  const clearAll  = () => setRows([EMPTY_ROW()]);

  /* ── sample CSV download ── */
  const downloadSample = () => {
    const sample = [
      CSV_HEADERS.join(','),
      '2026-04-01,youtube,create_short,Create a DAGChain YouTube Short,"Create a 30-60s Short introducing DAGChain. Mention the launch. Use #DAGChain #Web3 #Crypto",100,1',
      '2026-04-02,instagram,create_reel,Create an Instagram Reel,"Post a Reel about the DAG ARMY mission. Tag @dagchain_official. Min 15 seconds.",100,1',
      '2026-04-03,twitter,create_thread,Post a Thread on Twitter/X,"Write a thread (min 5 tweets) explaining what DAGChain does. Use #DAGChain",75,1',
      '2026-04-04,instagram,story_mention,Post a Story Mentioning DAGChain,"Share a story and mention @dagchain_official. Show your DAG ARMY card.",75,1',
      '2026-04-05,youtube,create_video,Create a YouTube Video (3 min+),"Create a video explaining DAG node staking. Min 3 minutes. Use #DAGChain in title.",150,1',
    ].join('\n');
    const blob = new Blob([sample], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'daily_missions_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  /* ── CSV / Excel upload ── */
  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = parseCSV(e.target.result);
        if (parsed.length === 0) {
          setGlobalMsg({ type: 'error', text: 'No valid rows found. Check your CSV format matches the template.' });
          return;
        }
        setRows(parsed);
        setGlobalMsg({ type: 'success', text: `Loaded ${parsed.length} missions from file. Review and publish below.` });
      } catch (err) {
        setGlobalMsg({ type: 'error', text: 'Could not parse file: ' + err.message });
      }
    };
    reader.readAsText(file);
  };

  const onFileChange = (e) => { handleFile(e.target.files[0]); e.target.value = ''; };
  const onDrop       = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); };

  /* ── validate a row ── */
  const validateRow = (r) => {
    if (!r.scheduled_date) return 'Date required';
    if (!r.title.trim())   return 'Title required';
    if (!r.platform)       return 'Platform required';
    if (!r.action)         return 'Action required';
    if (!r.points || r.points < 1) return 'Points must be > 0';
    return null;
  };

  /* ── publish all draft rows via bulk endpoint ── */
  const publishAll = async () => {
    const draftRows = rows.filter(r => r._status !== 'saved');
    const validated = rows.map(r =>
      r._status === 'saved' ? r : { ...r, _error: validateRow(r) || '' }
    );
    const hasErrors = validated.some(r => r._error);
    setRows(validated);
    if (hasErrors) {
      setGlobalMsg({ type: 'error', text: 'Fix validation errors before scheduling.' });
      return;
    }
    setSaving(true);
    setGlobalMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/social-tasks/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: userEmail,
          missions: draftRows.map(r => ({
            platform:                 r.platform,
            task_type:                r.action,
            title:                    r.title.trim(),
            description:              r.brief.trim() || null,
            points:                   parseInt(r.points),
            max_completions_per_user: parseInt(r.max_completions) || 1,
            scheduled_date:           r.scheduled_date,
          })),
        }),
      });
      const data = await res.json();

      if (data.success) {
        setRows(rs => rs.map(r =>
          r._status === 'saved' ? r : { ...r, _status: 'saved', _error: '' }
        ));
        setGlobalMsg({ type: 'success', text: `${data.created} daily mission${data.created !== 1 ? 's' : ''} scheduled successfully!` });
      } else {
        setGlobalMsg({ type: 'error', text: data.error || 'Scheduling failed' });
      }
    } catch (err) {
      setGlobalMsg({ type: 'error', text: err.message });
    }
    setSaving(false);
  };

  const draftCount = rows.filter(r => r._status === 'draft').length;
  const savedCount = rows.filter(r => r._status === 'saved').length;

  return (
    <div style={{ padding: '0' }}>

      {/* ── Top bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 3px' }}>Daily Mission Scheduler</h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
            Schedule daily missions in bulk - upload a CSV or fill rows manually. Each mission activates on its scheduled date.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={downloadSample}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1.5px solid rgba(99,102,241,0.3)', background: '#eef2ff', color: '#6366f1', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s' }}>
            <Download size={14} /> Download Template
          </button>
          <button onClick={() => fileRef.current?.click()}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1.5px solid rgba(0,0,0,0.08)', background: '#fff', color: '#0f172a', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s' }}>
            <Upload size={14} /> Upload CSV
          </button>
          <input ref={fileRef} type="file" accept=".csv,.txt" style={{ display: 'none' }} onChange={onFileChange} />
        </div>
      </div>

      {/* ── Drag-drop zone ── */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={{ border: `2px dashed ${dragOver ? '#6366f1' : 'rgba(0,0,0,0.10)'}`, borderRadius: '14px', padding: '18px', textAlign: 'center', background: dragOver ? '#eef2ff' : '#fafbfc', marginBottom: '20px', transition: 'all 0.2s', cursor: 'pointer' }}
        onClick={() => fileRef.current?.click()}>
        <Upload size={20} style={{ color: dragOver ? '#6366f1' : '#cbd5e1', margin: '0 auto 6px', display: 'block' }} />
        <p style={{ fontSize: '12px', color: dragOver ? '#6366f1' : '#94a3b8', margin: 0, fontWeight: '600' }}>
          Drag & drop CSV here, or click to browse
        </p>
        <p style={{ fontSize: '11px', color: '#cbd5e1', margin: '4px 0 0' }}>
          Use the template above - headers: {CSV_HEADERS.join(', ')}
        </p>
      </div>

      {/* ── Global message ── */}
      {globalMsg.text && (
        <div style={{ marginBottom: '16px', padding: '10px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: globalMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
          color: globalMsg.type === 'success' ? '#15803d' : '#dc2626',
          border: `1px solid ${globalMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}` }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {globalMsg.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            {globalMsg.text}
          </span>
          <button onClick={() => setGlobalMsg({ type: '', text: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}><X size={13} /></button>
        </div>
      )}

      {/* ── Stats bar ── */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>{rows.length} row{rows.length !== 1 ? 's' : ''}</span>
        {draftCount > 0 && <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '100px', background: '#f1f5f9', color: '#64748b' }}>{draftCount} draft</span>}
        {savedCount > 0 && <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '100px', background: '#f0fdf4', color: '#15803d' }}>{savedCount} scheduled</span>}
        <button onClick={clearAll} style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: '700', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <X size={12} /> Clear all
        </button>
      </div>

      {/* ── Spreadsheet table ── */}
      <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)', background: '#fff' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '960px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              {[
                { label: 'Date', w: '120px' },
                { label: 'Platform', w: '130px' },
                { label: 'Action', w: '180px' },
                { label: 'Mission Title', w: '240px' },
                { label: 'Brief / Instructions', w: '280px' },
                { label: 'Pts', w: '60px' },
                { label: '', w: '36px' },
              ].map((col, i) => (
                <th key={i} style={{ padding: '10px 12px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left', width: col.w }}>
                  {col.label}
                  {col.note && <div style={{ fontSize: '9px', fontWeight: '600', color: '#c7d2fe', textTransform: 'none', letterSpacing: 0, marginTop: '1px' }}>{col.note}</div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const hasError = row._status === 'error' || row._error;
              const isSaved  = row._status === 'saved';
              return (
                <tr key={row._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', background: hasError ? '#fff5f5' : isSaved ? '#f0fdf4' : idx % 2 === 0 ? '#fff' : '#fafbfc', transition: 'background 0.15s' }}>

                  {/* Date */}
                  <td style={{ padding: '8px 10px' }}>
                    <input type="date" value={row.scheduled_date} onChange={e => updateRow(row._id, 'scheduled_date', e.target.value)}
                      style={{ ...inputStyle, borderColor: row._error?.includes('Date') ? '#fca5a5' : 'rgba(0,0,0,0.08)' }} disabled={isSaved} />
                  </td>

                  {/* Platform */}
                  <td style={{ padding: '8px 10px' }}>
                    <CustomSelect
                      value={row.platform}
                      options={[
                        ...PLATFORMS.map(p => ({ value: p, label: p })),
                        ...extraPlatforms,
                      ]}
                      onChange={opt => {
                        if (opt.isCustom) setExtraPlatforms(ep => ep.find(e => e.value === opt.value) ? ep : [...ep, opt]);
                        updateRow(row._id, 'platform', opt.value);
                      }}
                      disabled={isSaved}
                    />
                  </td>

                  {/* Action */}
                  <td style={{ padding: '8px 10px' }}>
                    <CustomSelect
                      value={row.action}
                      options={[
                        ...ACTIONS.map(a => ({ value: a.value, label: a.label, points: a.points })),
                        ...extraActions,
                      ]}
                      onChange={opt => {
                        if (opt.isCustom) setExtraActions(ea => ea.find(e => e.value === opt.value) ? ea : [...ea, { ...opt, points: 50 }]);
                        updateRow(row._id, 'action', opt.value);
                        const act = [...ACTIONS, ...extraActions].find(a => a.value === opt.value);
                        if (act?.points) updateRow(row._id, 'points', act.points);
                      }}
                      disabled={isSaved}
                    />
                  </td>

                  {/* Title */}
                  <td style={{ padding: '8px 10px' }}>
                    <input value={row.title} onChange={e => updateRow(row._id, 'title', e.target.value)}
                      placeholder="Mission title..."
                      style={{ ...inputStyle, borderColor: row._error?.includes('Title') ? '#fca5a5' : 'rgba(0,0,0,0.08)' }} disabled={isSaved} />
                  </td>

                  {/* Brief */}
                  <td style={{ padding: '8px 10px' }}>
                    <input value={row.brief} onChange={e => updateRow(row._id, 'brief', e.target.value)}
                      placeholder="Instructions for user..."
                      style={inputStyle} disabled={isSaved} />
                  </td>

                  {/* Points */}
                  <td style={{ padding: '8px 10px' }}>
                    <input type="number" value={row.points} onChange={e => updateRow(row._id, 'points', parseInt(e.target.value) || 0)}
                      style={{ ...inputStyle, textAlign: 'center' }} disabled={isSaved} />
                  </td>

                  {/* Delete / Status */}
                  <td style={{ padding: '8px 6px', textAlign: 'center' }}>
                    {isSaved
                      ? <CheckCircle size={16} style={{ color: '#10b981' }} />
                      : <button onClick={() => deleteRow(row._id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '2px', display: 'flex', alignItems: 'center' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                          onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}>
                          <Trash2 size={14} />
                        </button>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Error messages below table ── */}
      {rows.some(r => r._error) && (
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {rows.map((r, i) => r._error ? (
            <div key={r._id} style={{ fontSize: '11px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={11} /> Row {i + 1}: {r._error}
            </div>
          ) : null)}
        </div>
      )}

      {/* ── Add row + Publish ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <button onClick={addRow}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', border: '1.5px dashed rgba(0,0,0,0.12)', background: '#fff', color: '#64748b', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.color = '#64748b'; }}>
          <Plus size={14} /> Add Row
        </button>

        <button onClick={publishAll} disabled={saving || draftCount === 0}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 28px', borderRadius: '12px', border: 'none', fontSize: '13px', fontWeight: '700', cursor: saving || draftCount === 0 ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
            background: saving || draftCount === 0 ? '#e2e8f0' : '#6366f1',
            color: saving || draftCount === 0 ? '#94a3b8' : '#fff',
            boxShadow: saving || draftCount === 0 ? 'none' : '0 4px 14px rgba(99,102,241,0.35)' }}>
          {saving
            ? <><div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Scheduling...</>
            : <><Zap size={14} /> Schedule {draftCount} Mission{draftCount !== 1 ? 's' : ''}</>}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
