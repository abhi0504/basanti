import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

 const firebaseConfig = {
    apiKey: "AIzaSyB7MHU6nI9hyLUcSm4-RhlbngUHd7O43y4",
    authDomain: "basanti-16b3b.firebaseapp.com",
    projectId: "basanti-16b3b",
    storageBucket: "basanti-16b3b.appspot.com",
    messagingSenderId: "500341814858",
    appId: "1:500341814858:web:83e5b193b1b9df4cf158b3",
    measurementId: "G-Y3F37933JP"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const provider = new GoogleAuthProvider()



export{auth, provider}