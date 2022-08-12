import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './style.css'

export default function Favoritos() {
    
    document.title = 'Meus Favoritos - DLFIX';

    const [ favoritos, setFavoritos ] = useState([]);
    
    useEffect(() => {
        const favoritosLocalStorage = JSON.parse(localStorage.getItem('favoritos') || "[]");
        setFavoritos(favoritosLocalStorage);
    }, [favoritos]);

    function removerFavoritos(e) {
      let favoritos = JSON.parse(localStorage.getItem('favoritos'));
      if (favoritos != '') {
        favoritos.splice(e,1)
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
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
        <div className="content-favoritos">
        <h2 className="h2-titulo-generos">favoritos</h2>
        {favoritos.map(favorito => {
            return (
                <div className="div-favoritos" style={{backgroundImage: `url(${favorito.imgBackground})`}}>
                    <div className="favoritos">
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
                                <button onClick={()=>removerFavoritos(favoritos.findIndex( (element) => element.imdbId == favorito.imdbId))}><i class="fa-solid fa-heart-crack"></i></button>
                            </section>
                        </section>
                    </div>
                </div>
                )
            })}
            {favoritos == '' && 
                <div className="content-sem-favoritos">
                    <span>Não há favoritos!</span>
                </div>
            }
        </div>
    )
}