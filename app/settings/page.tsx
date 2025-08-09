'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
export default function Settings(){
  const [start, setStart] = useState('22:00');
  const [end, setEnd] = useState('07:00');
  const [pwd, setPwd] = useState('');
  async function saveQuiet(){
    const { data: { user } } = await supabase.auth.getUser();
    if(!user) return;
    await supabase.from('user_settings').upsert({ user_id: user.id, quiet_start: start, quiet_end: end });
    alert('Đã lưu quiet hours');
  }
  async function changePwd(){
    if(pwd.length < 8) return alert('≥ 8 ký tự');
    const { error } = await supabase.auth.updateUser({ password: pwd });
    if(error) alert(error.message); else alert('Đổi mật khẩu thành công');
  }
  return (<main style={{padding:16}}>
    <h2>Settings</h2>
    <div><h3>Quiet hours</h3>
    <input type="time" value={start} onChange={e=>setStart(e.target.value)} /> →
    <input type="time" value={end} onChange={e=>setEnd(e.target.value)} />
    <button onClick={saveQuiet} style={{marginLeft:8}}>Lưu</button></div>
    <div style={{marginTop:16}}><h3>Đổi mật khẩu</h3>
    <input type="password" placeholder="Mật khẩu mới (≥8)" value={pwd} onChange={e=>setPwd(e.target.value)} />
    <button onClick={changePwd} style={{marginLeft:8}}>Đổi</button></div>
  </main>);
}
