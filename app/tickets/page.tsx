'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
type Ticket = { id:string; title:string; status:string; mode:string; province:string|null; ward:string|null; assignee_id:string|null };
export default function TicketsPage(){
  const [rows, setRows] = useState<Ticket[]>([]);
  const [status, setStatus] = useState('Open');
  const [province, setProvince] = useState('');
  const [ward, setWard] = useState('');
  const [onlyMine, setOnlyMine] = useState(true);
  async function load(){
    let q = supabase.from('tickets').select('id,title,status,mode,province,ward,assignee_id').order('created_at', {ascending:false});
    if(status) q = q.eq('status', status);
    if(province) q = q.ilike('province', `%${province}%`);
    if(ward) q = q.ilike('ward', `%${ward}%`);
    if(onlyMine){
      const { data: { user } } = await supabase.auth.getUser();
      if(user) q = q.or(`assignee_id.eq.${user.id},created_by.eq.${user.id}`);
    }
    const { data } = await q; setRows(data||[]);
  }
  useEffect(()=>{ load(); }, [status, province, ward, onlyMine]);
  useEffect(()=>{
    const sub = supabase.channel('tickets-rt').on('postgres_changes', { event:'*', schema:'public', table:'tickets' }, load).subscribe();
    return ()=> { supabase.removeChannel(sub); };
  },[]);
  async function updateStatus(id:string, next:string){ await supabase.from('tickets').update({ status: next }).eq('id', id); }
  return (
    <main style={{padding:16}}>
      <h2>Tickets</h2>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <select value={status} onChange={e=>setStatus(e.target.value)}>
          {['Open','In_Progress','On_Hold','Resolved','Closed'].map(s=> <option key={s}>{s}</option>)}
        </select>
        <input placeholder="Tỉnh/Thành phố" value={province} onChange={e=>setProvince(e.target.value)} />
        <input placeholder="Phường/Xã" value={ward} onChange={e=>setWard(e.target.value)} />
        <label><input type="checkbox" checked={onlyMine} onChange={e=>setOnlyMine(e.target.checked)} /> Chỉ của tôi</label>
      </div>
      <table width="100%" style={{fontSize:14}}>
        <thead><tr><th>Tiêu đề</th><th>Địa bàn</th><th>Mode</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.title}</td>
              <td>{r.province || '-'} / {r.ward || '-'}</td>
              <td>{r.mode}</td>
              <td>{r.status}</td>
              <td>
                {r.status==='Open' && <button onClick={()=>updateStatus(r.id,'In_Progress')}>Start</button>}
                {r.status==='In_Progress' && <button onClick={()=>updateStatus(r.id,'Resolved')}>Mark Resolved</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
