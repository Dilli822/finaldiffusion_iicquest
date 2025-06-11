// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "AIzaSyBTF2FJygDtgbQoaYuMe65diXsbsUJidpU",
//   authDomain: "pushnotification-d16d6.firebaseapp.com",
//   projectId: "pushnotification-d16d6",
//   storageBucket: "pushnotification-d16d6.appspot.com",
//   messagingSenderId: "715369045957",
//   appId: "1:715369045957:web:af76c18f82b121c67df5ac",
//   measurementId: "G-LS3Z0SGZNQ",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);

// export const generateToken = async () => {
//   const permission = await Notification.requestPermission();
//   if (permission === "granted") {
//     //Generate Token
//     const token = await getToken(messaging, {
//       vapidKey:
//         "BOcQRPcDPYqrpXy7efmCPZ8JLz_6aVDY8oaeHmB1wtb4vLfdKdom-ydHP4o74PE37ib0teuzbr6amoAoRZTWcS0",
//     });
//     console.log(token);
//   } else if (permission === "denied") {
//     alert("You denied for notification");
//   }
// };
