import { APIKey } from "../../../config/key";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../style.css';

export default function Natal(props) {
    
    const image_path = 'https://image.tmdb.org/t/p/w200';
    const [ movies, setMovies ] = useState([]);
    const [ scrollDivMovies, setScrollDivMovies ] = useState();
    const [ popUpMovie, setPopUpMovie ] = useState(false);

    const [ idioma, setIdioma ] = useState()

    useEffect(()=> {

        var idioma = localStorage.getItem('idioma') || 'portugues';
        setIdioma(idioma)

        fetch(`https://api.themoviedb.org/3/keyword/207317/movies?api_key=${APIKey}&language=${idioma == 'portugues' ? 'pt-BR' : 'en-US'}&page=1`)
            .then(Response => Response.json())
            .then(data => {
                setMovies(data.results)
            })
            document.getElementById("list-movie-natal").scrollTo(0,0)

    }, [props.categoriaFilme, idioma])
        
        
    var divSlider = document.getElementById("list-movie-natal")
    
    function btLeftSlideFilme() {
        divSlider.scrollLeft -= 380;
    }
    
    function btRightSlideFilme() {
        divSlider.scrollLeft += 380;
    }

    setTimeout(()=>{
        document.getElementById("label-categoria-natal").click();
    }, 1000)
    
    function scrollDiv() {
        setScrollDivMovies(document.getElementById("list-movie-natal").scrollLeft);
    }
    
    function abrirMovie() {
        setPopUpMovie(!popUpMovie);
    }

    return(
        <div className="content-movies content-series">
            <div className="div-name-categoria-movie">
                <h2 className="h2-filme-serie-titulo-categoria">{idioma == 'portugues' ? 'Especial de natal' : 'Christman'} <i className="fa-solid fa-sleigh"></i></h2>
                <div className="div-escolher-categoria-movie">
                    <section className="section-categoria-movie">
                        <input type="radio" autoFocus name="input-radio-categoria-natal" id="input-radio-categoria-natal"/>
                        <label htmlFor="input-radio-categoria-natal" id="label-categoria-natal">
                            <span className="span-escolher-categoria-movie">{idioma == 'portugues' ? 'Filmes' : 'Movies'}</span>
                        </label>
                    </section>
                </div>
            </div>
            <div className="div-movies" id="list-movie-natal" onScroll={()=>scrollDiv()}>
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