import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LMS - Learning Management System',
  description: 'ระบบจัดการกิจกรรมการเรียนรู้สำหรับ 600 สมาชิก',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  )
}
