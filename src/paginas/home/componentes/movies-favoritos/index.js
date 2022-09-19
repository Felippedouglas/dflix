import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import './style.css';

export default function PagMoviesFavoritos() {
    
    const image_path = 'https://image.tmdb.org/t/p/w500';
    const [ popUpMovie, setPopUpMovie ] = useState(false);
    const [ favoritos, setFavoritos ] = useState([]);
    const { preview } = useParams();

    useEffect(() => {
        const favoritosLocalStorage = JSON.parse(localStorage.getItem('favoritos') || "[]");
        setFavoritos(favoritosLocalStorage.reverse());

    }, [preview]);


    var divSlider = document.getElementById("list-movie-favoritos")

    function btLeftSlideSerie() {
        divSlider.scrollLeft -= 380;
    }
    
    function btRightSlideSerie() {
        divSlider.scrollLeft += 380;
    }
    
    function abrirMovie() {
        //document.getElementById("container-home").style.overflow = 'hidden';
        setPopUpMovie(!popUpMovie);
    }
    
    function fecharMovie() {
        //document.getElementById("container-home").style.overflow = 'auto';
        setTimeout(()=>{
            document.title = 'DFLIX';
            setPopUpMovie(!popUpMovie);
        }, 100);
        document.getElementById("pop-up-movie").style.bottom = '-100%';
    }

    return(
        <div className="content-movies content-movies-favoritos">
            <div className="div-name-categoria-movie">
                <h2 className="h2-filme-serie-titulo-categoria">Favoritos <Link to='/conta' className="link-conta-movies-favoritos"><i class="fa-solid fa-gear"></i></Link></h2>
            </div>
            <div className="div-movies-favoritos">
                <div className="div-movies" id="list-movie-favoritos">
                    {favoritos.map(movie => {
                        return (
                            <div className="movie" key={movie.id}>
                                <Link to={`/preview/${movie.type}&${movie.id}`} onClick={()=>abrirMovie()}>
                                    <img loading="lazy" src={`${image_path}${movie.img}`} alt={movie.title} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-erro-exclamacao.png"; currentTarget.height='50px'}}/>
                                    <section className="section-informacoes-movie">
                                        <div class="div-avaliacao-movie">
                                            <span class="span-estrela-movie"><i class="fas fa-star"></i></span>
                                            <span>{movie.vote_average.toFixed(1)} </span>
                                        </div>
                                        {movie.year &&
                                            <span>{movie.year}</span>
                                        }
                                    </section>
                                </Link>
                                <span className="span-titulo-movie">{movie.name}</span>
                            </div>
                            )
                        })
                    }
                </div>
                {favoritos.length >= 4 && 
                    <div className="div-bts-movies-favoritos">
                        <button className="bt-slide bt-left-slide" onClick={btLeftSlideSerie}><i class="fas fa-angle-left"></i></button>
                        <button className="bt-slide bt-right-slide" onClick={btRightSlideSerie}><i class="fas fa-angle-right"></i></button>
                    </div>
                }
            </div>
        </div>
    )
}