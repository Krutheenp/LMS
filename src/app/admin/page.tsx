'use client'

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 font-semibold mb-2">สมาชิกทั้งหมด</h3>
          <p className="text-4xl font-bold text-blue-500">600</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 font-semibold mb-2">กิจกรรมทั้งหมด</h3>
          <p className="text-4xl font-bold text-green-500">50</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 font-semibold mb-2">รอการตรวจสอบ</h3>
          <p className="text-4xl font-bold text-yellow-500">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 font-semibold mb-2">อัตราความสำเร็จ</h3>
          <p className="text-4xl font-bold text-purple-500">0%</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">ยินดีต้อนรับสู่ Admin Panel</h2>
        <p className="text-gray-600 mb-4">
          ที่นี่คุณสามารถจัดการสมาชิก กิจกรรม ตรวจสอบงาน และดูรายงานได้
        </p>
      </div>
    </div>
  )
}
