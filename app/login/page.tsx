'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Login(){
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setMe(data.user));
  }, []);

  async function signIn(e:any){
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if(error) alert(error.message);
    else location.href = '/tickets';
  }

  async function signOut(){
    await supabase.auth.signOut();
    setMe(null);
    alert('Đã đăng xuất');
  }

  if(me){
    return (
      <main style={{padding:16}}>
        <h2>Đã đăng nhập</h2>
        <p>{me.email}</p>
        <button onClick={signOut}>Đăng xuất</button>
      </main>
    );
  }

  return (
    <main style={{padding:16, maxWidth:360}}>
      <h2>Đăng nhập</h2>
      <form onSubmit={signIn} style={{display:'grid', gap:8}}>
        <input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input placeholder="Mật khẩu" type="password" value={pass} onChange={e=>setPass(e.target.value)} required />
        <button type="submit">Đăng nhập</button>
      </form>
      <p style={{marginTop:8, fontSize:12, opacity:.7}}>Tối thiểu 8 ký tự. Lần đầu sẽ được yêu cầu đổi mật khẩu trong Settings.</p>
    </main>
  );
}
