import * as admin from "firebase-admin";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {getFirestore} from "firebase-admin/firestore";
import {getMessaging} from "firebase-admin/messaging";
import * as logger from "firebase-functions/logger";

admin.initializeApp();

// Notification message templates - friendly & casual tone
const NOTIFICATION_MESSAGES = {
  morning: [
    {
      title: "Good morning! 🌅",
      body: "Start your day with a refreshing glass of water",
    },
    {
      title: "Rise and hydrate! ☀️",
      body: "Your body will thank you for that first sip",
    },
    {
      title: "Morning water check! 💧",
      body: "Have you had your first drink today?",
    },
  ],
  afternoon: [
    {
      title: "Afternoon check-in! 🌤️",
      body: "Time for a quick water break",
    },
    {
      title: "Hey there! 👋",
      body: "Don't forget to stay hydrated this afternoon",
    },
    {
      title: "Hydration break! 💦",
      body: "A glass of water will boost your energy",
    },
    {
      title: "Quick reminder! 💧",
      body: "Have you had water recently?",
    },
  ],
  evening: [
    {
      title: "Evening reminder! 🌙",
      body: "Stay hydrated before winding down",
    },
    {
      title: "Almost done for today! 🌆",
      body: "One more glass to hit your goal?",
    },
    {
      title: "Evening water time! 💧",
      body: "Keep up the good work, stay hydrated",
    },
  ],
  general: [
    {
      title: "Water break time! 💧",
      body: "Your plants need water, and so do you!",
    },
    {
      title: "Hydration station calling! 🚰",
      body: "Time to refill your water bottle",
    },
    {
      title: "Beep boop! 🤖",
      body: "This is your friendly water reminder",
    },
    {
      title: "Stay refreshed! 💦",
      body: "A little water goes a long way",
    },
    {
      title: "Thirsty? 💧",
      body: "Your body could use some hydration right now",
    },
  ],
};

/**
 * Get time period based on current hour
 * @return {string} The time period: morning, afternoon, evening, or general
 */
function getTimePeriod(): "morning" | "afternoon" | "evening" | "general" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "general";
}

/**
 * Get a random notification message based on time of day
 * @return {object} Object with title and body strings
 */
function getRandomMessage(): {title: string; body: string} {
  const period = getTimePeriod();
  const messages = NOTIFICATION_MESSAGES[period];
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

// Optimized scheduler - runs every 5 minutes (80% cost reduction)
export const checkReminders = onSchedule("every 5 minutes", async () => {
  logger.info("Running scheduled reminder check...");

  const db = getFirestore();
  const now = Date.now();

  // Query optimization: only fetch enabled devices
  const devicesSnap = await db
    .collection("Devices")
    .where("enabled", "==", true)
    .get();

  if (devicesSnap.empty) {
    logger.info("No enabled devices found.");
    return;
  }

  logger.info(`Found ${devicesSnap.size} enabled devices.`);

  const sendPromises: Promise<void>[] = [];
  const cleanupPromises: Promise<void>[] = [];

  devicesSnap.forEach((doc) => {
    const data = doc.data();
    const {fcmToken, interval, lastSent} = data;

    if (!fcmToken) {
      logger.warn(`Device ${doc.id} has no FCM token, skipping.`);
      return;
    }

    const last = lastSent?.toMillis?.() || 0;
    const diffMinutes = (now - last) / (1000 * 60);

    // Check if enough time has passed based on interval
    if (diffMinutes >= interval) {
      const notificationContent = getRandomMessage();

      const message = {
        token: fcmToken,
        notification: notificationContent,
        android: {
          priority: "high" as const,
          notification: {
            channelId: "water_reminders",
            icon: "ic_notification",
          },
        },
        apns: {
          payload: {
            aps: {
              sound: "default",
              badge: 1,
            },
          },
        },
      };

      const sendPromise = getMessaging()
        .send(message)
        .then(() => {
          logger.info(`Sent reminder to device ${doc.id}`);
          return doc.ref.update({
            lastSent: admin.firestore.Timestamp.now(),
          });
        })
        .then(() => undefined)
        .catch((err: Error & {code?: string}) => {
          logger.error(`Send failed for ${doc.id}:`, err.message);

          // Clean up invalid tokens
          if (
            err.code === "messaging/invalid-registration-token" ||
            err.code === "messaging/registration-token-not-registered"
          ) {
            logger.warn(`Removing invalid token for ${doc.id}`);
            const cleanupPromise = doc.ref
              .delete()
              .then(() => {
                logger.info(`Deleted ${doc.id} with invalid token.`);
              })
              .catch((deleteErr) => {
                logger.error(`Failed to delete ${doc.id}:`, deleteErr);
              });
            cleanupPromises.push(cleanupPromise);
          }
        });

      sendPromises.push(sendPromise);
    }
  });

  // Wait for all send operations
  await Promise.all(sendPromises);

  // Wait for cleanup operations
  if (cleanupPromises.length > 0) {
    await Promise.all(cleanupPromises);
    logger.info(`Cleaned up ${cleanupPromises.length} invalid tokens.`);
  }

  const count = sendPromises.length;
  logger.info(`Completed reminder cycle. Sent ${count} reminders.`);
});
