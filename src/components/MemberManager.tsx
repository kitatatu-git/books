'use client';

import { useState } from 'react';
import { User } from '@/types';

type MemberManagerProps = {
  users: User[];
  onAddMember: (name: string) => void;
};

export default function MemberManager({
  users,
  onAddMember,
}: MemberManagerProps) {
  const [newMemberName, setNewMemberName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberName.trim()) {
      onAddMember(newMemberName.trim());
      setNewMemberName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">メンバー</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          {isAdding ? 'キャンセル' : '+ 追加'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="メンバー名"
              className="flex-1 px-3 py-2 border border-gray-300 rounded"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              追加
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {users.length === 0 ? (
          <p className="text-gray-500 text-sm">メンバーがいません</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 border border-gray-200 rounded"
            >
              <span>{user.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
