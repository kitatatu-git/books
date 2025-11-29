'use client';

import { useState, useEffect } from 'react';
import { Event, User } from '@/types';

type EventFormProps = {
  users: User[];
  event?: Event;
  initialDate?: Date;
  onSubmit: (eventData: Omit<Event, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
};

export default function EventForm({
  users,
  event,
  initialDate,
  onSubmit,
  onCancel,
}: EventFormProps) {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [startTime, setStartTime] = useState(() => {
    if (event) {
      return new Date(event.startTime).toISOString().slice(0, 16);
    }
    if (initialDate) {
      const date = new Date(initialDate);
      date.setHours(9, 0, 0, 0);
      return date.toISOString().slice(0, 16);
    }
    return '';
  });
  const [endTime, setEndTime] = useState(() => {
    if (event) {
      return new Date(event.endTime).toISOString().slice(0, 16);
    }
    if (initialDate) {
      const date = new Date(initialDate);
      date.setHours(10, 0, 0, 0);
      return date.toISOString().slice(0, 16);
    }
    return '';
  });
  const [userId, setUserId] = useState(event?.userId.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !startTime || !endTime || !userId) {
      alert('すべての必須項目を入力してください');
      return;
    }

    onSubmit({
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      userId: parseInt(userId),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">
        {event ? '予定を編集' : '予定を追加'}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">説明</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            rows={3}
          />
        </div>

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
            開始日時 <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            終了日時 <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>

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
            {event ? '更新' : '追加'}
          </button>
        </div>
      </div>
    </form>
  );
}
