"use client";

import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "./firebase";
import { saveFCMToken } from "@/services/push/push.service";

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    throw new Error("Este navegador no soporta notificaciones");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Permiso denegado");
  }

  const messaging = await getFirebaseMessaging();
  if (!messaging) {
    throw new Error("Firebase Messaging no soportado");
  }

  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
  });

  if (token){
    console.log("FCM TOKEN: " , token);
    await saveFCMToken(token);
  }

  return token;
};
