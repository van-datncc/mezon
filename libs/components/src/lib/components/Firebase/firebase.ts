import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
const firebaseConfig = {
  apiKey: process.env.NX_CHAT_APP_FCM_API_KEY as string,
  authDomain: process.env.NX_CHAT_APP_FCM_AUTH_DOMAIN as string,
  projectId: process.env.NX_CHAT_APP_FCM_PROJECT_ID as string,
  storageBucket: process.env.NX_CHAT_APP_FCM_STORAGE_BUCKET as string,
  messagingSenderId: process.env.NX_CHAT_APP_FCM_MESSAGING_SENDER_ID as string,
  appId: process.env.NX_CHAT_APP_FCM_APP_ID as string,
  measurementId: process.env.NX_CHAT_APP_FCM_MEASUREMENT_ID as string,
};

initializeApp(firebaseConfig);

const messaging = getMessaging();
export const requestForToken = async () => {
  let currentToken = '';
  try {
    currentToken = await getToken(messaging, { vapidKey: process.env.NX_CHAT_APP_FCM_VAPID_KEY as string});
  } catch (error) {
    return '';
  }
  return currentToken;
};
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload: any) => {
      resolve(payload);
    });
  });
