import { APIKey } from "../../../config/key";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../style.css';
import Assistir from "../../assistir";
import PopUpMovie from "../../../componentes/pop-up-movie";


//swiper slide
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode, Pagination } from "swiper";

export default function PagPopularFilme(props) {
    
    const image_path = 'https://image.tmdb.org/t/p/w500';
    const [ movies, setMovies ] = useState([]);
    const [ scrollDivMovies, setScrollDivMovies ] = useState();
    const [ popUpMovie, setPopUpMovie ] = useState(false);
    const [ idMovie, setIdMovie ] = useState();
    const [ movie, setMovie ] = useState([]);

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/${props.categoriaFilme}?api_key=${APIKey}&language=pt-BR&page=1`)
            .then(Response => Response.json())
            .then(data => {
                setMovies(data.results)
            })
            document.getElementById("list-movie-filme").scrollTo(0,0)
    }, [props.categoriaFilme])

    useEffect(()=> {

        if (idMovie) {
            fetch(`https://api.themoviedb.org/3/movie/${idMovie}?api_key=${APIKey}&language=pt-BR`)
            .then(Response => Response.json())
            .then(data => {
                setMovie(data.results)
        })
        }
    }, [idMovie])
        
        
    var divSlider = document.getElementById("list-movie-filme")
    var btLeft = document.getElementById("bt-left-slide-filme")
    function btLeftSlideFilme() {
        divSlider.scrollLeft -= 380;
    }
    
    function btRightSlideFilme() {
        divSlider.scrollLeft += 380;
        btLeft.style.padding = "0 40px 0 20px";
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
                <h2 className="h2-filme-serie-titulo-categoria">Filmes</h2>
                <div className="div-escolher-categoria-movie">
                    <section className="section-categoria-movie">
                        <input type="radio" autoFocus name="input-radio-categoria-filme" id="input-radio-categoria-filme"/>
                        <label htmlFor="input-radio-categoria-filme" id="label-categoria-filme-1">
                            <span onClick={()=>props.setCategoriaFilme('popular')}>Populares</span>
                        </label>
                    </section>
                    <section className="section-categoria-movie">
                        <input type="radio" name="input-radio-categoria-filme" id="input-radio-categoria-filme-2"/>
                        <label htmlFor="input-radio-categoria-filme-2">
                            <span onClick={()=>props.setCategoriaFilme('upcoming')}>Lançamentos</span>
                        </label>
                    </section>
                    <section className="section-categoria-movie">
                        <input type="radio" name="input-radio-categoria-filme" id="input-radio-categoria-filme-3"/>
                        <label htmlFor="input-radio-categoria-filme-3">
                            <span onClick={()=>props.setCategoriaFilme('top_rated')}>Avaliações</span>
                        </label>
                    </section>
                </div>
            </div>
            <div className="div-movies" id="list-movie-filme" onScroll={()=>scrollDiv()}>
                {scrollDivMovies > 50 && document.body.clientWidth >= 600 &&
                    <button className="bt-slide bt-left-slide" id="bt-left-slide-filme" onClick={btLeftSlideFilme}><i class="fas fa-angle-left"></i></button>
                }
                {movies.map(movie => {
                        return (
                            <div className="movie" key={movie.id}>
                                <Link to={`/preview/movie&${movie.id}`} onClick={()=>abrirMovie()}>
                                    <img loading="lazy" src={`${image_path}${movie.poster_path}`} alt={movie.title} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-erro-exclamacao.png";}}/>
                                    <section className="section-informacoes-movie">
                                        <div class="div-avaliacao-movie">
                                            <span class="span-estrela-movie">
                                                <i class="fas fa-star"></i>
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
                <button className="bt-slide bt-right-slide" id="bt-right-slide-filme" onClick={btRightSlideFilme}><i class="fas fa-angle-right"></i></button>
            </div>
        </div>
    )
}