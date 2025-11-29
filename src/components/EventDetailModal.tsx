'use client';

import { Event, User } from '@/types';

type EventDetailModalProps = {
  event: Event;
  users: User[];
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
};

export default function EventDetailModal({
  event,
  users,
  onEdit,
  onDelete,
  onClose,
}: EventDetailModalProps) {
  const user = users.find((u) => u.id === event.userId);

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">{event.title}</h2>

        <div className="space-y-3 mb-6">
          <div>
            <div className="text-sm font-medium text-gray-500">メンバー</div>
            <div className="text-base">{user?.name || '不明'}</div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-500">開始</div>
            <div className="text-base">{formatDateTime(event.startTime)}</div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-500">終了</div>
            <div className="text-base">{formatDateTime(event.endTime)}</div>
          </div>

          {event.description && (
            <div>
              <div className="text-sm font-medium text-gray-500">説明</div>
              <div className="text-base whitespace-pre-wrap">
                {event.description}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            閉じる
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            編集
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
