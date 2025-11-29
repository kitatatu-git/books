'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MemberManager from '@/components/MemberManager';
import AttendanceForm from '@/components/AttendanceForm';
import DailyAttendanceList from '@/components/DailyAttendanceList';
import { User, Attendance } from '@/types';

type Tab = 'calendar' | 'attendance';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('calendar');
  const [users, setUsers] = useState<User[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(null);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    fetchUsers();
    fetchAttendances();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchAttendances = async (date?: string) => {
    try {
      const url = date ? `/api/attendance?date=${date}` : '/api/attendance';
      const res = await fetch(url);
      const data = await res.json();
      setAttendances(data);
    } catch (error) {
      console.error('Failed to fetch attendances:', error);
    }
  };

  const handleAddMember = async (name: string) => {
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to add member:', error);
    }
  };

  const handleCreateAttendance = async (
    attendanceData: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceData),
      });
      if (res.ok) {
        fetchAttendances(attendanceDate);
        setShowAttendanceForm(false);
      }
    } catch (error) {
      console.error('Failed to create attendance:', error);
    }
  };

  const handleUpdateAttendance = async (
    attendanceData: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!editingAttendance) return;

    try {
      const res = await fetch(`/api/attendance/${editingAttendance.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceData),
      });
      if (res.ok) {
        fetchAttendances(attendanceDate);
        setEditingAttendance(null);
      }
    } catch (error) {
      console.error('Failed to update attendance:', error);
    }
  };

  const handleDateClick = (dateStr: string) => {
    setAttendanceDate(dateStr);
    setActiveTab('attendance');
    fetchAttendances(dateStr);
  };

  // カレンダー表示用の出勤データを日付ごとに整理
  const getAttendancesByMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // その月のすべての出勤記録を取得するためにフィルタ
    return attendances.filter((a) => {
      const date = new Date(a.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const monthAttendances = getAttendancesByMonth();

    const getDayAttendances = (day: number) => {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return monthAttendances.filter((a) => a.date === dateStr);
    };

    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 border border-gray-200 bg-gray-50"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayAttendances = getDayAttendances(day);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      const statusSummary: { [key: string]: string[] } = {
        vacation: [],
        am_off: [],
        pm_off: [],
      };

      dayAttendances.forEach((a) => {
        const user = users.find((u) => u.id === a.userId);
        if (user && a.status !== 'present') {
          statusSummary[a.status].push(user.name);
        }
      });

      days.push(
        <div
          key={day}
          className="h-32 border border-gray-200 p-2 overflow-y-auto cursor-pointer hover:bg-blue-50 transition-colors"
          onClick={() => handleDateClick(dateStr)}
        >
          <div className="flex justify-between items-start mb-1">
            <div className="font-semibold text-sm">{day}</div>
            {dayAttendances.length > 0 && (
              <div className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                {dayAttendances.length}/{users.length}人
              </div>
            )}
          </div>
          <div className="space-y-1 text-xs">
            {statusSummary.vacation.length > 0 && (
              <div className="text-gray-600">
                <span className="font-medium">休暇:</span> {statusSummary.vacation.join(', ')}
              </div>
            )}
            {statusSummary.am_off.length > 0 && (
              <div className="text-yellow-700">
                <span className="font-medium">AM休:</span> {statusSummary.am_off.join(', ')}
              </div>
            )}
            {statusSummary.pm_off.length > 0 && (
              <div className="text-orange-700">
                <span className="font-medium">PM休:</span> {statusSummary.pm_off.join(', ')}
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const prevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            チーム管理システム
          </h1>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            メニューに戻る
          </Link>
        </div>

        {/* タブ */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg shadow p-1 flex space-x-1">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-6 py-2 rounded font-medium transition-colors ${
                activeTab === 'calendar'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              カレンダー
            </button>
            <button
              onClick={() => {
                setActiveTab('attendance');
                fetchAttendances(attendanceDate);
              }}
              className={`px-6 py-2 rounded font-medium transition-colors ${
                activeTab === 'attendance'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              出勤管理
            </button>
          </div>
        </div>

        {/* カレンダー画面 */}
        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <div className="lg:col-span-1">
              <MemberManager users={users} onAddMember={handleAddMember} />
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={prevMonth}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    前月
                  </button>
                  <h2 className="text-xl font-bold">
                    {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
                  </h2>
                  <button
                    onClick={nextMonth}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    次月
                  </button>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  ※ 日付をクリックすると、その日の出勤管理画面に移動します
                </div>
                <div className="grid grid-cols-7 gap-0">
                  {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
                    <div
                      key={day}
                      className="text-center font-semibold py-2 border border-gray-200 bg-gray-100"
                    >
                      {day}
                    </div>
                  ))}
                  {renderCalendar()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 出勤管理画面 */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4">
              <label className="block text-sm font-medium mb-2">日付を選択</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => {
                  setAttendanceDate(e.target.value);
                  fetchAttendances(e.target.value);
                }}
                className="px-3 py-2 border border-gray-300 rounded"
              />
            </div>

            <DailyAttendanceList
              users={users}
              attendances={attendances}
              selectedDate={attendanceDate}
              onEdit={(attendance) => setEditingAttendance(attendance)}
              onAdd={() => setShowAttendanceForm(true)}
            />
          </div>
        )}

        {showAttendanceForm && !editingAttendance && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-md w-full max-h-[90vh] overflow-y-auto">
              <AttendanceForm
                users={users}
                initialDate={attendanceDate}
                onSubmit={handleCreateAttendance}
                onCancel={() => setShowAttendanceForm(false)}
              />
            </div>
          </div>
        )}

        {editingAttendance && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-md w-full max-h-[90vh] overflow-y-auto">
              <AttendanceForm
                users={users}
                attendance={editingAttendance}
                onSubmit={handleUpdateAttendance}
                onCancel={() => setEditingAttendance(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
