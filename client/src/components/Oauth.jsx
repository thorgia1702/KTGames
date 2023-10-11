import React from "react";
import "./Styles.css";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from "../firebase";
import { useDispatch } from 'react-redux';
import { signInSuccess} from '../redux/user/userSlice';
import { Link, useNavigate } from "react-router-dom";

export default function Oauth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);


            const result = await signInWithPopup(auth, provider);

            const res = await fetch('api/auth/google',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: result.user.displayName, email: result.user.email, photo: result.user.photoURL })
            })
            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate("/");
        } catch (error) {
            console.log('Could not sign in with Google', error);
        }
    }

  return (
    <button className="Oauthbtn" type="button" onClick={handleGoogleSignIn}>
      CONTINUE WITH GOOGLE
    </button>
  );
}
