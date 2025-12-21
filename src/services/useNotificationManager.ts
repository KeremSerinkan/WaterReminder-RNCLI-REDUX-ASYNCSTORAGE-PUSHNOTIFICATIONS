import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../data/redux/store';

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

// =====================
// Hook
// =====================
export const useNotificationManager = () => {
  const { enabled, intervalMinutes } = useSelector(
    (state: RootState) => state.notification
  );

  useEffect(() => {
    const init = async () => {
      try {
        // -----------------
        // Android izin kontrolü
        // -----------------
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Android notification permission denied");
            return; // izin verilmediyse token alma
          }
        }

        // -----------------
        // iOS izin
        // -----------------
        if (Platform.OS === 'ios') {
          const authStatus = await messaging().requestPermission();
          if (
            authStatus !== messaging.AuthorizationStatus.AUTHORIZED &&
            authStatus !== messaging.AuthorizationStatus.PROVISIONAL
          ) {
            console.log("iOS notification permission denied");
            return;
          }
        }

        // -----------------
        // Cihazı remote mesajlar için kaydet
        // -----------------
        await messaging().registerDeviceForRemoteMessages();

        // -----------------
        // Token al ve kaydet
        // -----------------
        const token = await messaging().getToken();
        console.log("FCM Token:", token);
        await saveToFirestore(token, enabled, intervalMinutes);

        // -----------------
        // Token yenilenirse tekrar kaydet
        // -----------------
        messaging().onTokenRefresh(async (newToken) => {
          console.log("FCM Token refreshed:", newToken);
          await saveToFirestore(newToken, enabled, intervalMinutes);
        });
      } catch (e) {
        console.log("Notification init error:", e);
      }
    };

    init();
  }, []);

  // -----------------
  // Ayarlar değiştiğinde Firestore'u güncelle
  // -----------------
  useEffect(() => {
    const updateSettings = async () => {
      try {
        const token = await messaging().getToken();
        await saveToFirestore(token, enabled, intervalMinutes);
      } catch (e) {
        console.log("Update settings error:", e);
      }
    };

    updateSettings();
  }, [enabled, intervalMinutes]);
};
