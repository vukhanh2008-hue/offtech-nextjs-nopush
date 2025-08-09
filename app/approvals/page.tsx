'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
type Row = { id:string; title:string; province:string|null; ward:string|null; assignee_id:string|null; resolved_at:string|null };
export default function Approvals(){
  const [rows,setRows] = useState<Row[]>([]);
  async function load(){
    const { data } = await supabase.from('tickets').select('id,title,province,ward,assignee_id,resolved_at').eq('status','Resolved').eq('manager_verified', false).order('resolved_at', { ascending: true });
    setRows(data||[]);
  }
  useEffect(()=>{ load(); },[]);
  async function approve(id:string){ await supabase.from('tickets').update({ manager_verified:true, status:'Closed' }).eq('id', id); await load(); }
  async function reject(id:string){ const reason = prompt('Lý do trả lại?'); if(!reason) return; await supabase.from('tickets').update({ status:'In_Progress', reject_reason: reason, manager_verified:false }).eq('id', id); await load(); }
  return (
    <main style={{padding:16}}>
      <h2>Cần duyệt</h2>
      <table width="100%" style={{fontSize:14}}>
        <thead><tr><th>Tiêu đề</th><th>Địa bàn</th><th>Agent</th><th>Resolved at</th><th>Hành động</th></tr></thead>
        <tbody>{rows.map(r=> (
          <tr key={r.id}><td>{r.title}</td><td>{r.province || '-'} / {r.ward || '-'}</td><td>{r.assignee_id?.slice(0,8)}</td><td>{r.resolved_at || ''}</td><td><button onClick={()=>approve(r.id)}>Approve</button><button onClick={()=>reject(r.id)} style={{marginLeft:8}}>Reject</button></td></tr>
        ))}</tbody>
      </table>
    </main>
  );
}
