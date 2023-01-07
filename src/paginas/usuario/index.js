
import './style.css';

import { firebase} from '../../service/firebase';
import { useEffect } from 'react';

export default function Usuario( { setUser, setImgUser } ) {

    useEffect(()=>{
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                setUser(user);
                setImgUser(user.photoURL);
            }
        })
    }, [])

}