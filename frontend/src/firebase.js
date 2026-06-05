import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAUSGrFaY3JJMMNtnK-VdIqIXRL88ACGAo",
  authDomain: "ai-career-roadmap-6c4ca.firebaseapp.com",
  projectId: "ai-career-roadmap-6c4ca",
  storageBucket: "ai-career-roadmap-6c4ca.firebasestorage.app",
  messagingSenderId: "526582603496",
  appId: "1:526582603496:web:29c41a01c3682fceb0335d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);