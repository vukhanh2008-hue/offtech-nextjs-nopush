'use client';
import Link from 'next/link';

export default function Home(){
  return (
    <main style={{padding:16}}>
      <h1>Offtech Tickets</h1>
      <p>Quy trình: <b>Đăng nhập</b> → <b>Tickets</b> (tạo/cập nhật) → <b>Approvals</b> (manager duyệt) → <b>Dashboard</b>.</p>
      <ul>
        <li><Link href="/login">Đăng nhập</Link></li>
        <li><Link href="/tickets">Agent: Tickets</Link></li>
        <li><Link href="/approvals">Manager: Approvals</Link></li>
        <li><Link href="/dashboard">Manager: Dashboard</Link></li>
        <li><Link href="/settings">Settings (quiet hours, đổi mật khẩu)</Link></li>
      </ul>
    </main>
  );
}
