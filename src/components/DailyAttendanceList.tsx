'use client';

import { User, Attendance, AttendanceStatus } from '@/types';

type DailyAttendanceListProps = {
  users: User[];
  attendances: Attendance[];
  selectedDate: string;
  onEdit: (attendance: Attendance) => void;
  onAdd: () => void;
};

const STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: '出勤',
  vacation: '休暇',
  am_off: 'AM休',
  pm_off: 'PM休',
};

const STATUS_COLORS: Record<AttendanceStatus, string> = {
  present: 'bg-green-100 text-green-800 border-green-300',
  vacation: 'bg-gray-100 text-gray-800 border-gray-300',
  am_off: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  pm_off: 'bg-orange-100 text-orange-800 border-orange-300',
};

export default function DailyAttendanceList({
  users,
  attendances,
  selectedDate,
  onEdit,
  onAdd,
}: DailyAttendanceListProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  // 全メンバーの出勤情報を作成（未記入も含む）
  const allMemberStatus = users.map((user) => {
    const attendance = attendances.find((a) => a.userId === user.id);
    return {
      user,
      attendance,
    };
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {formatDate(selectedDate)} の出勤状況
        </h2>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          + 出勤記録を追加
        </button>
      </div>

      {users.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          メンバーが登録されていません
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allMemberStatus.map(({ user, attendance }) => (
              <div
                key={user.id}
                className={`border rounded-lg p-3 transition-shadow ${
                  attendance
                    ? 'border-gray-200 hover:shadow-md cursor-pointer'
                    : 'border-red-200 bg-red-50'
                }`}
                onClick={() => attendance && onEdit(attendance)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-base">{user.name}</h3>
                  {attendance ? (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        STATUS_COLORS[attendance.status]
                      }`}
                    >
                      {STATUS_LABELS[attendance.status]}
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-medium border bg-red-100 text-red-800 border-red-300">
                      未記入
                    </span>
                  )}
                </div>

                {attendance && attendance.status !== 'vacation' && (
                  <div className="space-y-1 text-xs text-gray-600">
                    {attendance.status === 'present' && attendance.location && (
                      <div className="truncate">
                        <span className="font-medium">場所:</span> {attendance.location}
                      </div>
                    )}

                    {attendance.tasks && (
                      <div className="line-clamp-2">
                        <span className="font-medium">やること:</span> {attendance.tasks}
                      </div>
                    )}

                    {attendance.consultation && (
                      <div className="line-clamp-1">
                        <span className="font-medium">相談:</span> {attendance.consultation}
                      </div>
                    )}
                  </div>
                )}

                {!attendance && (
                  <p className="text-xs text-red-600">この日の予定が未登録です</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
                <span>
                  出勤: {attendances.filter((a) => a.status === 'present').length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300"></div>
                <span>
                  休暇: {attendances.filter((a) => a.status === 'vacation').length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300"></div>
                <span>
                  AM休: {attendances.filter((a) => a.status === 'am_off').length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-orange-100 border border-orange-300"></div>
                <span>
                  PM休: {attendances.filter((a) => a.status === 'pm_off').length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
                <span>
                  未記入: {users.length - attendances.length}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
