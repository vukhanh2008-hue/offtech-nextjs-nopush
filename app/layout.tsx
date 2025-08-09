export const metadata = { title: 'Offtech Tickets' };

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="vi">
      <body style={{fontFamily:'system-ui', lineHeight:1.4}}>
        <header style={{padding:12, borderBottom:'1px solid #eee'}}>
          <b>Offtech Tickets</b> <small style={{opacity:.6}}>staging</small>
          <nav style={{marginTop:8, display:'flex', gap:12}}>
            <a href="/">Trang chủ</a>
            <a href="/tickets">Tickets</a>
            <a href="/approvals">Approvals</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/settings">Settings</a>
            <a href="/login" style={{marginLeft:'auto'}}>Đăng nhập/Đăng xuất</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
