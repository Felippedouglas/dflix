
import { useEffect } from 'react';
import { firebase } from '../../../service/firebase'

export default function Logout() {

    useEffect(()=>{
        
        logout();
        
    }, [])
    
    const logout = async () => {
        
        firebase.auth().signOut().then(() => {
            window.location.reload();
        }).catch(() =>{
            alert("Erro ao fazer logout")
        })
    }

}