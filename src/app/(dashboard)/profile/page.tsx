'use client'

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900">โปรไฟล์ของฉัน</h1>

      {/* Profile Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">ข้อมูลส่วนตัว</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-600 text-sm">ชื่อ-นามสกุล</label>
            <p className="text-gray-900 font-semibold">สมาชิกทดสอบ</p>
          </div>
          <div>
            <label className="text-gray-600 text-sm">อีเมล</label>
            <p className="text-gray-900 font-semibold">member@example.com</p>
          </div>
          <div>
            <label className="text-gray-600 text-sm">คะแนนรวม</label>
            <p className="text-gray-900 font-semibold">0/2500</p>
          </div>
          <div>
            <label className="text-gray-600 text-sm">ระดับ</label>
            <p className="text-gray-900 font-semibold">🌱 ผู้เริ่มต้น</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-gray-600 text-sm">เสร็จแล้ว</p>
          <p className="text-3xl font-bold text-blue-500">0</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <p className="text-gray-600 text-sm">รอการอนุมัติ</p>
          <p className="text-3xl font-bold text-yellow-500">0</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-gray-600 text-sm">ยังไม่เริ่ม</p>
          <p className="text-3xl font-bold text-gray-500">50</p>
        </div>
      </div>

      {/* Badges Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">แบดจ์ที่ได้รับ</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-center py-8">ยังไม่มีแบดจ์ที่ได้รับ</p>
        </div>
      </div>
    </div>
  )
}
