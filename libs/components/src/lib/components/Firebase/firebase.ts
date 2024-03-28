import firebase from 'firebase/app';
import { initializeApp } from 'firebase/app';
import 'firebase/messaging';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
const firebaseConfig = {
  apiKey: 'AIzaSyAzgF6LfHVWzlr9gGHWU7emix2768wSGHg',
  authDomain: 'mezon-772fa.firebaseapp.com',
  projectId: 'mezon-772fa',
  storageBucket: 'mezon-772fa.appspot.com',
  messagingSenderId: '285548761692',
  appId: '1:285548761692:web:3ca531af1deecee74e0c99',
  measurementId: 'G-0WNQTXVMT3',
};

initializeApp(firebaseConfig);

const messaging = getMessaging();
export const requestForToken = async () => {
  let currentToken = '';
  try {
    currentToken = await getToken(messaging, { vapidKey: "BLHZ5mS8qWRxw4Psmpq9QEavz1B8rYgmkWeJ9CCSDR-g-NjfYWpmfi_t2IV4dJLx2X76p2sApyISytUVtD64nfs"});
  } catch (error) {
    console.log('err get token.', error);
  }
  return currentToken;
};
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload: any) => {
      resolve(payload);
    });
  });
