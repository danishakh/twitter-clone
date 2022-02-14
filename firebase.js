import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// web-app's firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyAjksEtpKhP4HcQNBaqf1hqyA5-97Q9NLM',
  authDomain: 'twitter-clone-7701c.firebaseapp.com',
  projectId: 'twitter-clone-7701c',
  storageBucket: 'twitter-clone-7701c.appspot.com',
  messagingSenderId: '611335617751',
  appId: '1:611335617751:web:d833f15a77269e83890492',
}

// initialize firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const storage = getStorage()

export default app
export { db, storage }
