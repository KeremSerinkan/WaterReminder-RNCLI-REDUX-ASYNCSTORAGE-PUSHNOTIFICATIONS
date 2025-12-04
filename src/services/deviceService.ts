import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

export const saveDeviceSettings = async (interval: number, enabled: boolean) => {

  try {
    const fcmToken = await messaging().getToken();

    const deviceRef = firestore().collection('Devices').doc(fcmToken);

    await deviceRef.set({
      fcmToken,
      interval,
      enabled,
      lastSent: new Date(0), // ilk kurulum
    }, { merge: true });

    console.log("Device settings saved to Firestore");
  } catch (err) {
    console.log("Failed to save device settings", err);
  }
};
