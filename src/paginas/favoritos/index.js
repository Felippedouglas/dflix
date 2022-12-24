import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './style.css';
import LogoGoogle from '../../componentes/imgs/logo-google.png';
import Alert from "../../componentes/alert";
import { AppFirebase } from "../../service/firebase";
import Usuario from "../usuario";
import { collection, deleteDoc, doc, getDocs, getFirestore } from "firebase/firestore";

export default function Favoritos() {

    const [ user, setUser ] = useState({});
    
    document.title = 'Meus Favoritos - DLFIX';
    
    const [ alert, setAlert ] = useState(false);
    const [ alertTitle, setAlertTitle ] = useState();
    const [ alertMessage, setAlertMessage ] = useState();

    const [ favoritos, setFavoritos ] = useState([]);
    const [ favoritosLength, setFavoritosLength ] = useState();
    const [ economiaInternet, setEconomiaInternet ] = useState();
    
    const [ idioma, setIdioma ] = useState();
    
    useEffect(() => {

        const database = getFirestore(AppFirebase);
        const favoritosCollectionRef = collection(database, `users/${user.uid}/favoritos`);
        
        document.getElementById("content-favoritos").style.display = 'block';
    
        setEconomiaInternet(localStorage.getItem('economia'));

        const getFavoritos = async () => {
            const data = await getDocs(favoritosCollectionRef);
            setFavoritos(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
            setFavoritosLength(data.docs.map((doc) => ({...doc.data(), id: doc.id})).length);
        }
        
        getFavoritos();

        setIdioma(localStorage.getItem('idioma') || 'portugues')
    }, [user]);

    async function removerFavoritos(e) {
        document.getElementById(e).style.display = 'none';

        const database = getFirestore(AppFirebase);
        setFavoritosLength(favoritosLength - 1);
        
        setAlertTitle('Favoritos')
        setAlertMessage(`Removido dos favoritos! `);
        
        await deleteDoc(doc(database, 'users', user.uid, 'favoritos', e));

        if (!alert) {
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
            }, 5000)
        }

    }
    
    const converter = (minutos) => {
        const horas = Math.floor(minutos/ 60);
        const min = minutos % 60;
        const textoHoras = (`${horas}`);
        const textoMinutos = (`${min}`);

        if (minutos <= 59) {
            return `${textoMinutos}min`;
        } else {
            return `${textoHoras }h, ${textoMinutos}min`;
        }
        
    };

    return (
        <div className="content-favoritos" id="content-favoritos">

            <Usuario setUser={setUser}/>

            <Alert alert={alert} alertTitle={alertTitle} alertMessage={alertMessage}/>
            
            <h2 className="h2-titulo-generos">{idioma == 'portugues' ? 'favoritos' : 'favorites'}</h2>
            {favoritos.map(favorito => {
                return (
                    <div className="div-favoritos" id={favorito.imdbId} key={`${favorito.name}-${favorito.data}-${favorito.hora}`} style={{backgroundImage: !economiaInternet ? `url(${favorito.imgBackground})` : `url('')`}}>
                        <div className="favoritos" style={{backgroundImage: economiaInternet && `linear-gradient(to right, #181818, #252525)`}}>
                            <section className="section-img-favoritos">
                                <img src={favorito.img} alt={favorito.name}/>
                            </section>
                            <section className="section-informacoes-favoritos">
                                {favorito.type == 'movie' ? <span className="tipo-movie tipo-filme"> {idioma == 'portugues' ? 'Filme' : 'Movie'}</span> : <span className="tipo-movie tipo-serie"> {idioma == 'portugues' ? 'Série / tv' : 'Serie'}</span>}
                                <h3 className="h3-nome-movie">{favorito.name}</h3>
                                <section className="detalhes-movie-favoritos">
                                    <span className="span-ano">{favorito.year.slice(0,4)} </span>
                                    <span className="span-avaliacao"> | <i className="fas fa-star"></i> {Number(favorito.vote_average).toFixed(1)} </span>
                                    {(favorito.runtime.length > 1 || favorito.runtime == '') ?
                                        <span> | <i className="fa-regular fa-clock"></i> 60min </span>
                                    :   <span> | <i className="fa-regular fa-clock"></i> {converter(favorito.runtime)} </span>
                                }
                                </section>
                                <section className="section-bts-assistir-remover">
                                    <Link to={`/assistir=${favorito.type}&${favorito.idMovie}`}><i className="fa-solid fa-play"></i> {idioma == 'portugues' ? 'Assistir' : 'Watch'}</Link>
                                    <button onClick={()=>removerFavoritos(favorito.imdbId)}><i className="fa-solid fa-trash"></i> {idioma == 'portugues' ? 'Excluir' : 'Delete'}</button>
                                </section>
                            </section>
                        </div>
                    </div>
                    )
                })
            }
            {favoritosLength == 0 && 
                <div className="content-sem-favoritos">
                    <span>Não há favoritos!</span>
                    <Link to='/conta'><img src={LogoGoogle} alt='google'/>Login com Google</Link>
                </div>
            }
        </div>
    )
}