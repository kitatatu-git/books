'use client';

import { Event, User } from '@/types';

type CalendarProps = {
  events: Event[];
  users: User[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onEventClick: (event: Event) => void;
  onDateClick: (date: Date) => void;
};

export default function Calendar({
  events,
  users,
  currentDate,
  onDateChange,
  onEventClick,
  onDateClick,
}: CalendarProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const prevMonth = () => {
    onDateChange(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    onDateChange(new Date(year, month + 1, 1));
  };

  const getDayEvents = (day: number) => {
    const date = new Date(year, month, day);
    return events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return (
        eventDate.getFullYear() === year &&
        eventDate.getMonth() === month &&
        eventDate.getDate() === day
      );
    });
  };

  const getUserColor = (userId: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
    ];
    return colors[userId % colors.length];
  };

  const days = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getDayEvents(day);
    days.push(
      <div
        key={day}
        className="h-24 border border-gray-200 p-1 overflow-y-auto cursor-pointer hover:bg-gray-50"
        onClick={() => onDateClick(new Date(year, month, day))}
      >
        <div className="font-semibold text-sm mb-1">{day}</div>
        <div className="space-y-1">
          {dayEvents.map((event) => {
            const user = users.find((u) => u.id === event.userId);
            return (
              <div
                key={event.id}
                className={`text-xs p-1 rounded ${getUserColor(event.userId)} text-white truncate cursor-pointer`}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(event);
                }}
                title={`${event.title} - ${user?.name}`}
              >
                {event.title}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          前月
        </button>
        <h2 className="text-xl font-bold">
          {year}年 {month + 1}月
        </h2>
        <button
          onClick={nextMonth}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          次月
        </button>
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
        {days}
      </div>
    </div>
  );
}
