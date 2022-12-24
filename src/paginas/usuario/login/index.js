
import { useEffect, useState } from 'react';
import { firebase, auth } from '../../../service/firebase'

export default function Login() {

    useEffect(()=>{
        
        loginGoogle();

    }, [])
    
    const loginGoogle = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
    }

    const loginFacebook = async () => {
        /* */
    }

}