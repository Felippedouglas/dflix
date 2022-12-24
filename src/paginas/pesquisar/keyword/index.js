import { Link, useParams } from "react-router-dom";
import './style.css';
import { useEffect, useState } from "react";
import { APIKey } from "../../../config/key";


export default function PesqusiarKeyword() {

    const { numeroPagina, keyword } = useParams();
    const [ movies, setMovies ] = useState([]);
    const [ totalResultados, setTotalResultados ] = useState();
    const image_path = 'https://image.tmdb.org/t/p/w200';
    
    const [ idioma, setIdioma ] = useState();

    document.title = `DFLIX | Keyword`;
    if(Number(numeroPagina) == 0) {
        window.location.href = "/404"
    }

    // filmes/séries com keyword pesquisado
    useEffect(() => {

        var idioma = localStorage.getItem('idioma') || 'portugues';
        setIdioma(idioma);

        fetch(`https://api.themoviedb.org/3/keyword/${keyword}/movies?api_key=${APIKey}&language=${idioma == 'portugues' ? 'pt-BR' : 'en-US'}&page=${numeroPagina}`)
            .then(Response => Response.json())
            .then(data => {
                if (data) {
                    setMovies(data.results);
                    setTotalResultados(data.total_pages);
                }
            })

        window.scrollTo(0,0);
    }, [numeroPagina, idioma])
    
    return(
        <div className="div-genero-pesquisado">
        <header className="header-componente-pesquisar">
            {numeroPagina &&
                <h2 className="h2-titulo-generos" id="h2-filmes-com-genero-encontrados">{'Filmes Keyword - substitua a keyword na url'}</h2>
            }
        </header>
        <div className="div-movie-pesquisar-genero">
            {movies.map(movie => {
                return (
                    <div className='movie-pesquisar' key={`movie-${movie.id}`}>
                        <Link to={`/assistir=movie&${movie.id}`}>
                            <img loading="lazy" src={`${image_path}${movie.poster_path}`} alt={movie.title} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-erro-exclamacao.png";}}/>
                            <section className="section-informacoes-movie-pesquisar">
                                <span><i className="fas fa-star"></i>{movie.vote_average.toFixed(1)}</span>
                                {movie.first_air_date &&
                                    <span>{movie.first_air_date.slice(0,4)}</span>
                                }
                                {movie.release_date &&
                                    <span>{movie.release_date.slice(0,4)}</span>
                                }
                            </section>
                        </Link>
                        <span className="titulo-movie" title={movie.title}>{movie.title}</span>
                    </div>
                    )
                })
            }
        </div>
        <div className="div-generos bts-anterior-proximo">
            <div id="div-bts-paginas-generos" className="div-bts-paginas-generos div-generos">
                {Number(numeroPagina) > 1 && 
                    <section>
                        <input className="input-escolher-genero" type="radio" name="input-radio-genero" id="input-paginas-genero-1"/>
                        <label className="label-escolher-genero label-bt-pagina-genero" id="label-paginas-generos=1" htmlFor="input-paginas-genero-1">
                            {idioma == 'portugues' &&
                                <Link to={`/keyword=${keyword}&pagina=${Number(numeroPagina) - 1}`} className="bt-pagina-pesquisar"><i className="fa-solid fa-angle-left"></i>  Anterior: {Number(numeroPagina) - 1}</Link>
                            }
                            {idioma == 'ingles' &&
                                <Link to={`/keyword=${keyword}&pagina=${Number(numeroPagina) - 1}`} className="bt-pagina-pesquisar"><i className="fa-solid fa-angle-left"></i>  Previous: {Number(numeroPagina) - 1}</Link>
                            }
                        </label>
                    </section>
                }
                {numeroPagina > 1 &&
                    <section>
                        <span className="span-pagina-atual">{numeroPagina}</span>
                    </section>
                }
                {Number(numeroPagina) < totalResultados && 
                    <section>
                        <input className="input-escolher-genero" type="radio" name="input-radio-genero" id="input-paginas-genero-2"/>
                        <label className="label-escolher-genero label-bt-pagina-genero" id="label-paginas-generos=2" htmlFor="input-paginas-genero-2">
                            {idioma == 'portugues' &&
                                <Link to={`/keyword=${keyword}&pagina=${Number(numeroPagina) + 1}`} className="bt-pagina-pesquisar">{numeroPagina == 1 ? 'Ver mais' : `Próximo: ${Number(numeroPagina) + 1}`} <i className="fa-solid fa-angle-right"></i></Link>
                            }
                            {idioma == 'ingles' &&
                                <Link to={`/keyword=${keyword}&pagina=${Number(numeroPagina) + 1}`} className="bt-pagina-pesquisar">{numeroPagina == 1 ? 'More' : `Next: ${Number(numeroPagina) + 1}`} <i className="fa-solid fa-angle-right"></i></Link>
                            }
                        </label>
                    </section>
                }
            </div>
        </div>
    </div>
    )
}