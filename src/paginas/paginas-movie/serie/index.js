import { APIKey } from "../../../config/key";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../style.css';
import Assistir from "../../assistir";
import PopUpMovie from "../../../componentes/pop-up-movie";

export default function PagPopularSerie(props) {
    
    const image_path = 'https://image.tmdb.org/t/p/w200';
    const [ movies, setMovies ] = useState([]);
    const [ scrollDivSeries, setScrollDivSeries ] = useState();
    const [ popUpMovie, setPopUpMovie ] = useState(false);
    const [ pagina, setPagina ] = useState(1);

    const [ idioma, setIdioma ] = useState();

    useEffect(() => {

        var idioma = localStorage.getItem('idioma') || 'portugues';
        setIdioma(idioma)
        
        fetch(`https://api.themoviedb.org/3/tv/${props.categoriaSerie}?api_key=${APIKey}&vote_average.gte=6&language=${idioma == 'portugues' ? 'pt-BR' : 'en-US'}&page=${pagina}`)
            .then(Response => Response.json())
            .then(data => {
                setMovies(data.results)
        })

        document.getElementById("list-movie-serie").scrollTo(0,0);
    }, [props.categoriaSerie, idioma, pagina]);


    var divSlider = document.getElementById("list-movie-serie")

    function btLeftSlideSerie() {
        divSlider.scrollLeft -= 380;
    }
    
    function btRightSlideSerie() {
        divSlider.scrollLeft += 380;
    }
    
    setTimeout(()=>{
        if(props.categoriaSerie == 'popular') {
            document.getElementById("label-categoria-serie-1").click();
        }
    }, 1000)
    
    function scrollDiv() {
        setScrollDivSeries(document.getElementById("list-movie-serie").scrollLeft)
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
        
        <div className="content-movies content-series">
            <div className="div-name-categoria-movie">
                <h2 className="h2-filme-serie-titulo-categoria">{idioma == 'portugues' ? 'S??ries' : 'series'}</h2>
                <div className="div-escolher-categoria-movie">
                    <section className="section-categoria-movie">
                        <input type="radio" name="input-radio-categoria-serie" id="input-radio-categoria-serie-1"/>
                        <label htmlFor="input-radio-categoria-serie-1" id="label-categoria-serie-1">
                            <span className="span-escolher-categoria-serie" onClick={()=>props.setCategoriaSerie('popular')}>{idioma == 'portugues' ? 'Populares' : 'Popular'}</span>
                        </label>
                    </section>
                    <section className="section-categoria-movie">
                        <input type="radio" name="input-radio-categoria-serie" id="input-radio-categoria-serie-2"/>
                        <label htmlFor="input-radio-categoria-serie-2">
                            <span className="span-escolher-categoria-serie" onClick={()=>props.setCategoriaSerie('top_rated')}>{idioma == 'portugues' ? 'Avalia????es' : 'Top Rated'}</span>
                        </label>
                    </section>
                </div>
            </div>
            <div className="div-movies" id="list-movie-serie" onScroll={()=>scrollDiv()}>
                {scrollDivSeries > 20 && document.body.clientWidth >= 600 &&
                    <button className="bt-slide bt-left-slide" id="bt-left-slide-serie" onClick={btLeftSlideSerie}><i className="fas fa-angle-left"></i></button>
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
                <button className="bt-slide bt-right-slide" id="bt-right-slide-serie" onClick={btRightSlideSerie}><i className="fas fa-angle-right"></i></button>
            </div>

            <PopUpMovie popUpMovie={popUpMovie} setPopUpMovie={setPopUpMovie}>
                <Link to='/' className='bt-fechar-popup-movie' onClick={()=>fecharMovie()}><i className="fa-solid fa-xmark"></i></Link>
                <Assistir/>
            </PopUpMovie>
        </div>
    )
}