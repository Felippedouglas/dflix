import './style.css';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import $ from 'jquery';
import { APIKey } from '../../../../config/key';
import logoMoviePrincipal1 from '../../../../componentes/imgs/logo-movie-principal1.png';
import logoMoviePrincipal2 from '../../../../componentes/imgs/logo-movie-principal2.png';
import logoMoviePrincipal3 from '../../../../componentes/imgs/logo-movie-principal3.png';
import imgBackgroundMoviePrincipal1 from '../../../../componentes/imgs/background-video-movie-principal1.jpg';
import imgBackgroundMoviePrincipal1m from '../../../../componentes/imgs/background-video-movie-principal1m.jpg';
import imgBackgroundMoviePrincipal2 from '../../../../componentes/imgs/background-video-movie-principal2.jpg';
import imgBackgroundMoviePrincipal2m from '../../../../componentes/imgs/background-video-movie-principal2m.jpg';
import imgBackgroundMoviePrincipal3 from '../../../../componentes/imgs/background-video-movie-principal3.jpg';
import imgBackgroundMoviePrincipal3m from '../../../../componentes/imgs/background-video-movie-principal3m.jpg';
import Trailer from '../../../../componentes/trailer.mp4';

export default function MoviePrincipal() {

    const [ audioVideo, setAudioVideo ] = useState(false);
    const [ movie, setMovie ] = useState({});
    const [ filmeSerie, setFilmeSerie ] = useState('tv');
    const [ id, setId ] = useState(110316);
    const [ idImdb, setIdImdb ] = useState();
    const [ definirFilmeSerie, setDefinirFilmeSerie ] = useState();
    const image_path = 'https://image.tmdb.org/t/p/w500';
    const [ economiaInternet, setEconomiaInternet ] = useState();
    const [ classificacaoIndicativa, setClassificacaoIndicativa ] = useState();
    
    const [ idioma, setIdioma ] = useState();
    const [ sortearNumero, setSortearNumero ] = useState(parseInt(Math.random() * 3) + 1);
    
    useEffect(() => {

        fetch(`https://api.themoviedb.org/3/${filmeSerie}/${id}?api_key=${APIKey}&language=pt-BR`)
        .then(Response => Response.json())
        .then(data => {
            
            setMovie(data);
        });
        
        setTimeout(()=> {
            
            if (filmeSerie == 'movie') {
                setDefinirFilmeSerie('filme');
            } else if (filmeSerie == 'tv') {
                setDefinirFilmeSerie('serie');
            }

        }, 100);
        
        setEconomiaInternet(localStorage.getItem('economia'))

    }, [id]);

    useEffect(() => {
        if (filmeSerie == 'tv') {
            fetch(`https://api.themoviedb.org/3/tv/${id}/content_ratings?api_key=${APIKey}`)
            .then(Response => Response.json())
            .then(data => {
                data.results.map((rating)=>{
                    if(rating.iso_3166_1 == "BR" ) {
                        setClassificacaoIndicativa(rating.rating)
                    }
                })
            });
        } else if (filmeSerie == 'movie') {
            fetch(`https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${APIKey}`)
            .then(Response => Response.json())
            .then(data => {
    
                data.results.map((certification)=>{
                    if(certification.iso_3166_1 == "BR" ) {
                        setClassificacaoIndicativa(certification.release_dates[0].certification || 12)
                    }
                })
            });
        }

        setIdioma(localStorage.getItem('idioma') || 'portugues')
    }, [id]);
    
    // id imdb filme e série
    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/${filmeSerie}/${id}/external_ids?api_key=${APIKey}&language=pt-BR`)
        .then(Response => Response.json())
        .then(data => {
            setIdImdb(data.imdb_id);
        });

        setInterval(()=>{
            if (sortearNumero == 1) {
                setFilmeSerie('tv')
                setId(110316)
            } else if (sortearNumero == 2) {
                setFilmeSerie('tv')
                setId(115577)
            } else if (sortearNumero == 3) {
                setFilmeSerie('movie')
                setId(76600)
            }
        }, 100)
    }, [id]);

    function audioMoviePrincipal() {
        setAudioVideo(!audioVideo);
        if (audioVideo) {
            document.getElementById("video-movie-principal").muted = true;
        } else {
            document.getElementById("video-movie-principal").muted = false;
        }
    };

    const converter = (minutos) => {
        const horas = Math.floor(minutos/ 60);
        const min = minutos % 60;
        const textoHoras = (`${horas}`);
        const textoMinutos = (`${min}`);

        if (minutos <= 59) {
            return `${textoMinutos}min`;
        } else if (minutos == 60) {
            return `${textoHoras }h`;
        } else if (minutos >= 65) {
            return `${textoHoras }h, ${textoMinutos}min`;
        }
        
    };

    return(
        <>
            <main className="content-movie-principal">
                <div className="div-video-background">
                    <video
                        src={sortearNumero == 5 && !economiaInternet ? Trailer : ''}
                        id='video-movie-principal'
                        poster={sortearNumero == 1 && document.body.clientWidth > 600 ? imgBackgroundMoviePrincipal1 : sortearNumero == 1 && document.body.clientWidth <= 600 ? imgBackgroundMoviePrincipal1m : sortearNumero == 2 && document.body.clientWidth > 600 ? imgBackgroundMoviePrincipal2 : sortearNumero == 2 && document.body.clientWidth <= 600 ? imgBackgroundMoviePrincipal2m : sortearNumero == 3 && document.body.clientWidth > 600 ? imgBackgroundMoviePrincipal3 : imgBackgroundMoviePrincipal3m}
                        autoPlay={true} muted={true} loop={true}>
                    </video>
                    <section className='section-mute-movie-principal'>
                        {!economiaInternet && sortearNumero == 5 &&
                            <button className='bt-mute-movie-principal' id='bt-mute-movie-principal' onClick={()=>audioMoviePrincipal()}>{audioVideo?<i className="fa-solid fa-volume-high"></i>:<i className="fa-solid fa-volume-xmark"></i>}</button>
                        }
                        <section className='section-classificacao-movie-principal'>
                            <span className={`span-classificacao-movie-principal span-classificacao-indicativa-${classificacaoIndicativa}`}>{classificacaoIndicativa}</span>
                        </section>
                    </section>
                </div>
                <div className="div-detalhes-movie-principal" id='div-detalhes-movie-principal'>
                    <img src={sortearNumero == 1 ? logoMoviePrincipal1 : sortearNumero == 2 ? logoMoviePrincipal2 : logoMoviePrincipal3} alt='img movie'/>
                    <section className="informacoes-movie-principal">
                        {movie.first_air_date &&
                            <span>{movie.first_air_date.slice(0,4) || 2022} |</span>
                        }
                        {movie.release_date &&
                            <span>{movie.release_date.slice(0,4) || 2022} |</span>
                        }
                        {movie.runtime &&
                            <span className="duracao-movie-assistir"><i className="fa-solid fa-clock-rotate-left"></i> {converter(movie.runtime || 45)} |</span>
                        }
                        {movie.episode_run_time && movie.episode_run_time.length == 1 &&
                            <span className="duracao-movie-assistir"><i className="fa-solid fa-clock-rotate-left"></i> {converter(movie.episode_run_time || 45)} (ep.) |</span>
                        }
                        <span><i className="fas fa-star"></i> {Number(movie.vote_average).toFixed(1) || 5}/10</span>
                    </section>
                    {sortearNumero == 1 &&
                        <section className='section-avisos-movie-principal'>
                            <span className='span-avisos-movie-principal'><i className="fa-solid fa-circle-exclamation"></i> {idioma == 'portugues' ? ' Novos Episódios' : ' New episodes'}</span>
                        </section>
                    }
                    <section className='section-bts-assistir-movie-principal'>
                        <Link to={`/assistir=${filmeSerie}&${id}`} className='bt-assistir-movie-principal'><i className='fas fa-play'></i> <span className='span-assistir-movie-principal'>{idioma == 'portugues' ? 'assistir' : 'watch'}</span></Link>
                        <Link to={`/preview/${filmeSerie}&${id}`} className='bt-assistir-movie-principal'><i className="fa-solid fa-circle-info"></i> <span className='span-assistir-movie-principal'>{idioma == 'portugues' ? 'detalhes' : 'details'}</span></Link>
                    </section>
                </div>
            </main>
        </>
    )
}