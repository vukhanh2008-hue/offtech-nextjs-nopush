'use client';
import Link from 'next/link';
export default function Home(){
  return (
    <main style={{padding:16}}>
      <h1>Offtech Tickets (Staging - No Push)</h1>
      <ul>
        <li><Link href="/tickets">Agent: Tickets</Link></li>
        <li><Link href="/approvals">Manager: Approvals</Link></li>
        <li><Link href="/dashboard">Manager: Dashboard</Link></li>
        <li><Link href="/settings">Settings</Link></li>
      </ul>
    </main>
  );
}
