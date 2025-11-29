import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';
import * as fs from 'fs';

if (!admin.apps.length) {
  try {
    // 環境変数またはサービスアカウントキーファイルから初期化
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (serviceAccountPath) {
      try {
        // プロジェクトルートからの絶対パスを解決
        const absolutePath = path.resolve(process.cwd(), serviceAccountPath);

        if (fs.existsSync(absolutePath)) {
          const serviceAccountKey = JSON.parse(
            fs.readFileSync(absolutePath, 'utf8')
          );
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccountKey),
          });
          console.log('✅ Firebase Admin initialized with service account');
        } else {
          console.warn(`⚠️ Service account file not found at: ${absolutePath}`);
          console.warn('⚠️ Using default initialization. Firestore operations may fail.');
          admin.initializeApp();
        }
      } catch (fileError) {
        console.warn('⚠️ Failed to read service account file:', fileError);
        console.warn('⚠️ Using default initialization');
        admin.initializeApp();
      }
    } else {
      // 開発環境用：秘密鍵がない場合はデフォルト初期化
      console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_KEY not set, using default initialization');
      console.warn('⚠️ Firestore operations may fail. Please set up Firebase credentials.');
      admin.initializeApp();
    }
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    // エラーでも続行（エラーは後で個別に処理）
    admin.initializeApp();
  }
}

export const firestore = getFirestore();
export { admin };

// Firestore Timestamp型のユーティリティ
export const FieldValue = admin.firestore.FieldValue;
export const Timestamp = admin.firestore.Timestamp;
