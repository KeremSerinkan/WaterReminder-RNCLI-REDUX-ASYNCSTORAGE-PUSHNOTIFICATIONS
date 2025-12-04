import * as admin from "firebase-admin";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {getFirestore} from "firebase-admin/firestore";
import {getMessaging} from "firebase-admin/messaging";
import * as logger from "firebase-functions/logger";

admin.initializeApp();

// Her dakika çalışacak (cron job)
export const checkReminders = onSchedule("every 1 minutes", async () => {
  logger.log("Running scheduled reminder check...");

  const db = getFirestore();
  const devicesSnap = await db.collection("Devices").get();
  const now = Date.now();

  const promises: Promise<any>[] = [];

  devicesSnap.forEach((doc) => {
    const data = doc.data();
    const {fcmToken, interval, enabled, lastSent} = data;

    if (!enabled) return;

    const last = lastSent?.toMillis?.() || 0;
    const diffMinutes = (now - last) / (1000 * 60);

    if (diffMinutes >= interval) {
      logger.log(`Sending reminder to ${fcmToken}`);

      const message = {
        token: fcmToken,
        notification: {
          title: "Su İçme Zamanı 💧",
          body: "Haydi bir bardak su iç!",
        },
      };

      const sendPromise = getMessaging()
        .send(message)
        .then(() => {
          return doc.ref.update({
            lastSent: admin.firestore.Timestamp.now(),
          });
        })
        .catch((err) => {
          logger.error("Send failed:", err);
        });

      promises.push(sendPromise);
    }
  });

  await Promise.all(promises);
  logger.log("Completed reminder cycle.");
});
