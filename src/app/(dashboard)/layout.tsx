'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: string
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Decode user from cookie or fetch user data
    const decodeUserFromCookie = () => {
      const cookies = document.cookie.split(';')
      for (const cookie of cookies) {
        if (cookie.trim().startsWith('auth-token=')) {
          try {
            const token = cookie.trim().substring('auth-token='.length)
            const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
            setUser({
              id: decoded.userId,
              email: decoded.email,
              name: decoded.email.split('@')[0],
              role: decoded.role,
            })
          } catch (e) {
            console.error('Failed to decode user:', e)
          }
        }
      }
      setLoading(false)
    }

    decodeUserFromCookie()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <nav className="flex-1 p-6 space-y-2">
          <div className="mb-6 pb-6 border-b">
            <h2 className="font-semibold text-gray-900">{user?.name || 'User'}</h2>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
          
          <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition">
            📊 แดชบอร์ด
          </a>
          <a href="/activities" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition">
            📋 กิจกรรม
          </a>
          <a href="/badges" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition">
            🎖️ แบดจ์
          </a>
          <a href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition">
            👤 โปรไฟล์
          </a>

          {user?.role === 'ADMIN' && (
            <>
              <div className="mt-8 pt-6 border-t">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Admin Panel</p>
                <a href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded transition">
                  🔧 Dashboard Admin
                </a>
                <a href="/admin/members" className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded transition">
                  👥 จัดการสมาชิก
                </a>
                <a href="/admin/activities" className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded transition">
                  📚 จัดการกิจกรรม
                </a>
                <a href="/admin/reviews" className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded transition">
                  ✅ ตรวจการส่ง
                </a>
              </div>
            </>
          )}
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition font-medium"
          >
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
