import { Link } from 'react-router-dom';
import $ from 'jquery';
import './style.css';
import { useEffect, useState } from 'react';
import { AppFirebase } from '../../../../service/firebase';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default function Notificacoes(props) {

    const [ idioma, setIdioma ] = useState();
    const [ notifications, setNotifications ] = useState([]);

    const database = getFirestore(AppFirebase);
    const notificationsCollectionRef = collection(database, "notifications");
    
    useEffect(()=> {
        var idioma = localStorage.getItem('idioma') || 'portugues';
        setIdioma(idioma);

        const getNotifications = async () => {
            const data = await getDocs(notificationsCollectionRef);
            setNotifications(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        }
        
        getNotifications();
    }, [])

    $(document).mouseup(function(e) {
        var container = $(".content-notificacoes");

        if (!container.is(e.target) && container.has(e.target).length === 0) {
            props.setExibirNotificacoes(false);
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '0';
        }
    });

    return(
        <>
            <div className="content-notificacoes" id="content-notificacoes" style={props.exibirNotificacoes ? {display: 'block'} : {display: 'none'}}>
                <header>
                    <span>{idioma == 'portugues' ? 'Notificações' : 'Notifications'}</span>
                </header>
                <main className='notificacoes'>
                    {notifications.reverse().map((notificacao, key)=>{
                        return (
                            <Link key={key} to={`assistir=${notificacao.tipo}&${notificacao.idMovie}`} onClick={()=>props.setExibirNotificacoes(!props.exibirNotificacoes)} className="link-movie-notificacao">
                                <img loading="lazy"
                                    src={notificacao.img}
                                    alt={notificacao.nome} className="img-movie-notificacao"/>
                                <section>
                                    <p className="paragrafo-da-notificacao"><strong className='movie-name-strong'>{notificacao.nome}</strong><small>{notificacao.temporada}</small></p>
                                    <p className="data-notificacao-enviada">{notificacao.data}</p>
                                </section>
                                <span className="ponto-notificacao"></span>
                            </Link>
                        )
                    })}
                </main>
                
            </div>
        </>
    )
}