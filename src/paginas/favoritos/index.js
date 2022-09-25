import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './style.css';
import backgroundErro from '../../componentes/imgs/img-erro-background-pessoa.png';
import Alert from "../../componentes/alert";

export default function Favoritos() {
    
    document.title = 'Meus Favoritos - DLFIX';
    
    const [ alert, setAlert ] = useState(false);
    const [ alertTitle, setAlertTitle ] = useState();
    const [ alertMessage, setAlertMessage ] = useState();

    const [ favoritos, setFavoritos ] = useState([]);
    const [ favoritosLength, setFavoritosLength ] = useState();
    const [ economiaInternet, setEconomiaInternet ] = useState();
    
    useEffect(() => {
        const favoritosLocalStorage = JSON.parse(localStorage.getItem('favoritos') || "[]");
        setFavoritos(favoritosLocalStorage);
        document.getElementById("content-favoritos").style.display = 'block';
        setFavoritosLength(JSON.parse(localStorage.getItem('favoritos') || "[]").length)
    
        setEconomiaInternet(localStorage.getItem('economia'))
    }, [favoritosLength]);

    function removerFavoritos(e) {
      let favoritos = JSON.parse(localStorage.getItem('favoritos'));
      if (favoritos != '') {
        setTimeout(()=>{
            favoritos.splice(e,1)
            localStorage.setItem('favoritos', JSON.stringify(favoritos));
            setFavoritosLength(favoritosLength - 1)
        }, 100)
      }

      if (!alert) {
          setAlert(true)
          setTimeout(()=>{
              setAlert(false)
          }, 5000)
      }
      setAlertTitle('Favoritos')
      setAlertMessage(`"${favoritos[e].name}" Foi removidoo dos favoritos! `);
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

            <Alert alert={alert} alertTitle={alertTitle} alertMessage={alertMessage}/>
            
            <h2 className="h2-titulo-generos">favoritos</h2>
            {favoritos.map(favorito => {
                return (
                    <div className="div-favoritos" style={{backgroundImage: !economiaInternet ? `url(${favorito.imgBackground})` : `url('')`}}>
                        <div className="favoritos" style={{backgroundImage: economiaInternet && `linear-gradient(to right, #181818, #252525)`}}>
                            <section className="section-img-favoritos">
                                <img src={favorito.img} alt={favorito.name}/>
                            </section>
                            <section className="section-informacoes-favoritos">
                                {favorito.type == 'movie' ? <span className="tipo-movie tipo-filme">Filme</span> : <span className="tipo-movie tipo-serie">Série / tv</span>}
                                <h3 className="h3-nome-movie">{favorito.name}</h3>
                                <section className="detalhes-movie-favoritos">
                                    <span className="span-ano">{favorito.year} </span>
                                    <span className="span-avaliacao"> | <i className="fas fa-star"></i> {Number(favorito.vote_average).toFixed(1)} </span>
                                    <span> | <i class="fa-solid fa-clock-rotate-left"></i> {converter(favorito.runtime)} </span>
                                </section>
                                <section className="section-bts-assistir-remover">
                                    <Link to={`/assistir=${favorito.type}&${favorito.id}`}><i class="fa-solid fa-play"></i></Link>
                                    <button onClick={()=>removerFavoritos(favoritos.findIndex( (element) => element.imdbId == favorito.imdbId))}><i class="fa-solid fa-trash"></i></button>
                                </section>
                            </section>
                        </div>
                    </div>
                    )
                })
            }
            {favoritos == '' && 
                <div className="content-sem-favoritos">
                    <span>Não há favoritos!</span>
                </div>
            }
        </div>
    )
}