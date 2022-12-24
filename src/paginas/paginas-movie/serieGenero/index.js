import { APIKey } from "../../../config/key";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../style.css';
import Assistir from "../../assistir";
import PopUpMovie from "../../../componentes/pop-up-movie";

export default function PagSeriesGenero() {
    
    const image_path = 'https://image.tmdb.org/t/p/w200';
    const [ movies, setMovies ] = useState([]);
    const [ scrollDivSeries, setScrollDivSeries ] = useState();
    const [ popUpMovie, setPopUpMovie ] = useState(false);
    const [ pagina, setPagina ] = useState(1);
    const [ idGenero, setIdGenero ] = useState();
    const [ genero, setGenero ] = useState();

    const [ idioma, setIdioma ] = useState();

    useEffect(() => {

        var idioma = localStorage.getItem('idioma') || 'portugues';
        setIdioma(idioma)
        
        // lista de generos das séries
        fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${APIKey}&language=${idioma == 'portugues' ? 'pt-BR' : 'en-US'}`)
            .then(Response => Response.json())
            .then(data => {
                var numero = (Math.random()*16).toFixed();
                setIdGenero(data.genres[numero].id)
                setGenero(data.genres[numero].name)
            })

        if (idGenero) {
            fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${APIKey}&language=${idioma == 'portugues' ? 'pt-BR' : 'en-US'}&sort_by=popularity.desc&with_genres=${idGenero}`)
                .then(Response => Response.json())
                .then(data => {
                    setMovies(data.results)
            })
        }
    }, [idioma, pagina]);


    var divSlider = document.getElementById("list-movie-serie-genero")

    function btLeftSlideSerieGenero() {
        divSlider.scrollLeft -= 380;
    }
    
    function btRightSlideSerieGenero() {
        divSlider.scrollLeft += 380;
    }
    
    function scrollDiv() {
        setScrollDivSeries(document.getElementById("list-movie-serie-genero").scrollLeft)
    }
    
    function abrirMovie() {
        setPopUpMovie(!popUpMovie);
    }
    
    function fecharMovie() {
        setTimeout(()=>{
            document.title = 'DFLIX';
            setPopUpMovie(!popUpMovie);
        }, 100);
        document.getElementById("pop-up-movie").style.bottom = '-100%';
    }

    return(
        
        <div className="content-movies content-filmes">
            <div className="div-name-categoria-movie">
                
                {idioma == 'portugues' &&
                    <h2 className="h2-filme-serie-titulo-categoria">Séries {idGenero == 10762 || idGenero == 53 || idGenero == 10751 ? '' : 'de' } {genero}</h2>
                }
                {idioma == 'ingles' &&
                    <h2 className="h2-filme-serie-titulo-categoria">Series {idGenero == 10762 || idGenero == 53 || idGenero == 10751 ? '' : 'of' } {genero}</h2>
                }
            </div>
            <div className="div-movies" id="list-movie-serie-genero" onScroll={()=>scrollDiv()}>
                {scrollDivSeries > 20 && document.body.clientWidth >= 600 &&
                    <button className="bt-slide bt-left-slide" id="bt-left-slide-serie" onClick={btLeftSlideSerieGenero}><i className="fas fa-angle-left"></i></button>
                }
                {movies.map(movie => {
                    return (
                        <div className="movie" key={movie.id}>
                            <Link to={`/preview/tv&${movie.id}`} onClick={()=>abrirMovie()}>
                                <img loading="lazy" src={`${image_path}${movie.poster_path}`} alt={movie.title} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-erro-exclamacao.png"; currentTarget.height='50px'}}/>
                                <section className="section-informacoes-movie">
                                        <div className="div-avaliacao-movie">
                                            <span className="span-estrela-movie"><i className="fas fa-star"></i></span>
                                            <span>{movie.vote_average.toFixed(1)} </span>
                                        </div>
                                        {movie.first_air_date &&
                                            <span>{movie.first_air_date.slice(0,4)}</span>
                                        }
                                        {movie.release_date &&
                                            <span>{movie.release_date.slice(0,4)}</span>
                                        }
                                </section>
                            </Link>
                            <span className="span-titulo-movie span-titulo-movie1" title={movie.name}>{movie.name}</span>
                        </div>
                        )
                    })
                }
                <button className="bt-slide bt-right-slide" onClick={btRightSlideSerieGenero}><i className="fas fa-angle-right"></i></button>
            </div>

            <PopUpMovie popUpMovie={popUpMovie} setPopUpMovie={setPopUpMovie}>
                <Link to='/' className='bt-fechar-popup-movie' onClick={()=>fecharMovie()}><i className="fa-solid fa-xmark"></i></Link>
                <Assistir/>
            </PopUpMovie>
        </div>
    )
}