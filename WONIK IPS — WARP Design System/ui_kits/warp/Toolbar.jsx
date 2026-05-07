// Toolbar.jsx — WARP top dark toolbar
// Exports: Toolbar

function Toolbar({ activeTab, onTabChange }) {
  const funcBtns = [
    { id: 'scd', label: 'SCD WAFER', icon: <svg width="22" height="18" viewBox="0 0 22 18" fill="currentColor"><rect x="0" y="0" width="22" height="14" rx="1"/><rect x="3" y="15" width="16" height="2"/><rect x="8" y="13" width="6" height="3"/></svg> },
    { id: 'playback', label: 'PLAYBACK', icon: <svg width="22" height="18" viewBox="0 0 22 18" fill="currentColor"><path d="M4 2h14v12H4zm0 13h5v1H4zm7 0h7v1h-7z"/><path d="M8 5l6 4-6 4z"/></svg> },
    { id: 'terminal', label: 'TERMINAL', icon: <svg width="22" height="18" viewBox="0 0 22 18" fill="currentColor"><path d="M1 1h20v16H1zm2 2v12h16V3zm2 2l4 3-4 3zm5 5h6v1h-6z"/></svg> },
    { id: 'mode', label: 'MODE', icon: <svg width="22" height="18" viewBox="0 0 22 18" fill="currentColor"><circle cx="11" cy="9" r="5"/><path d="M11 1v3M11 14v3M1 9h3M18 9h3M3.5 3.5l2 2M16.5 14.5l2 2M3.5 14.5l2-2M16.5 3.5l2-2"/></svg> },
    { id: 'sysinit', label: "SYS'INIT", icon: <svg width="22" height="18" viewBox="0 0 22 18" fill="currentColor"><rect x="1" y="1" width="20" height="13" rx="1"/><rect x="4" y="15" width="14" height="2"/><rect x="9" y="13" width="4" height="3"/><path d="M5 5l4 3-4 3z"/></svg> },
    { id: 'alarm', label: 'ALARM', icon: <svg width="22" height="18" viewBox="0 0 22 18" fill="currentColor"><path d="M11 2L3 16h16L11 2zm0 3l5.5 9.5h-11L11 5zm-1 4h2v3h-2zm0 4h2v2h-2z"/></svg> },
    { id: 'buzzer', label: 'BUZZER', icon: <svg width="22" height="18" viewBox="0 0 22 18" fill="currentColor"><path d="M11 2C7.13 2 4 5.13 4 9s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg> },
  ];

  const runBtns = [
    { id: 'play', label: 'PLAY', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 1l10 6L3 13z"/></svg> },
    { id: 'stop', label: 'STOP', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="1" y="1" width="12" height="12"/></svg> },
    { id: 'close', label: 'CLOSE', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" fill="none"/></svg> },
  ];

  const navBtns = [
    { id: 'prev', icon: <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><path d="M8 1L2 6l6 5z"/></svg> },
    { id: 'play2', icon: <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><path d="M2 1l6 5-6 5z"/></svg> },
    { id: 'step', icon: <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><path d="M2 1l5 5-5 5M8 1v10"/></svg> },
    { id: 'end', icon: <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><rect x="9" y="1" width="2" height="10"/><path d="M2 1l6 5-6 5z"/></svg> },
  ];

  const bottomBtns = [
    { id: 'settings', label: 'CONFIG', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg> },
    { id: 'tools', label: 'CONFIG', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg> },
    { id: 'manual', label: 'MANUAL', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z"/></svg> },
    { id: 'recipe', label: 'RECIPE', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg> },
    { id: 'status', label: 'STATUS', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg> },
    { id: 'watcher', label: 'WATCHER', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg> },
    { id: 'calibrate', label: 'CALIBRATE', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-3-5v2m0 6v2m-5-5h2m6 0h2"/></svg> },
  ];

  const s = toolbarStyles;

  return (
    <div style={s.root}>
      {/* Logo panel */}
      <div style={s.panel}>
        <img src="../../assets/logo-wonik-ips.png" style={{height:22, objectFit:'contain'}} />
        <div style={{fontSize:9, color:'#71717B', marginTop:3}}>2025-11-25 08:26</div>
      </div>

      {/* User/module panel */}
      <div style={{...s.panel, minWidth:170, gap:8}}>
        <div style={s.userIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#D4D4D8"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:3}}>
          <span style={{fontSize:14, color:'#5C5C66', lineHeight:1}}>WARP</span>
          <span style={{fontSize:10, color:'#2B7FFF', lineHeight:1, display:'flex', alignItems:'center', gap:3}}>
            <svg width="9" height="11" viewBox="0 0 10 12" fill="#2B7FFF"><path d="M9.333 5.333C9.56 5.333 9.78 5.36 10 5.393L10 2.18 5 0 0 2.18 0 5.453C0 8.48 2.133 11.313 5 12c.367-.087.72-.213 1.067-.367C5.607 10.98 5.333 10.187 5.333 9.333 5.333 7.127 7.127 5.333 9.333 5.333Z"/></svg>
            ADMIN
          </span>
        </div>
        <span style={{fontSize:10, color:'#52525C', marginLeft:'auto'}}>→</span>
      </div>

      {/* Macro/run state panel */}
      <div style={{...s.panel, minWidth:90, flexDirection:'column', alignItems:'flex-start', justifyContent:'center', padding:'4px 12px'}}>
        <div style={{fontSize:12, color:'#E0E0E3', lineHeight:1}}>Not Connected</div>
        <div style={{fontSize:10, color:'#71717B', lineHeight:1, marginTop:4}}>No State</div>
      </div>

      {/* Run controls */}
      <div style={{...s.panel, gap:6, padding:'5px 10px'}}>
        {/* Record/sequence dots */}
        <div style={{display:'flex', flexDirection:'column', gap:5, marginRight:4}}>
          {[0,1,2].map(i => (
            <div key={i} style={{width:24, height:18, borderRadius:4, background:'#1A2332', border:'1px solid #1E3761', display:'flex', alignItems:'center', justifyContent:'center'}}>
              <div style={{width:10, height:10, background:'#2B7FFF', borderRadius:2, opacity: i===0?1:0.3}}></div>
            </div>
          ))}
        </div>
        {runBtns.map(b => (
          <div key={b.id} style={s.iconBtn}>
            <div style={{color:'#D4D4D8'}}>{b.icon}</div>
            <span style={s.btnLabel}>{b.label}</span>
          </div>
        ))}
      </div>

      {/* Nav/step controls */}
      <div style={{...s.panel, gap:4}}>
        {navBtns.map(b => (
          <div key={b.id} style={{...s.iconBtn, minWidth:20, padding:'4px 6px'}}>
            <div style={{color:'#D4D4D8'}}>{b.icon}</div>
          </div>
        ))}
      </div>

      {/* Function buttons */}
      <div style={{...s.panel, gap:2}}>
        {funcBtns.map(b => (
          <div key={b.id} style={{...s.iconBtn, color: b.id==='sysinit' ? '#2B7FFF' : '#D4D4D8'}}>
            {b.icon}
            <span style={{...s.btnLabel, color: b.id==='sysinit' ? '#2B7FFF' : '#D9D9DC'}}>{b.label}</span>
          </div>
        ))}
      </div>

      {/* Spacer */}
      <div style={{flex:1}}></div>

      {/* Bottom toolbar icons row (shown on same bar for kit) */}
    </div>
  );
}

const toolbarStyles = {
  root: { height:67, background:'#1E1E21', display:'flex', alignItems:'center', gap:4, padding:'5px 6px', overflow:'hidden', flexShrink:0 },
  panel: { background:'#1E1E21', border:'1px solid #52525C', borderRadius:10, height:57, display:'flex', alignItems:'center', padding:'0 10px', gap:6, flexShrink:0 },
  userIcon: { width:36, height:36, borderRadius:5, background:'#1A2332', border:'1px solid #1E3761', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  iconBtn: { display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'3px 6px', cursor:'pointer', minWidth:44 },
  btnLabel: { fontSize:9, lineHeight:1, color:'#D9D9DC', whiteSpace:'nowrap' },
};

Object.assign(window, { Toolbar });
