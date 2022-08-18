// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDLcohnmo0JgGKjkPeDtsTci7sb7qTAHsI',
  authDomain: 'lifeoflongcovid.firebaseapp.com',
  projectId: 'lifeoflongcovid',
  storageBucket: 'lifeoflongcovid.appspot.com',
  messagingSenderId: '84098028283',
  appId: '1:84098028283:web:c1348ee4fd1725fad1165e',
  measurementId: 'G-YTLF9MXFYN',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const analytics = typeof window !== "undefined" && getAnalytics(app)
export const firestore = getFirestore(app)
