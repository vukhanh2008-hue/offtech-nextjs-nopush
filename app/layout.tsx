export const metadata = { title: 'Offtech Tickets' };
export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
