import './style.css';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { APIKey } from '../../../../config/key';
import logoMoviePrincipal from '../../../../componentes/imgs/logo-movie-principal.png'
import imgBackgroundMoviePrincipal from '../../../../componentes/imgs/background-video-movie-principal.png'

export default function MoviePrincipal() {

    const [ audioVideo, setAudioVideo ] = useState(false);
    const [ movie, setMovie ] = useState({});
    const [ filmeSerie, setFilmeSerie ] = useState('movie');
    const [ idImdb, setIdImdb ] = useState();
    const [ id, setId ] = useState(507086);
    const [ definirFilmeSerie, setDefinirFilmeSerie ] = useState();
    const image_path = 'https://image.tmdb.org/t/p/w500';


    // favoritos
    const [ favoritoIsTrue, setFavoritoIsTrue ] = useState(false);
    const [ nomeMovieFavorito, setNomeMovieFavorito ] = useState();
    const [ descriptionMovieFavorito, setDescriptionMovieFavorito ] = useState();
    const [ imgMovieFavorito, setImgMovieFavorito ] = useState();
    const [ imgBackgroundMovieFavorito, setImgBackgroundMovieFavorito ] = useState();
    const [ idMovieFavorito, setIdMovieFavorito ] = useState();
    const [ imdbIdMovieFavorito, setImdbIdMovieFavorito ] = useState();
    const [ tipoMovieFavorito, setTipoMovieFavorito ] = useState();
    const [ yearMovieFavorito, setYearMovieFavorito ] = useState();
    const [ runTimeMovieFavorito, setRunTimeMovieFavorito ] = useState();
    const [ voteAverageMovieFavorito, setVoteAverageMovieFavorito ] = useState();
    const [ favoritos, setFavoritos ] = useState()

    
    setTimeout(()=> {
        if (filmeSerie == 'movie') {
            setDefinirFilmeSerie('filme');
            setNomeMovieFavorito(movie.title)
            setYearMovieFavorito(movie.release_date.slice(0,4))
            setRunTimeMovieFavorito(movie.runtime)
        } else if (filmeSerie == 'tv') {
            setDefinirFilmeSerie('serie');
            setNomeMovieFavorito(movie.name)
            setYearMovieFavorito(movie.first_air_date.slice(0,4))
            setRunTimeMovieFavorito(movie.episode_run_time[0])
        }

        setTimeout(()=>{
            {favoritos.map(favorito => {
                if (favorito.imdbId == idImdb) {
                    setFavoritoIsTrue(true)
                }
            })
            }
        }, 1)

    }, 1);
    
    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/${filmeSerie}/${id}?api_key=${APIKey}&language=pt-BR`)
        .then(Response => Response.json())
        .then(data => {
            
            const favoritosLocalStorage = JSON.parse(localStorage.getItem('favoritos') || "[]");
            setFavoritos(favoritosLocalStorage);

            setMovie(data);
            setDescriptionMovieFavorito(data.overview)
            setImgMovieFavorito(`${image_path}${data.poster_path}`)
            setImgBackgroundMovieFavorito(`${image_path}${data.backdrop_path}`)
            setIdMovieFavorito(data.id)
            setTipoMovieFavorito(filmeSerie)
            setVoteAverageMovieFavorito(data.vote_average)
            
            setTimeout(()=>{
                if (data.title) {
                    setNomeMovieFavorito(data.title)
                } else if (data.name) {
                    setNomeMovieFavorito(data.name)
                }
            }, 100);
        });
    }, [favoritoIsTrue, favoritos]);
    
    // id imdb filme e série
    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/${filmeSerie}/${id}/external_ids?api_key=${APIKey}&language=pt-BR`)
        .then(Response => Response.json())
        .then(data => {
            setIdImdb(data.imdb_id);
            setImdbIdMovieFavorito(data.imdb_id)
            });
    }, []);

    function audioMoviePrincipal() {
        setAudioVideo(!audioVideo);
        if (audioVideo) {
            document.getElementById("video-movie-principal").muted = true;
        } else {
            document.getElementById("video-movie-principal").muted = false;
        }
    };
    
    //functions favoritos
    function salvarFavoritos() {
        let favoritos = JSON.parse(localStorage.getItem('favoritos') || "[]")
        setFavoritoIsTrue(true)
      
        let favorito = {
          name: nomeMovieFavorito,
          description: descriptionMovieFavorito,
          img: imgMovieFavorito,
          imgBackground: imgBackgroundMovieFavorito,
          type: tipoMovieFavorito,
          year: yearMovieFavorito,
          runtime: runTimeMovieFavorito,
          vote_average: voteAverageMovieFavorito,
          id: idMovieFavorito,
          imdbId: imdbIdMovieFavorito,
        }
    
        favoritos.push(favorito)
        localStorage.setItem('favoritos', JSON.stringify(favoritos))
    }
  
    function removerFavoritos(e) {
      let favoritos = JSON.parse(localStorage.getItem('favoritos'))
      
      if (favoritos) {
        setFavoritoIsTrue(false)
        favoritos.splice(e,1)
        localStorage.setItem('favoritos', JSON.stringify(favoritos))
      }

      setTimeout(()=>{
        window.location.reload()
      })
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

    return(
        <>
            <div className="content-movie-principal">
                <div className="div-video-background">
                    <video
                        id='video-movie-principal'
                        src="https://imdb-video.media-imdb.com/vi764854809/1434659607842-pgv4ql-1651159417077.mp4?Expires=1660267778&Signature=ql3Mse3hFe50bDec9-jFSWNkCNWgusSt7lCzWlxZ4OLAE0C4Fgo5QWRTH5ReF8iTfSKwttM~xFpVhMuhnJ8SZVz16Lf767ZRtsfMSsu0eNNDGp9P85zcqEHvkAzZJVbOR9x~rGA3YaSjSICTyDef2-W~1XiTjeBP2z1kDLs6B6~5ceKimoNYlbkGjmXopxBvGgfmh4W-ewjlTY9MqMXfnknmYF0oDon88kSacmTezp1C7EromOjKqZkdaRh8f3PHUgcKfABi1Uzo432aJtVhoIaqspVRPoIJbbD7lUyuNuBFCCdIcaA743h0bHv-z47uc7TwZhc1RmNwvpHZB2i3qQ__&Key-Pair-Id=APKAIFLZBVQZ24NQH3KA"
                        poster={imgBackgroundMoviePrincipal}
                        muted loop autoPlay>
                    </video>
                    <section className='section-mute-movie-principal'>
                        <button className='bt-mute-movie-principal' id='bt-mute-movie-principal' onClick={()=>audioMoviePrincipal()}>{audioVideo?<i class="fa-solid fa-volume-high"></i>:<i class="fa-solid fa-volume-xmark"></i>}</button>
                        <section className='section-classificacao-movie-principal'>
                            <span className='span-classificacao-movie-principal'>12</span>
                        </section>
                    </section>
                </div>
                <div className="div-detalhes-movie-principal">
                    <img src={logoMoviePrincipal} alt='img movie'/>
                    <section class="informacoes-movie-principal">
                        {movie.first_air_date &&
                            <span>{movie.first_air_date.slice(0,4)} |</span>
                        }
                        {movie.release_date &&
                            <span>{movie.release_date.slice(0,4)} |</span>
                        }
                        {movie.runtime &&
                            <span className="duracao-movie-assistir"><i class="fa-solid fa-clock-rotate-left"></i> {converter(movie.runtime)} |</span>
                        }
                        {movie.episode_run_time && movie.episode_run_time.length == 1 &&
                            <span className="duracao-movie-assistir"><i class="fa-solid fa-clock-rotate-left"></i> {converter(movie.episode_run_time)} (ep.) |</span>
                        }
                        <span><i class="fas fa-star"></i> {Number(movie.vote_average).toFixed(1)}/10</span>
                    </section>
                    <section className='section-bts-assistir-movie-principal'>
                        <Link to={`/assistir=${filmeSerie}&${movie.id}`} className='bt-assistir-movie-principal'><i class='fas fa-play'></i>Assistir</Link>
                        {favoritoIsTrue ? <button className="botao-favorito-movie-principal botao-remover-favorito-movie-principal" onClick={()=>removerFavoritos(favoritos.findIndex( (element) => element.imdbId == idImdb))}><i class="fa-solid fa-heart"></i> Favoritos</button>
                        : <button className="botao-favorito-movie-principal botao-adicionar-favorito-movie-principal" onClick={()=>salvarFavoritos()}><i class="fa-solid fa-heart-crack"></i> Favoritos</button>
                        }
                    </section>
                </div>
            </div>
        </>
    )
}