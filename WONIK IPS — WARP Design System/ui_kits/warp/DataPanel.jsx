// DataPanel.jsx — Light and dark panels with header + table rows

// Generic panel wrapper
function Panel({ title, dark, children, style }) {
  const bg      = dark ? '#1E1E21' : '#FEFEFE';
  const hdrBg   = dark ? '#252528' : '#F4F5F5';
  const border  = dark ? '1px solid #52525C' : '1px solid #E1E1E4';
  const titleColor = dark ? '#D9D9DC' : '#71717B';
  return (
    <div style={{ background: bg, border, borderRadius:10, overflow:'hidden', ...style }}>
      {title && (
        <div style={{ background:hdrBg, borderBottom:border, borderRadius:'10px 10px 0 0', height:40, display:'flex', alignItems:'center', padding:'0 13px' }}>
          {!dark && <span style={{ width:6, height:6, borderRadius:'50%', background:'#71717B', marginRight:7, display:'inline-block' }}></span>}
          <span style={{ fontSize:10, color:titleColor, lineHeight:1 }}>{title}</span>
        </div>
      )}
      {children}
    </div>
  );
}

// Table row: label cell + value cells
function TableRow({ label, labelWidth=82, labelBg='#FEFEFE', cells=[], height=20 }) {
  return (
    <div style={{ display:'flex', height, borderBottom:'1px solid #E1E1E4', flexShrink:0 }}>
      <div style={{ width:labelWidth, flexShrink:0, borderRight:'1px solid #E1E1E4', background:labelBg, display:'flex', alignItems:'center', padding:'0 8px' }}>
        {label}
      </div>
      {cells.map((c, i) => (
        <div key={i} style={{ flex:c.flex||1, borderRight: i<cells.length-1?'1px solid #E1E1E4':undefined, display:'flex', alignItems:'center', padding:'0 6px', background:'#FEFEFE', minWidth:0 }}>
          {c.content}
        </div>
      ))}
    </div>
  );
}

// Process chamber panel (dark, right side)
function ProcessChamberPanel({ name, data, style }) {
  return (
    <Panel title={`${name} Process Information`} dark style={style}>
      <div style={{ padding:'6px 0' }}>
        {data.map((row, i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'3px 13px', fontSize:10, color:'#D9D9DC', lineHeight:1 }}>
            <span>{row.label}</span>
            <span style={{ color:'#E0E0E3', fontVariantNumeric:'tabular-nums' }}>{row.value}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// Load port panel row
function LoadPortRow({ portName, cjobName, carrierId, status, accessMode }) {
  const nameCell = (
    <div style={{ width:56, flexShrink:0, height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'#1E1E21', borderRadius:4, margin:'0 4px' }}>
      <span style={{ fontSize:9, color:'#FEFEFE', lineHeight:1, fontFamily:'Inter,sans-serif' }}>{portName}</span>
    </div>
  );
  return (
    <div style={{ borderBottom:'1px solid #E1E1E4' }}>
      <div style={{ display:'flex', height:20 }}>
        <div style={{ width:82, flexShrink:0, borderRight:'1px solid #E1E1E4', display:'flex', alignItems:'center', justifyContent:'center', background:'#FEFEFE' }}>{nameCell}</div>
        <div style={{ flex:1, borderRight:'1px solid #E1E1E4', background:'#FEFEFE' }}></div>
      </div>
      <div style={{ display:'flex', height:20 }}>
        <div style={{ width:82, flexShrink:0, borderRight:'1px solid #E1E1E4', background:'#FEFEFE', display:'flex', alignItems:'center', padding:'0 8px 0 16px' }}>
          <span style={{ fontSize:10, color:'#71717B', lineHeight:1 }}>Carrier ID</span>
        </div>
        <div style={{ flex:1, borderRight:'1px solid #E1E1E4', background:'#FEFEFE', display:'flex', alignItems:'center', padding:'0 6px' }}>
          <span style={{ fontSize:10, color:'#71717B' }}>{carrierId}</span>
        </div>
      </div>
      <div style={{ display:'flex', height:20 }}>
        <div style={{ width:82, flexShrink:0, borderRight:'1px solid #E1E1E4', background:'#FEFEFE', display:'flex', alignItems:'center', padding:'0 8px 0 16px' }}>
          <span style={{ fontSize:10, color:'#71717B', lineHeight:1 }}>Status</span>
        </div>
        <div style={{ flex:1, borderRight:'1px solid #E1E1E4', background:'#FEFEFE', display:'flex', alignItems:'center', padding:'0 6px', gap:4 }}>
          <StatusDot status="ok" label={status} size="sm" />
        </div>
        <div style={{ flex:1, borderRight:'1px solid #E1E1E4', background:'#FEFEFE', display:'flex', alignItems:'center', padding:'0 6px' }}>
          <span style={{ fontSize:10, color:'#71717B' }}>Acess Mode</span>
        </div>
        <div style={{ flex:1, background:'#FEFEFE', display:'flex', alignItems:'center', padding:'0 6px' }}>
          <StatusDot status="warn" label={accessMode} size="sm" />
        </div>
      </div>
    </div>
  );
}

// Wafer mapping panel
function WaferMappingPanel({ lptSlots, style }) {
  return (
    <Panel title="Wafer Mapping Information" style={style}>
      <div style={{ padding:'8px 0 8px 10px', display:'flex', flexDirection:'column', gap:4 }}>
        {/* legend */}
        <div style={{ display:'flex', gap:12, marginBottom:2, padding:'0 4px', flexWrap:'wrap' }}>
          {[['Empty','#FEFEFE','#E1E1E4','#71717B'],['Occupied','#DBEAFe','#BBDCff','#2B7FFF'],['Processed','#F3E8FF','#E9D1FF','#7C3AED'],['Aborted','#E9D1FF','#E9D1FF','#7C3AED']].map(([l,bg,bdr,c]) => (
            <span key={l} style={{ display:'inline-flex', alignItems:'center', gap:3, fontSize:9, color:'#71717B' }}>
              <span style={{ width:8,height:8,background:bg,border:`1px solid ${bdr}`,display:'inline-block',flexShrink:0 }}></span>{l}
            </span>
          ))}
        </div>
        {lptSlots.map((row, i) => (
          <WaferSlotRow key={i} label={row.label} total={row.total||13} slots={row.slots||[]} />
        ))}
      </div>
    </Panel>
  );
}

Object.assign(window, { Panel, TableRow, ProcessChamberPanel, LoadPortRow, WaferMappingPanel });
