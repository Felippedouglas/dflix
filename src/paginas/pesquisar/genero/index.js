import { Link, useParams } from "react-router-dom";
import './style.css';
import { useEffect, useState } from "react";
import { APIKey } from "../../../config/key";


//swiper slide
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode } from "swiper";


export default function PesqusiarGenero() {

    const { generoPesquisado, idGenero, numeroPagina, filmeSerie, infantil } = useParams();
    const [ definirFilmeSerie, setDefinirFilmeSerie ] = useState();
    const [ generos, setGeneros ] = useState([]);
    const [ movies, setMovies ] = useState([]);
    const [ totalResultados, setTotalResultados ] = useState();
    const image_path = 'https://image.tmdb.org/t/p/w200';
    
    const [ idioma, setIdioma ] = useState();

    document.title = `${definirFilmeSerie} ${idioma == 'portugues' ? 'de' : 'of'} ${generoPesquisado} - DFLIX`;
    document.querySelector("meta[name=theme-color]").setAttribute("content", '#181818');
    if(Number(numeroPagina) == 0) {
        window.location.href = "/404"
    }

    // filmes/séries com genero pesquisado
    useEffect(() => {

        var idioma = localStorage.getItem('idioma') || 'portugues';
        setIdioma(idioma);

        fetch(`https://api.themoviedb.org/3/discover/${filmeSerie}?api_key=${APIKey}&language=${idioma == 'portugues' ? 'pt-BR' : 'en-US'}&sort_by=popularity.desc&with_genres=${idGenero}&page=${numeroPagina}`)
            .then(Response => Response.json())
            .then(data => {
                if (data) {
                    setMovies(data.results);
                    setTotalResultados(data.total_pages);
                }
            })

        window.scrollTo(0,0);
    }, [numeroPagina, generoPesquisado, filmeSerie, infantil, idioma])

    // lista de generos dos filmes e séries
    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/genre/${filmeSerie}/list?api_key=${APIKey}&language=${idioma == 'portugues' ? 'pt-BR' : 'en-US'}`)
            .then(Response => Response.json())
            .then(data => {
                setGeneros(data.genres)
            })
    }, [filmeSerie, idioma])

    setTimeout(()=> {
        if (filmeSerie == 'movie') {
            setDefinirFilmeSerie(`${idioma == 'portugues' ? 'Filmes' : 'Movies'}`);
        } else if (filmeSerie == 'tv') {
            setDefinirFilmeSerie(`${idioma == 'portugues' ? 'Séries' : 'Series'}`);
        }

        if (idGenero != 10762) {
            document.getElementById(`label-genero-${idGenero}`).click();
        }

    }, 1);
    
    return(
        <div className="div-genero-pesquisado">
        <header className="header-componente-pesquisar">
            {numeroPagina &&
                <>
                    {idGenero &&
                    <>
                        {idioma == 'portugues' &&
                            <h2 className="h2-titulo-generos" id="h2-filmes-com-genero-encontrados">{definirFilmeSerie} {idGenero == 10762 || idGenero == 53 || idGenero == 10751 ? '' : 'de' } {generoPesquisado}</h2>
                        }
                        {idioma == 'ingles' &&
                            <h2 className="h2-titulo-generos" id="h2-filmes-com-genero-encontrados">{definirFilmeSerie} {idGenero == 10762 || idGenero == 53 || idGenero == 10751 ? '' : 'of' } {generoPesquisado}</h2>
                        }
                    </>
                    }
                </>
            }
        </header>
        {infantil == 'false'  &&
            <div className="div-generos" id="div-generos">
                <Swiper
                    slidesPerView={'auto'}
                    spaceBetween={10}
                    freeMode={false}
                    pagination={{
                    clickable: true,
                    }}
                    modules={[FreeMode]}
                    className="mySwiper"
                    id="swiper-slide"
                >
                {generos.map(genero => {
                        return (
                            <SwiperSlide key={`genero-${genero.id}`}>
                                <section className="genero">
                                    <input className="input-escolher-genero" type='radio' name='input-radio-genero' id={`input-genero-${genero.id}`}/>
                                    <label className="label-escolher-genero" id={`label-genero-${genero.id}`} htmlFor={`input-genero-${genero.id}`}>
                                        <Link to={`/${filmeSerie}/genero=${genero.id}/${genero.name}&infantil=${infantil}&pagina=1`}>{genero.name}</Link>
                                    </label>
                                </section>
                            </SwiperSlide>
                        )
                        })
                    }
                </Swiper>
                <div className="div-svg-arrastar-pesquisar-generos">
                    <svg className='svg-arrastar svg-arrastar-pesquisar-generos' role="img" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><path d="m 8.5012922,2.66422 c -0.06125,0.0782 -0.153601,0.12311 -0.25338,0.12311 -0.06493,0 -0.129291,-0.0195 -0.186136,-0.0564 L 7.3757242,2.28555 c -0.07951,-0.0517 -0.134135,-0.13129 -0.153913,-0.22413 -0.01978,-0.093 -0.0021,-0.18814 0.04951,-0.26761 l 0.414449,-0.63832 c 0.06325,-0.0973 0.167602,-0.15542 0.279292,-0.15542 0.152669,0 0.280625,0.10293 0.318493,0.25627 l 0.08147,0.33027 c 0.602274,0.0326 1.264325,0.1908 1.8954878,0.45672 0.588184,0.24787 1.126812,0.5776 1.557706,0.95347 0.129468,0.11298 0.142891,0.30947 0.02991,0.43899 -0.06151,0.0705 -0.14778,0.10657 -0.234536,0.10657 -0.07254,0 -0.145424,-0.0252 -0.204403,-0.0767 C 11.027586,3.13276 10.546825,2.83921 10.018864,2.61671 9.5188582,2.406 9.0012522,2.27089 8.5218692,2.2224 l 0.038,0.15405 c 0.02542,0.10289 0.004,0.20778 -0.05858,0.28778 z m -6.375359,7.88964 0.556006,-1.0861 -0.05356,-0.80343 c -0.024,-0.3481 0.04711,-0.69699 0.205646,-1.00886 l 0.952633,-1.87393 c 0.116357,-0.21889 0.475917,-0.45329 0.825698,-0.45329 0.07076,0 0.13938,0.009 0.203691,0.0278 0.101824,0.029 0.305115,0.0602 0.501695,0.0903 0.245958,0.0377 0.500317,0.0767 0.674452,0.12587 0.08987,0.0251 0.285959,0.0572 0.475694,0.0882 0.251292,0.0411 0.511206,0.0836 0.68143,0.13151 0.16649,0.0471 0.31547,0.12489 0.432227,0.22178 0.385471,-0.5809 1.309748,-1.97247 1.450638,-2.17909 l -0.001,-7.1e-4 c 0.125024,-0.19125 0.316759,-0.29658 0.539961,-0.29658 0.26227,0 0.5223618,0.148 0.6625408,0.37716 0.123868,0.20244 0.133202,0.43934 0.02578,0.64947 L 8.0879742,8.84112 c 0.0704,0.0196 0.172313,0.0396 0.29467,0.0396 0.186136,0 0.366716,-0.0466 0.537073,-0.13866 l 0.04849,-0.0261 c 0.0612,-0.0329 0.117602,-0.0633 0.170758,-0.0923 0.137601,-0.0741 0.279514,-0.1116 0.421871,-0.1116 0.285959,0 0.5421838,0.15569 0.6687188,0.40631 0.130179,0.25778 0.09698,0.56197 -0.08876,0.81366 -0.3488928,0.47276 -1.4741488,1.37481 -3.1619018,1.95357 l -0.54165,1.06046 c -0.0796,0.15658 -0.23858,0.25387 -0.414849,0.25387 0,0 0,0 -4.5e-5,0 -0.07249,0 -0.145068,-0.0174 -0.20978,-0.0503 l -3.483327,-1.77068 c -0.110357,-0.0561 -0.192402,-0.15209 -0.230892,-0.27027 -0.03849,-0.11814 -0.02884,-0.24401 0.0276,-0.35494 z"/></svg>
                </div>
            </div>
        }
        {filmeSerie =='movie' &&
            <div className="div-movie-pesquisar-genero">
                {movies.map(movie => {
                    return (
                        <div className='movie-pesquisar' key={`movie-${movie.id}`}>
                            <Link to={`/assistir=${filmeSerie}&${movie.id}`}>
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
        }
        {filmeSerie =='tv' &&
            <div className="div-movie-pesquisar-genero">
                {movies.map(movie => {
                    return (
                        <div className='movie-pesquisar' key={`tv-${movie.id}`}>
                            <Link to={`/assistir=${filmeSerie}&${movie.id}`}>
                                <img loading="lazy" src={`${image_path}${movie.poster_path}`} alt={movie.name} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-erro-exclamacao.png";}}/>
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
                            <span className="titulo-movie" title={movie.name}>{movie.name}</span>
                        </div>
                        )
                    })
                }
            </div>
        }
        <div className="div-generos bts-anterior-proximo">
            <div id="div-bts-paginas-generos" className="div-bts-paginas-generos div-generos">
                {Number(numeroPagina) > 1 && 
                    <section>
                        <input className="input-escolher-genero" type="radio" name="input-radio-genero" id="input-paginas-genero-1"/>
                        <label className="label-escolher-genero label-bt-pagina-genero" id="label-paginas-generos=1" htmlFor="input-paginas-genero-1">
                            {idioma == 'portugues' &&
                                <Link to={`/${filmeSerie}/genero=${idGenero}/${generoPesquisado}&infantil=${infantil}&pagina=${Number(numeroPagina) - 1}`} className="bt-pagina-pesquisar"><i className="fa-solid fa-angle-left"></i>  Anterior: {Number(numeroPagina) - 1}</Link>
                            }
                            {idioma == 'ingles' &&
                                <Link to={`/${filmeSerie}/genero=${idGenero}/${generoPesquisado}&infantil=${infantil}&pagina=${Number(numeroPagina) - 1}`} className="bt-pagina-pesquisar"><i className="fa-solid fa-angle-left"></i>  Previous: {Number(numeroPagina) - 1}</Link>
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
                                <Link to={`/${filmeSerie}/genero=${idGenero}/${generoPesquisado}&infantil=${infantil}&pagina=${Number(numeroPagina) + 1}`} className="bt-pagina-pesquisar">{numeroPagina == 1 ? 'Ver mais' : `Próximo: ${Number(numeroPagina) + 1}`} <i className="fa-solid fa-angle-right"></i></Link>
                            }
                            {idioma == 'ingles' &&
                                <Link to={`/${filmeSerie}/genero=${idGenero}/${generoPesquisado}&infantil=${infantil}&pagina=${Number(numeroPagina) + 1}`} className="bt-pagina-pesquisar">{numeroPagina == 1 ? 'More' : `Next: ${Number(numeroPagina) + 1}`} <i className="fa-solid fa-angle-right"></i></Link>
                            }
                        </label>
                    </section>
                }
            </div>
        </div>
    </div>
    )
}