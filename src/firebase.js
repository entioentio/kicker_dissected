// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNF32XqyJFCbauA-g38lcqXT440ESyTSI",
  authDomain: "keeker-51f52.firebaseapp.com",
  databaseURL: "https://keeker-51f52-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "keeker-51f52",
  storageBucket: "keeker-51f52.appspot.com",
  messagingSenderId: "835284069795",
  appId: "1:835284069795:web:41eafb0f37a3871c1d3e16"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



/// CREATE AND ADD .env.development file 
///  apiKey: `${process.env.APIKEY}` ... 
