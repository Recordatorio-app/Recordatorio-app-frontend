importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyA15k7INupWGXxqeaSLB18jI3ziKOpnKQM",
  authDomain: "recordatorio-app-23d5c.firebaseapp.com",
  projectId: "recordatorio-app-23d5c",
  messagingSenderId: "530379786852",
  appId: "1:530379786852:web:3f17e1e4286d3c2dc56d71",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("✅ BACKGROUND MESSAGE", payload);

  if (!payload?.data) {
    console.warn("⚠️ Payload sin data", payload);
    return;
  }

  const { title, body, tag } = payload.data;

  self.registration.showNotification(title, {
    body,
    tag,
    icon: "/public/icons/notification.png",
  });
});
