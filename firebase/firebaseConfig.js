// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDLc0XFIzdrqMwGB1zvKjWaluz90BlYPb8",
    authDomain: "react-native-ruidos-blancos.firebaseapp.com",
    databaseURL:
        "https://react-native-ruidos-blancos-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "react-native-ruidos-blancos",
    storageBucket: "react-native-ruidos-blancos.appspot.com",
    messagingSenderId: "117067558707",
    appId: "1:117067558707:web:744fb69c554520730d9846",
    measurementId: "G-ETR3PDWC66",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
