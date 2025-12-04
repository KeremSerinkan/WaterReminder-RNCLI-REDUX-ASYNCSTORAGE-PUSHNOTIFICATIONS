import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import { Platform, PermissionsAndroid } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../data/redux/store';

// =====================
// ANDROID PERMISSION
// =====================
const requestAndroidPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  );

  console.log("Android permission:", granted);
};

// =====================
// iOS PERMISSION
// =====================
const requestIOSPermission = async () => {
  const auth = await messaging().requestPermission();
  console.log("iOS permission:", auth);
};

// =====================
// Firestore Save
// =====================
const saveToFirestore = async (token: string, enabled: boolean, interval: number) => {
  try {
    await firestore().collection('Devices').doc(token).set(
      {
        fcmToken: token,
        enabled,
        interval,
        lastSent: new Date(0),
        updatedAt: Date.now(),
      },
      { merge: true }
    );

    console.log("Saved to Firestore:", enabled, interval);
  } catch (e) {
    console.log("Firestore save error:", e);
  }
};

export const useNotificationManager = () => {
  const { enabled, intervalMinutes } = useSelector(
    (state: RootState) => state.notification
  );

  useEffect(() => {
    const init = async () => {
      if (Platform.OS === 'android') await requestAndroidPermission();
      if (Platform.OS === 'ios') await requestIOSPermission();

      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();

      // İlk kayıt
      await saveToFirestore(token, enabled, intervalMinutes);

      // Token yenilenirse tekrar kaydet
      messaging().onTokenRefresh(async (newToken) => {
        await saveToFirestore(newToken, enabled, intervalMinutes);
      });
    };

    init();
  }, []);

  // Settings değiştiğinde Firestore'a yaz
  useEffect(() => {
    const updateSettings = async () => {
      const token = await messaging().getToken();
      await saveToFirestore(token, enabled, intervalMinutes);
    };

    updateSettings();
  }, [enabled, intervalMinutes]);
};
