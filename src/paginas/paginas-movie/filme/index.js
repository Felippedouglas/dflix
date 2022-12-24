import { APIKey } from "../../../config/key";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../style.css';

export default function PagPopularFilme(props) {
    
    const image_path = 'https://image.tmdb.org/t/p/w200';
    const [ movies, setMovies ] = useState([]);
    const [ scrollDivMovies, setScrollDivMovies ] = useState();
    const [ popUpMovie, setPopUpMovie ] = useState(false);

    const [ idioma, setIdioma ] = useState()

    useEffect(()=> {

        var idioma = localStorage.getItem('idioma') || 'portugues';
        setIdioma(idioma)

        fetch(`https://api.themoviedb.org/3/movie/${props.categoriaFilme}?api_key=${APIKey}&language=${idioma == 'portugues' ? 'pt-BR' : 'en-US'}&page=1`)
            .then(Response => Response.json())
            .then(data => {
                setMovies(data.results)
            })
            document.getElementById("list-movie-filme").scrollTo(0,0)

    }, [props.categoriaFilme, idioma])
        
        
    var divSlider = document.getElementById("list-movie-filme")
    
    function btLeftSlideFilme() {
        divSlider.scrollLeft -= 380;
    }
    
    function btRightSlideFilme() {
        divSlider.scrollLeft += 380;
    }

    setTimeout(()=>{
        if(props.categoriaFilme == 'popular') {
            document.getElementById("label-categoria-filme-1").click();
        }
    }, 1000)
    
    function scrollDiv() {
        setScrollDivMovies(document.getElementById("list-movie-filme").scrollLeft);
    }
    
    function abrirMovie() {
        setPopUpMovie(!popUpMovie);
    }

    return(
        <div className="content-movies content-filmes">
            <div className="div-name-categoria-movie">
                <h2 className="h2-filme-serie-titulo-categoria">{idioma == 'portugues' ? 'Filmes' : 'Movies'}</h2>
                <div className="div-escolher-categoria-movie">
                    <section className="section-categoria-movie">
                        <input type="radio" autoFocus name="input-radio-categoria-filme" id="input-radio-categoria-filme"/>
                        <label htmlFor="input-radio-categoria-filme" id="label-categoria-filme-1">
                            <span className="span-escolher-categoria-movie" onClick={()=>props.setCategoriaFilme('popular')}>{idioma == 'portugues' ? 'Populares' : 'popular'}</span>
                        </label>
                    </section>
                    <section className="section-categoria-movie">
                        <input type="radio" name="input-radio-categoria-filme" id="input-radio-categoria-filme-2"/>
                        <label htmlFor="input-radio-categoria-filme-2">
                            <span className="span-escolher-categoria-movie" onClick={()=>props.setCategoriaFilme('upcoming')}>{idioma == 'portugues' ? 'Lançamentos' : 'up coming'}</span>
                        </label>
                    </section>
                    <section className="section-categoria-movie">
                        <input type="radio" name="input-radio-categoria-filme" id="input-radio-categoria-filme-3"/>
                        <label htmlFor="input-radio-categoria-filme-3">
                            <span className="span-escolher-categoria-movie" onClick={()=>props.setCategoriaFilme('top_rated')}>{idioma == 'portugues' ? 'Avaliações' : 'top rated'}</span>
                        </label>
                    </section>
                </div>
            </div>
            <div className="div-movies" id="list-movie-filme" onScroll={()=>scrollDiv()}>
                {scrollDivMovies > 20 && document.body.clientWidth >= 600 &&
                    <button className="bt-slide bt-left-slide" id="bt-left-slide-filme" onClick={btLeftSlideFilme}><i className="fas fa-angle-left"></i></button>
                }
                {movies.map(movie => {
                        return (
                            <div className="movie" key={movie.id}>
                                <Link to={`/preview/movie&${movie.id}`} onClick={()=>abrirMovie()}>
                                    <img loading="lazy" src={`${image_path}${movie.poster_path}`} alt={movie.title} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-erro-exclamacao.png";}}/>
                                    <section className="section-informacoes-movie">
                                        <div className="div-avaliacao-movie">
                                            <span className="span-estrela-movie">
                                                <i className="fas fa-star"></i>
                                            </span>
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
                                <span className="span-titulo-movie" title={movie.title}>{movie.title}</span>
                            </div>
                        )
                    })
                }
                <button className="bt-slide bt-right-slide" id="bt-right-slide-filme" onClick={btRightSlideFilme}><i className="fas fa-angle-right"></i></button>
            </div>
        </div>
    )
}