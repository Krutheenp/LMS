import React from 'react'

export const dynamic = 'force-dynamic'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-gray-900 text-white shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold mb-2">🔧 Admin Panel</h1>
          <p className="text-xs text-gray-400">ผู้จัดการระบบ</p>
        </div>
        <nav className="space-y-1 px-4 py-6 flex-1">
          <a href="/admin" className="block px-4 py-3 text-white hover:bg-gray-800 rounded transition">
            📊 แดชบอร์ด
          </a>
          <a href="/admin/members" className="block px-4 py-3 text-white hover:bg-gray-800 rounded transition">
            👥 จัดการสมาชิก
          </a>
          <a href="/admin/activities" className="block px-4 py-3 text-white hover:bg-gray-800 rounded transition">
            📝 จัดการกิจกรรม
          </a>
          <a href="/admin/reviews" className="block px-4 py-3 text-white hover:bg-gray-800 rounded transition">
            ✅ ตรวจการส่ง
          </a>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-4 px-4">เมนูอื่น</p>
            <a href="/" className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded transition">
              ← กลับไปแดชบอร์ด
            </a>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' })
              window.location.href = '/login'
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition font-medium text-sm"
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
