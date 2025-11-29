import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="flex justify-end gap-4 mb-8">
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ログイン
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            新規登録
          </Link>
        </div>
        <h1 className="text-5xl font-bold text-center mb-4 text-gray-800">
          アプリケーション メニュー
        </h1>
        <p className="text-center text-gray-600 mb-12">
          使いたいアプリケーションを選択してください
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* チーム管理アプリ */}
          <Link href="/team-management">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-blue-500">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">
                チーム管理システム
              </h2>
              <p className="text-gray-600 mb-4">
                メンバーの出勤状況を管理し、チームのスケジュールを可視化します
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• 出勤・休暇管理</li>
                <li>• カレンダー表示</li>
                <li>• メンバー管理</li>
              </ul>
            </div>
          </Link>

          {/* 読書記録アプリ */}
          <Link href="/reading-log">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-green-500">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">
                読書記録アプリ
              </h2>
              <p className="text-gray-600 mb-4">
                読んだ本を記録し、読書の習慣を楽しく管理します
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• 読書記録の登録</li>
                <li>• 読書リスト管理</li>
                <li>• 読書統計</li>
              </ul>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
