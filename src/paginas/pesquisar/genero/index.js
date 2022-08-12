import { Link, useParams } from "react-router-dom";
import './style.css';
import { useEffect, useState } from "react";
import { APIKey } from "../../../config/key";


export default function PesqusiarGenero() {

    const { generoPesquisado, idGenero, numeroPagina, filmeSerie, infantil } = useParams();
    const [ definirFilmeSerie, setDefinirFilmeSerie ] = useState();
    const [ generos, setGeneros ] = useState([]);
    const [ movies, setMovies ] = useState([]);
    const [ totalResultados, setTotalResultados ] = useState();
    const image_path = 'https://image.tmdb.org/t/p/w500';

    document.title = `${definirFilmeSerie} de ${generoPesquisado} - DFLIX`;
    if(Number(numeroPagina) == 0) {
        window.location.href = "/404"
    }

    // filmes/séries com genero pesquisado
    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/discover/${filmeSerie}?api_key=${APIKey}&language=pt-BR&sort_by=popularity.desc&with_genres=${idGenero}&page=${numeroPagina}`)
            .then(Response => Response.json())
            .then(data => {
                setMovies(data.results);
                setTotalResultados(data.total_pages);
            })
    }, [numeroPagina, generoPesquisado, filmeSerie, infantil])

    // lista de generos dos filmes e séries
    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/genre/${filmeSerie}/list?api_key=${APIKey}&language=pt-BR`)
            .then(Response => Response.json())
            .then(data => {
                setGeneros(data.genres)
            })
    }, [filmeSerie])

    setTimeout(()=> {
        if (filmeSerie == 'movie') {
            setDefinirFilmeSerie('Filmes');
        } else if (filmeSerie == 'tv') {
            setDefinirFilmeSerie('Séries');
        }

        document.getElementById(`label-genero=${idGenero}`).click();
    }, 1);

    var divSlider = document.getElementById("div-generos")
    var btLeft = document.getElementById("bt-left-div-generos")

    function btGeneroLeftSlide() {
        divSlider.scrollLeft -= 200;
        if (divSlider.scrollLeft < 10) {
            btLeft.style.display = "none";
        }
    }
    
    function btGeneroRightSlide() {
        divSlider.scrollLeft += 200;
        btLeft.style.display = "block";
        btLeft.style.left = "-20px";
        btLeft.style.padding = "0 40px 0 20px";
    }
    
    return(
        <div className="div-genero-pesquisado">
        <header className="header-componente-pesquisar">
            {numeroPagina &&
                <>
                    {idGenero &&
                        <h2 className="h2-titulo-generos" id="h2-filmes-com-genero-encontrados">{definirFilmeSerie} {idGenero == 10762 || idGenero == 53 || idGenero == 10751 ? '' : 'de' } {generoPesquisado}</h2>
                    }
                </>
            }
        </header>
        {infantil == 'false'  &&
            <div className="div-generos" id="div-generos">
                <button className="bt-slide bt-left-div-generos" id="bt-left-div-generos" onClick={btGeneroLeftSlide}><i class="fas fa-angle-left"></i></button>
                {generos.map(genero => {
                    return (
                        <section className="genero">
                            <input className="input-escolher-genero" type='radio' name='input-radio-genero' id={`input-genero=${genero.id}`}/>
                            <label className="label-escolher-genero" id={`label-genero=${genero.id}`} htmlFor={`input-genero=${genero.id}`}>
                                <Link onClick={()=>window.scrollTo(0,0)} to={`/${filmeSerie}/genero=${genero.id}/${genero.name}&infantil=${infantil}&pagina=1`}>{genero.name}</Link>
                            </label>
                        </section>
                    )
                    })
                }
                <button className="bt-slide bt-right-div-generos" id="bt-right-div-generos" onClick={btGeneroRightSlide}><i class="fas fa-angle-right"></i></button>
            </div>
        }
        {filmeSerie =='movie' &&
            <>
                <div className="div-movie-pesquisar-genero">
                    {movies.map(movie => {
                        return (
                            <>
                                <div className='movie-pesquisar' title={movie.title}>
                                    <Link to={`/assistir=${filmeSerie}&${movie.id}`}>
                                        <img loading="lazy" src={`${image_path}${movie.poster_path}`} alt={movie.title} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-erro-exclamacao.png";}}/>
                                        <section className="section-informacoes-movie-pesquisar">
                                            <span><i class="fas fa-star"></i>{movie.vote_average.toFixed(1)}</span>
                                            {movie.first_air_date &&
                                                <span>{movie.first_air_date.slice(0,4)}</span>
                                            }
                                            {movie.release_date &&
                                                <span>{movie.release_date.slice(0,4)}</span>
                                            }
                                        </section>
                                    </Link>
                                    <span className="titulo-movie">{movie.title}</span>
                                </div>
                            </>
                            )
                        })
                    }
                </div>
            </>
        }
        {filmeSerie =='tv' &&
            <>
                <div className="div-movie-pesquisar-genero">
                    {movies.map(movie => {
                        return (
                            <>
                                <div className='movie-pesquisar' title={movie.name}>
                                    <Link to={`/assistir=${filmeSerie}&${movie.id}`}>
                                        <img loading="lazy" src={`${image_path}${movie.poster_path}`} alt={movie.name} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-erro-exclamacao.png";}}/>
                                        <section className="section-informacoes-movie-pesquisar">
                                            <span><i class="fas fa-star"></i>{movie.vote_average.toFixed(1)}</span>
                                                    {movie.first_air_date &&
                                                        <span>{movie.first_air_date.slice(0,4)}</span>
                                                    }
                                                    {movie.release_date &&
                                                        <span>{movie.release_date.slice(0,4)}</span>
                                                    }
                                        </section>
                                    </Link>
                                    <span className="titulo-movie">{movie.name}</span>
                                </div>
                            </>
                            )
                        })
                    }
                </div>
            </>
        }
        <div className="div-generos bts-anterior-proximo">
            <div id="div-bts-paginas-generos" className="div-bts-paginas-generos div-generos">
                {Number(numeroPagina) > 1 && 
                    <section>
                        <input className="input-escolher-genero" type="radio" name="input-radio-genero" id="input-paginas-genero=1"/>
                        <label className="label-escolher-genero label-bt-pagina-genero" id="label-paginas-generos=1" for="input-paginas-genero=1">
                            <Link onClick={()=>window.scrollTo(0,0)} to={`/${filmeSerie}/genero=${idGenero}/${generoPesquisado}&infantil=${infantil}&pagina=${Number(numeroPagina) - 1}`} className="bt-pagina-pesquisar"><i class="fa-solid fa-angle-left"></i> Anterior</Link>
                        </label>
                    </section>
                }
                {Number(numeroPagina) < totalResultados && 
                    <section>
                        <input className="input-escolher-genero" type="radio" name="input-radio-genero" id="input-paginas-genero=2"/>
                        <label className="label-escolher-genero label-bt-pagina-genero" id="label-paginas-generos=2" for="input-paginas-genero=2">
                            <Link onClick={()=>window.scrollTo(0,0)} to={`/${filmeSerie}/genero=${idGenero}/${generoPesquisado}&infantil=${infantil}&pagina=${Number(numeroPagina) + 1}`} className="bt-pagina-pesquisar">Ver mais <i class="fa-solid fa-angle-right"></i></Link>
                        </label>
                    </section>
                }
            </div>
        </div>
    </div>
    )
}