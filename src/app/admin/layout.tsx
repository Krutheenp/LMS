import React from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-gray-900 text-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8">🔧 Admin Panel</h1>
        </div>
        <nav className="space-y-2 px-4">
          <a href="/admin" className="block px-4 py-3 text-white hover:bg-gray-800 rounded">
            📊 แดชบอร์ด
          </a>
          <a href="/admin/members" className="block px-4 py-3 text-white hover:bg-gray-800 rounded">
            👥 จัดการสมาชิก
          </a>
          <a href="/admin/activities" className="block px-4 py-3 text-white hover:bg-gray-800 rounded">
            📝 จัดการกิจกรรม
          </a>
          <a href="/admin/reviews" className="block px-4 py-3 text-white hover:bg-gray-800 rounded">
            ✅ ตรวจสอบงาน
          </a>
        </nav>
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
