// StatusIndicator.jsx — status dots, chips, wafer grid, chamber state list

function StatusDot({ status, label, size = 'md' }) {
  const configs = {
    ok:    { dot: '#07895E', text: '#00D492' },
    warn:  { dot: '#FE9A00', text: '#D09804' },
    blue:  { dot: '#2B7FFF', text: '#2B7FFF' },
    gray:  { dot: '#D4D4D8', text: '#71717B' },
  };
  const c = configs[status] || configs.gray;
  const sz = size === 'sm' ? 4 : 5;
  const fs = size === 'sm' ? 10 : 12;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:fs, lineHeight:1 }}>
      <span style={{ width:sz, height:sz, borderRadius:'50%', background:c.dot, flexShrink:0, display:'inline-block' }}></span>
      <span style={{ color: c.text }}>{label}</span>
    </span>
  );
}

function ModuleLabel({ name, active }) {
  return (
    <div style={{
      display:'inline-flex', alignItems:'center', gap:6, fontSize:12, lineHeight:1,
    }}>
      <span style={{ width:5, height:5, borderRadius:'50%', background: active ? '#2B7FFF' : '#D4D4D8', display:'inline-block' }}></span>
      <span style={{ color: active ? '#2B7FFF' : '#D9D9DC' }}>{name}</span>
    </div>
  );
}

function StateChip({ label, variant = 'default', selected }) {
  const variants = {
    init:     { bg:'#FFFFAC', border:'#5C5C5C',  color:'#5C5C66' },
    ready:    { bg:'#FEFEFE', border:'#D4D4D8',  color:'#00D492' },
    run:      { bg:'#DBEAFe', border:'#BBDCff',  color:'#2B7FFF' },
    processend:{ bg:'#E8F9F3', border:'#07895E', color:'#07895E' },
    accessready:{ bg:'#EAF3FF', border:'#BBDCff',color:'#2B7FFF' },
    alarm:    { bg:'#FFE2E2', border:'#FFCACA',  color:'#CC0000' },
    abort:    { bg:'#FFCACA', border:'#FFCACA',  color:'#CC0000' },
    default:  { bg:'#FEFEFE', border:'#D4D4D8',  color:'#5C5C66' },
    selected: { bg:'#FEFEFE', border:'#415BC6',  color:'#5C5C66' },
  };
  const v = selected ? variants.selected : (variants[variant] || variants.default);
  return (
    <div style={{
      display:'inline-flex', alignItems:'center', justifyContent:'center',
      height:17, padding:'0 8px', fontSize:10, lineHeight:1,
      background: v.bg, border: `${selected ? 2 : 1}px solid ${v.border}`, color: v.color,
      whiteSpace:'nowrap', cursor:'pointer',
    }}>{label}</div>
  );
}

// Wafer slot grid row (1..N slots)
function WaferSlotRow({ label, total = 13, slots = [] }) {
  // slots: array of {idx, status} where status: 'empty'|'occupied'|'processed'|'aborted'
  const slotMap = {};
  slots.forEach(s => { slotMap[s.idx] = s.status; });
  const colors = {
    empty:     { bg:'#FEFEFE', border:'#E1E1E4', color:'#71717B' },
    occupied:  { bg:'#DBEAFe', border:'#BBDCff', color:'#2B7FFF' },
    processed: { bg:'#F3E8FF', border:'#E9D1FF', color:'#7C3AED' },
    aborted:   { bg:'#E9D1FF', border:'#E9D1FF', color:'#7C3AED' },
    alarm:     { bg:'#FFE2E2', border:'#FFCACA', color:'#CC0000' },
  };
  return (
    <div style={{ display:'flex', alignItems:'center', gap:4, height:20 }}>
      <div style={{ width:36, fontSize:10, color:'#5C5C66', lineHeight:1, flexShrink:0, fontFamily:'Inter,sans-serif' }}>{label}</div>
      <div style={{ display:'flex', gap:1 }}>
        {Array.from({length: total}, (_, i) => {
          const st = slotMap[i+1] || 'empty';
          const c = colors[st];
          return (
            <div key={i} style={{
              width:14, height:14, background:c.bg, border:`1px solid ${c.border}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:7, color:c.color, lineHeight:1, cursor:'default',
            }}>{i+1}</div>
          );
        })}
      </div>
    </div>
  );
}

// Chamber state list (vertical)
function ChamberStateList({ states }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
      {states.map((s, i) => (
        <div key={i} style={{
          width:88, height:17, display:'flex', alignItems:'center', justifyContent:'center',
          background: s.bg, border:`1px solid ${s.border}`, fontSize:10, color:s.color, lineHeight:1,
        }}>{s.label}</div>
      ))}
    </div>
  );
}

const CHAMBER_STATES = [
  { label:'Init',         bg:'#FFFFAC', border:'#5C5C5C', color:'#5C5C66' },
  { label:'Ready',        bg:'#FEFEFE', border:'#D4D4D8', color:'#00D492' },
  { label:'Run',          bg:'#DBEAFe', border:'#BBDCff', color:'#2B7FFF' },
  { label:'Process End',  bg:'#E8F9F3', border:'#07895E', color:'#07895E' },
  { label:'Access Ready', bg:'#EAF3FF', border:'#BBDCff', color:'#2B7FFF' },
  { label:'Alarm',        bg:'#FFE2E2', border:'#FFCACA', color:'#CC0000' },
  { label:'Abort',        bg:'#FFCACA', border:'#FFCACA', color:'#CC0000' },
];

Object.assign(window, { StatusDot, ModuleLabel, StateChip, WaferSlotRow, ChamberStateList, CHAMBER_STATES });
