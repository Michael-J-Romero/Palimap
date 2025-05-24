// "use client";
import { cookies } from 'next/headers';
import ClientLayout from './ClientLayout';
import { Analytics } from '@vercel/analytics/next';
import './style.css'

export default function RootLayout({ children }) {
   const theme = cookies().get('theme')?.value || 'light'; // default
   return (
    <html lang="en" className={theme === 'dark' ? 'dark' : ''}>
      <body>
        <ClientLayout themeFromCookie={theme}>
          {children}
          <Analytics />
        </ClientLayout>
      </body>
    </html>
  );
}
