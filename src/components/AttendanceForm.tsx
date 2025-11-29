'use client';

import { useState } from 'react';
import { User, Attendance, AttendanceStatus } from '@/types';

type AttendanceFormProps = {
  users: User[];
  attendance?: Attendance;
  initialDate?: string;
  onSubmit: (attendanceData: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
};

const STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: '出勤',
  vacation: '休暇',
  am_off: 'AM休',
  pm_off: 'PM休',
};

export default function AttendanceForm({
  users,
  attendance,
  initialDate,
  onSubmit,
  onCancel,
}: AttendanceFormProps) {
  const [userId, setUserId] = useState(
    attendance?.userId.toString() || ''
  );
  const [date, setDate] = useState(
    attendance?.date || initialDate || new Date().toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<AttendanceStatus>(
    attendance?.status || 'present'
  );
  const [location, setLocation] = useState(attendance?.location || '');
  const [tasks, setTasks] = useState(attendance?.tasks || '');
  const [consultation, setConsultation] = useState(
    attendance?.consultation || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !date || !status) {
      alert('メンバー、日付、ステータスは必須です');
      return;
    }

    onSubmit({
      userId: parseInt(userId),
      date,
      status,
      location: location || null,
      tasks: tasks || null,
      consultation: consultation || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">
        {attendance ? '出勤記録を編集' : '出勤記録を登録'}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            メンバー <span className="text-red-500">*</span>
          </label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          >
            <option value="">選択してください</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            日付 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            ステータス <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(STATUS_LABELS) as AttendanceStatus[]).map((s) => (
              <label
                key={s}
                className={`
                  flex items-center justify-center p-3 border-2 rounded cursor-pointer
                  ${
                    status === s
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                <input
                  type="radio"
                  name="status"
                  value={s}
                  checked={status === s}
                  onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
                  className="sr-only"
                />
                <span className="font-medium">{STATUS_LABELS[s]}</span>
              </label>
            ))}
          </div>
        </div>

        {status !== 'vacation' && (
          <>
            {status === 'present' && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  出勤場所
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="例: 本社、在宅、A支店"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                今日やること
              </label>
              <textarea
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                placeholder="例: &#10;- 資料作成&#10;- クライアントとの打ち合わせ&#10;- コードレビュー"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                相談したいこと
              </label>
              <textarea
                value={consultation}
                onChange={(e) => setConsultation(e.target.value)}
                placeholder="例: プロジェクトXの進め方について相談したい"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                rows={3}
              />
            </div>
          </>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {attendance ? '更新' : '登録'}
          </button>
        </div>
      </div>
    </form>
  );
}
