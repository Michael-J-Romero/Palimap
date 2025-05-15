import { cookies } from 'next/headers';
import ClientLayout from './ClientLayout';
import { Analytics } from '@vercel/analytics/next';
export default function RootLayout({ children }) {
  console.log("weee themee")
  const theme = cookies().get('theme')?.value || 'light'; // default
console.log("weee themee",theme)
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
