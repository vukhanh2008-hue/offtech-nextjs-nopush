'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

type Ticket = {
  id:string; title:string; status:'Open'|'In_Progress'|'On_Hold'|'Resolved'|'Closed';
  mode:'Online'|'Onsite'; province:string|null; ward:string|null; assignee_id:string|null;
};

export default function TicketsPage(){
  const [rows, setRows] = useState<Ticket[]>([]);
  const [status, setStatus] = useState<string>('Open');
  const [province, setProvince] = useState('');
  const [ward, setWard] = useState('');
  const [onlyMine, setOnlyMine] = useState(true);

  // Form tạo mới
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState<'Online'|'Onsite'>('Online');

  async function load(){
    let q = supabase.from('tickets')
      .select('id,title,status,mode,province,ward,assignee_id')
      .order('created_at', {ascending:false});

    if(status) q = q.eq('status', status);
    if(province) q = q.ilike('province', `%${province}%`);
    if(ward) q = q.ilike('ward', `%${ward}%`);

    if(onlyMine){
      const { data: { user } } = await supabase.auth.getUser();
      if(user) q = q.or(`assignee_id.eq.${user.id},created_by.eq.${user.id}`);
    }
    const { data, error } = await q;
    if(error) alert(error.message);
    setRows(data || []);
  }

  useEffect(()=>{ load(); }, [status, province, ward, onlyMine]);
  useEffect(()=>{
    const sub = supabase.channel('tickets-rt')
      .on('postgres_changes', { event:'*', schema:'public', table:'tickets' }, load)
      .subscribe();
    return ()=> { supabase.removeChannel(sub); };
  },[]);

  async function createTicket(){
    if(!title.trim()) return alert('Nhập tiêu đề');
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('tickets').insert({
      title, mode, province: province || null, ward: ward || null, created_by: user?.id || null, assignee_id: user?.id || null
    });
    if(error) alert(error.message);
    else{ setTitle(''); await load(); }
  }

  async function updateStatus(id:string, next:Ticket['status']){
    const { error } = await supabase.from('tickets').update({ status: next }).eq('id', id);
    if(error) alert(error.message);
  }

  return (
    <main style={{padding:16}}>
      <h2>Tickets</h2>

      {/* Form tạo ticket */}
      <div style={{padding:12, border:'1px solid #eee', borderRadius:8, marginBottom:12}}>
        <h3 style={{marginTop:0}}>Tạo ticket mới</h3>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          <input placeholder="Tiêu đề" value={title} onChange={e=>setTitle(e.target.value)} />
          <input placeholder="Tỉnh/Thành phố" value={province} onChange={e=>setProvince(e.target.value)} />
          <input placeholder="Phường/Xã" value={ward} onChange={e=>setWard(e.target.value)} />
          <select value={mode} onChange={e=>setMode(e.target.value as any)}>
            <option value="Online">Online</option>
            <option value="Onsite">Onsite</option>
          </select>
          <button onClick={createTicket}>Tạo</button>
        </div>
      </div>

      {/* Bộ lọc */}
      <div style={{display:'flex', gap:8, marginBottom:12, flexWrap:'wrap'}}>
        <select value={status} onChange={e=>setStatus(e.target.value)}>
          {['Open','In_Progress','On_Hold','Resolved','Closed'].map(s=> <option key={s}>{s}</option>)}
        </select>
        <label><input type="checkbox" checked={onlyMine} onChange={e=>setOnlyMine(e.target.checked)} /> Chỉ của tôi</label>
      </div>

      <table width="100%" style={{fontSize:14, borderCollapse:'collapse'}}>
        <thead>
          <tr><th style={{textAlign:'left'}}>Tiêu đề</th><th>Địa bàn</th><th>Mode</th><th>Trạng thái</th><th>Hành động</th></tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.title}</td>
              <td style={{textAlign:'center'}}>{r.province || '-'} / {r.ward || '-'}</td>
              <td style={{textAlign:'center'}}>{r.mode}</td>
              <td style={{textAlign:'center'}}>{r.status}</td>
              <td style={{textAlign:'center'}}>
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
