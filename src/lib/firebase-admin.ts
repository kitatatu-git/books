import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';
import * as fs from 'fs';

if (!admin.apps.length) {
  try {
    // Vercel用：JSON文字列の環境変数から初期化
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON;
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (serviceAccountJson) {
      // Vercel本番環境：環境変数からJSON文字列を読み込み
      try {
        const serviceAccountKey = JSON.parse(serviceAccountJson);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccountKey),
        });
        console.log('✅ Firebase Admin initialized with service account (from env)');
      } catch (parseError) {
        console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY_JSON:', parseError);
        admin.initializeApp();
      }
    } else if (serviceAccountPath) {
      // ローカル開発環境：ファイルパスから読み込み
      try {
        const absolutePath = path.resolve(process.cwd(), serviceAccountPath);

        if (fs.existsSync(absolutePath)) {
          const serviceAccountKey = JSON.parse(
            fs.readFileSync(absolutePath, 'utf8')
          );
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccountKey),
          });
          console.log('✅ Firebase Admin initialized with service account (from file)');
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
      // 環境変数が設定されていない場合
      console.warn('⚠️ Neither FIREBASE_SERVICE_ACCOUNT_KEY_JSON nor FIREBASE_SERVICE_ACCOUNT_KEY is set');
      console.warn('⚠️ Firestore operations may fail. Please set up Firebase credentials.');
      admin.initializeApp();
    }
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    admin.initializeApp();
  }
}

export const firestore = getFirestore();
export { admin };

// Firestore Timestamp型のユーティリティ
export const FieldValue = admin.firestore.FieldValue;
export const Timestamp = admin.firestore.Timestamp;
