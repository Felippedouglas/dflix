import { useState, useEffect, React, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { APIKey } from "../../config/key";
import Sugestao from "../paginas-movie/sugestoes";
import Comentarios from "./componentes/comentarios";
import VideosFilmeSerie from "./componentes/trailers-filme-serie";
import Atores from "./componentes/atores";
import Compartilhar from "./componentes/compartilhar";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import './style.css';
import backgroundErro from '../../componentes/imgs/img-erro-background-pessoa.png';
import LogoGoogle from '../../componentes/imgs/logo-google.png';

//swiper slide
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode } from "swiper";
import PopUp from "../../componentes/pop-up";
import Alert from "../../componentes/alert";
import DetalhesTemporada from "./componentes/detalhes-temporada";
import { AppFirebase } from "../../service/firebase";
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import Usuario from "../usuario";

export default function Assistir() {

    const [ user, setUser ] = useState({});
    const { filmeSerie, id, preview } = useParams();

    const [ alert, setAlert ] = useState(false);
    const [ alertTitle, setAlertTitle ] = useState();
    const [ alertMessage, setAlertMessage ] = useState();

    const [ spanFazerLogin, setSpanFazerLogin ] = useState(false);

    const [ popUp, setPopUp ] = useState(false);
    const [ detalhesTemporada, setDetalhesTemporada ] = useState(false);
    const [ movie, setMovie ] = useState({});
    const [ classificacaoIndicativa, setClassificacaoIndicativa ] = useState();
    const [ opcaoAssistir, setOpcaoAssistir ] = useState(1);
    const [ temporada, setTemporada ] = useState();
    const [ episodio, setEpisodio ] = useState();
    const [ episodios, setEpisodios] = useState([]);
    const [ totalTemporadas, setTotalTemporadas ] = useState(1);
    const image_path = 'https://image.tmdb.org/t/p/w200';
    const [ definirFilmeSerie, setDefinirFilmeSerie ] = useState();
    const [ idImdb, setIdImdb ] = useState();
    const [ scrollDivTemporadas, setScrollDivTemporadas ] = useState();
    const [ scrollDivEpisodios, setScrollDivEpisodios ] = useState();
    const [ economiaInternet, setEconomiaInternet ] = useState();

    // favoritos
    const [ favoritoIsTrue, setFavoritoIsTrue ] = useState(false);
    const [ nomeMovieFavorito, setNomeMovieFavorito ] = useState();
    const [ descriptionMovieFavorito, setDescriptionMovieFavorito ] = useState();
    const [ imgMovieFavorito, setImgMovieFavorito ] = useState();
    const [ imgBackgroundMovieFavorito, setImgBackgroundMovieFavorito ] = useState();
    const [ idMovieFavorito, setIdMovieFavorito ] = useState();
    const [ imdbIdMovieFavorito, setImdbIdMovieFavorito ] = useState();
    const [ tipoMovieFavorito, setTipoMovieFavorito ] = useState();
    const [ yearMovieFavorito, setYearMovieFavorito ] = useState();
    const [ runTimeMovieFavorito, setRunTimeMovieFavorito ] = useState();
    const [ voteAverageMovieFavorito, setVoteAverageMovieFavorito ] = useState();
    const [ favoritos, setFavoritos ] = useState();
    const [ widthPagina, setWidthPagina ] = useState();

    const constScrollAssistir = useRef(null);
    const constScrollDirecionar = useRef(null);

    const [ idioma, setIdioma ] = useState();

    const scrollAssitir = () =>
        window.scrollTo({
        top: constScrollAssistir.current.offsetTop - 100,
        behavior: "smooth",
    });

    const scrollDirecionar = () =>
        window.scrollTo({
        top: constScrollDirecionar.current.offsetTop - 100,
        behavior: "smooth",
    });

    setInterval(()=> {
        setWidthPagina(document.body.clientWidth);
    })

    setTimeout(()=> {

        if (filmeSerie == 'movie') {
            setDefinirFilmeSerie(`${idioma == 'portugues' ? 'Filme' : 'Movie'}`);
            setNomeMovieFavorito(movie.title)
            setYearMovieFavorito(movie.release_date)
            setRunTimeMovieFavorito(movie.runtime)
        } else if (filmeSerie == 'tv') {
            setDefinirFilmeSerie(`${idioma == 'portugues' ? 'Série' : 'Serie'}`);
            setNomeMovieFavorito(movie.name)
            setYearMovieFavorito(movie.first_air_date)
            setRunTimeMovieFavorito(movie.episode_run_time)
        }

        setTimeout(()=>{
            VerificarFavorito()
        }, 1)
    }, 1);
    
    // filme ou série
    useEffect(() => {
        
        var idioma = localStorage.getItem('idioma') || 'portugues';
        setIdioma(idioma);
        
        if (filmeSerie && id) {
            fetch(`https://api.themoviedb.org/3/${filmeSerie}/${id}?api_key=${APIKey}&vote_count.gte=10&language=${idioma == 'portugues' ? 'pt-BR' : 'en-US'}`)
            .then(Response => Response.json())
            .then(data => {

                console.log(data)
                
                const database = getFirestore(AppFirebase);
                const favoritosCollectionRef = collection(database, `users/${user.uid}/favoritos`);

                const getFavoritos = async () => {
                    const data = await getDocs(favoritosCollectionRef);
                    setFavoritos(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
                }
                
                getFavoritos();
                
                setMovie(data);
                setTotalTemporadas(data.number_of_seasons)
                setDescriptionMovieFavorito(data.overview)
                setImgMovieFavorito(`${image_path}${data.poster_path}`)
                setImgBackgroundMovieFavorito(`${image_path}${data.backdrop_path}`)
                setIdMovieFavorito(data.id)
                setTipoMovieFavorito(filmeSerie)
                setVoteAverageMovieFavorito(data.vote_average)
            });
        }
            
        setTimeout(()=>{
            if (movie.title) {
                document.title = `${movie.title} | DFLIX`;
                setNomeMovieFavorito(movie.title)
            } else if (movie.name) {
                document.title = `${movie.name} | DFLIX`;
                setNomeMovieFavorito(movie.name)
            }
        }, 100);

        document.querySelector("meta[name=theme-color]").setAttribute("content", '#181818');

        VerificarFavorito();
    }, [id, favoritoIsTrue, idioma, widthPagina, user]);

    // id imdb filme e série
    useEffect(() => {

        if (filmeSerie && id) {
            fetch(`https://api.themoviedb.org/3/${filmeSerie}/${id}/external_ids?api_key=${APIKey}&language=${idioma == 'portugues' ? 'pt-BR' : 'en-US'}`)
            .then(Response => Response.json())
            .then(data => {
                setIdImdb(data.imdb_id);
                setImdbIdMovieFavorito(data.imdb_id);
    
                
                if (filmeSerie == 'movie' && !preview) {
                    document.getElementById("label-escolher-opcao-video-1").click()
                }
                
            });
        }

        setEconomiaInternet(localStorage.getItem('economia'));

    }, [id, favoritoIsTrue, widthPagina, user]);

    // detalhes da temporada de uma série

    useEffect(() => {
        if (temporada) {   
            fetch(`https://api.themoviedb.org/3/tv/${id}/season/${temporada}?api_key=${APIKey}&language=${idioma == 'portugues' ? 'pt-BR' : 'en-US'}`)
            .then(Response => Response.json())
            .then(data => {
                setEpisodios(data.episodes);
            });
        }

    }, [id, favoritoIsTrue, temporada, widthPagina, user]);

    //classificação idicativa

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
            if (filmeSerie && id) {
                fetch(`https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${APIKey}`)
                .then(Response => Response.json())
                .then(data => {
        
                    data.results.map((certification)=>{
                        if(certification.iso_3166_1 == "BR" ) {
                            setClassificacaoIndicativa(certification.release_dates[0].certification)
                        }
                    })
                });
            }
        }
    }, [id, favoritoIsTrue, widthPagina, user]);

    //conversor de minutos em horas
    
    const converter = (minutos) => {
        const horas = Math.floor(minutos/ 60);
        const min = minutos % 60;
        const textoHoras = (`${horas}`);
        const textoMinutos = (`${min}`);

        if (minutos <= 59) {
            return `${textoMinutos}min`;
        } else if (minutos == 60) {
            return `${textoHoras }h`;
        } else if (minutos >= 61) {
            return `${textoHoras }h, ${textoMinutos}min`;
        }
    };
    
    function scrollDivTemporadasAssistir() {
        setScrollDivTemporadas(document.getElementById("section-temporadas-serie-assistir").scrollLeft);
    }
    function scrollDivEpisodiosAssistir() {
        setScrollDivEpisodios(document.getElementById("section-episodios-serie-assistir").scrollLeft);
    }

    function pesquisarGenero(genero, idGenero) {
        window.location.href = `/#/${filmeSerie}/genero=${idGenero}/${genero}&infantil=false&pagina=1`;
    }

    function redirecionarErro() {
        window.location = '/404';
    }

    //functions favoritos
    const database = getFirestore(AppFirebase);

    function salvarFavoritos() {

        if (user.uid) {
            if (idImdb) {
                async function adicionarFavoritos() {
        
                    await setDoc(doc(database, 'users', user.uid, 'favoritos', idImdb), {
                        name: nomeMovieFavorito,
                        description: descriptionMovieFavorito,
                        img: imgMovieFavorito,
                        imgBackground: imgBackgroundMovieFavorito,
                        type: tipoMovieFavorito,
                        year: yearMovieFavorito,
                        runtime: runTimeMovieFavorito,
                        vote_average: voteAverageMovieFavorito,
                        idMovie: idMovieFavorito,
                        imdbId: imdbIdMovieFavorito,
                        data: new Date()
                    });
                }
        
                setFavoritoIsTrue(true);

                setTimeout(()=>{
                    adicionarFavoritos();
                }, 100)
            } else {
                if (!alert) {
                    setAlert(true);
                    setSpanFazerLogin(true);
                    setTimeout(()=>{
                        setAlert(false)
                    }, 5000)
                }

                setAlertTitle(`${idioma == 'portugues' ? 'Erro' : 'Error'}`)
                setAlertMessage(`${idioma == 'portugues' ? "Indisponível para adicionar aos favoritos!" : "Login required to add favorites!"}`);
            }            
            
        } else {
            
            if (!alert) {
                setAlert(true);
                setSpanFazerLogin(true);
                setTimeout(()=>{
                    setAlert(false)
                }, 5000)
            }
            
            setAlertTitle(`${idioma == 'portugues' ? 'Erro' : 'Error'}`)
            setAlertMessage(`${idioma == 'portugues' ? "Faça login para adicionar favoritos!" : "Login required to add favorites!"}`);
        }
    }
    
    async function removerFavoritos(e) {
        await deleteDoc(doc(database, 'users', user.uid, 'favoritos', e));

        if (preview) {
            window.location.href = `/#/assistir=${filmeSerie}&${id}`
        } else {
            window.location.href = `/#/preview/${filmeSerie}&${id}`
        }
    }

    async function VerificarFavorito() {

        if (user.uid) {
            favoritos && favoritos.map(favorito => {
                if (favorito.imdbId == idImdb) {
                    setFavoritoIsTrue(true)
                }
            })
        }
    }

    function definirTemporada(e) {
        setTemporada(e)
        
        setTimeout(()=>{
            if (episodio) {
                setTimeout(()=>{
                    setEpisodio('');
                }, 1000)
            }
            document.getElementById("section-episodios-serie-assistir").scrollTo(0,0);
        }, 1)

        window.location.href = `/#/assistir=${filmeSerie}&${id}`;
    }

    function definirEpisodio(e) {
        setEpisodio(e)
        setTimeout(()=>{
            if (opcaoAssistir == 2) {
                document.getElementById("label-escolher-opcao-video-2").click();
            } else {
                document.getElementById("label-escolher-opcao-video-1").click();
            }

            setTimeout(()=>{
                scrollDirecionar();
            }, 10)
        }, 100)
    }
    
    var divSliderTemporadas = document.getElementById("section-temporadas-serie-assistir")

    function btLeftSlideTemporadas() {
        divSliderTemporadas.scrollLeft -= 200;
    }
    
    function btRightSlideTemporadas() {
        divSliderTemporadas.scrollLeft += 200;
    }

    var divSliderEpisodios = document.getElementById("section-episodios-serie-assistir")

    function btLeftSlideEpisodios() {
        divSliderEpisodios.scrollLeft -= 200;
    }
    
    function btRightSlideEpisodios() {
        divSliderEpisodios.scrollLeft += 200;
    }

    function definirOpcaoAssistir(e) {
        setOpcaoAssistir(e)

        setTimeout(()=>{
            scrollDirecionar();
        }, 10)
    }
    
    return(
        <>

            <Usuario setUser={setUser}/>

            <Alert alert={alert} alertTitle={alertTitle} alertMessage={alertMessage}/>

            <PopUp popUp={popUp} setPopUp={setPopUp}>

                <h2 className='h2-titulo-popup'>
                    <span><i className="fa-solid fa-ban"></i> {idioma == 'portugues' ? 'Anuncios' : 'ADS'} </span>
                    <button className='bt-fechar-popup' onClick={()=>setPopUp(false)}><i className="fa-solid fa-xmark"></i></button>
                </h2>

                <div className="div-bloquear-anuncios-assistir">
                    <header>
                        <img src="https://brave.com/static-assets/images/brave-logo.svg"/>
                    </header>
                    <main>
                        {idioma == 'portugues' &&
                            <span>O navegador Brave te permite assistir aos filmes e séries sem anuncios e de graça, disponível para desktop, android, ios e mais.</span>
                        }
                        {idioma == 'ingles' &&
                            <span>The Brave browser lets you watch movies and series without ads and for free, available for desktop, android, ios and more.</span>
                        }
                        <span className="span-verifique-politicas-privacidade">{idioma == 'portugues' ? '*Verifique as políticas de privacidade!' : '*Check privacy policy!'}</span>
                    </main>
                    <footer>
                        <a href='https://play.google.com/store/apps/details?id=com.brave.browser&hl=en' target="_Blank">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/768px-Google_Play_Store_badge_EN.svg.png?20190913154415"/>
                        </a>
                        <a href='https://apps.apple.com/us/app/brave-private-web-browser/id1052879175?mt=8&ign-mpt=uo%3D4' target="_Blank">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"/>
                        </a>
                        <a href='https://brave.com' target="_Blank">
                            <img className="logo-brave" src="https://brave.com/static-assets/images/brave-logo.svg"/>
                        </a>
                    </footer>
                </div>
            </PopUp>
            {detalhesTemporada &&
                <DetalhesTemporada totalTemporadas={totalTemporadas} classificacaoIndicativa={classificacaoIndicativa} titulo={movie.name} descricao={movie.overview} id={id} idImdb={idImdb} temporada={temporada} setTemporada={setTemporada} detalhesTemporada={detalhesTemporada} setDetalhesTemporada={setDetalhesTemporada}/>
            }
            {movie.id &&
                <div className="container-assistir" id="container-assistir">
                    <div className="all-content-assistir">
                        <div className="content-movie-assistir" style={{backgroundImage: document.body.clientWidth >= 800 && !economiaInternet ? `url(https://image.tmdb.org/t/p/w500${movie.backdrop_path})` : !economiaInternet ? `url(https://image.tmdb.org/t/p/w500${movie.poster_path})` : ''}}>
                            <div className="movie-assistir">
                                <div className="div-imagem-movie-assistir">
                                    <img loading="lazy" src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} id='img-movie-assistir' alt={movie.name} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src='https://dflix.netlify.app/imagens/img-erro-exclamacao.png';}}/>
                                    <img loading="lazy" src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} id='img-movie-assistir-background' alt={movie.name} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src='https://dflix.netlify.app/imagens/img-erro-exclamacao.png';}}/>
                                </div>
                                <div className="detalhes-movie-assistir">
                                    <span className="span-assistir-filmes-series">{definirFilmeSerie}</span>
                                    <h1 className="titulo-movie-assistir">{movie.title}{movie.name}</h1>
                                    <div className="div-compartilhar-e-favorito">
                                        {preview ?
                                            <Tippy content={idioma == 'portugues' ? 'Ver mais detalhes' : 'View more details'}>
                                                <Link className="bt-assistir-preview-movie" to={`/assistir=${filmeSerie}&${id}`}><i className="fa-solid fa-plus"></i> <small>{idioma == 'portugues' ? 'Detalhes' : 'Details'}</small></Link>
                                            </Tippy>
                                            : <Tippy content={filmeSerie == 'tv' && idioma == 'portugues' ? 'Assistir Série' : filmeSerie == 'movie' && idioma == 'portugues' ? 'Assistir Filme' : filmeSerie == 'serie' && idioma == 'ingles' ? 'Watch Movie' : 'Watch serie'}>
                                                <button onClick={scrollAssitir} className="bt-assistir-preview-movie"><i className='fas fa-play'></i> <small>{idioma == 'portugues' ? 'Assistir' : 'Watch'}</small></button>
                                            </Tippy>
                                        }
                                        {idImdb &&
                                            <Tippy content={favoritoIsTrue && idioma == 'portugues' ? 'Remover dos favoritos' : !favoritoIsTrue && idioma == 'portugues' ? 'Adicionar aos favoritos' : favoritoIsTrue && idioma == 'ingles' ? 'Remove from favorites' : 'Add to Favorites'}>
                                                {favoritoIsTrue ? <button className="botao-favorito botao-remover-favorito" onClick={()=>removerFavoritos(idImdb)}><i className="fa-solid fa-heart-circle-plus"></i></button>
                                                : <button id="bt-remover-favorito-assistir" className="botao-favorito botao-adicionar-favorito" onClick={()=>salvarFavoritos()}><i className="fa-regular fa-heart"></i></button>
                                                }
                                            </Tippy>
                                        }
                                    </div>
                                    {spanFazerLogin && 
                                        <Link to='/conta' className="span-login-assistir-add-favorito"><img src={LogoGoogle}/>Fazer Login</Link>
                                    }
                                    <Atores id={id} filmeSerie={filmeSerie} totalTemporadas={totalTemporadas}/>
                                    <div className="informacoes-movie-assistir">
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
                                            <SwiperSlide>
                                                <section title={movie.first_air_date ? `Lançado em: ${movie.first_air_date.slice(0,4)}` : `Lançado em: ${movie.release_date.slice(0,4)}`}>
                                                    {movie.first_air_date &&
                                                        <span>{movie.first_air_date.slice(0,4)}</span>
                                                    }
                                                    {movie.release_date &&
                                                        <span>{movie.release_date.slice(0,4)}</span>
                                                    }
                                                </section>
                                            </SwiperSlide>
                                            
                                            {classificacaoIndicativa &&
                                                <SwiperSlide>
                                                    <section title={(classificacaoIndicativa == 10) || (classificacaoIndicativa == 12) || (classificacaoIndicativa == 14) || (classificacaoIndicativa == 16) || (classificacaoIndicativa == 18) ? `Classificação indicativa: ${classificacaoIndicativa} Anos` : `Classificação indicativa: Livre`}>
                                                        <span className={`span-classificacao-indicativa span-classificacao-indicativa-${classificacaoIndicativa}`}>{classificacaoIndicativa}</span>
                                                    </section>
                                                </SwiperSlide>
                                            }
                                            {movie.vote_count > 0 &&
                                                <SwiperSlide>
                                                    <section title={`Avaliação: ${(movie.vote_average).toFixed(1)}`}>
                                                        <span><i className="fas fa-star"></i> {(movie.vote_average).toFixed(1)}</span>
                                                    </section>
                                                </SwiperSlide>
                                            }
                                            {movie.runtime &&
                                                <SwiperSlide>
                                                    <section className="lancamento-movie-assistir" title={`Duração: ${converter(movie.runtime)}`}>
                                                        <span className="duracao-movie-assistir"><i className="fa-regular fa-clock"></i> {converter(movie.runtime)}</span>
                                                    </section>
                                                </SwiperSlide>
                                            }
                                            {movie.episode_run_time && movie.episode_run_time.length == 1 && 
                                                <SwiperSlide>
                                                    <section className="lancamento-movie-assistir" title={`Duração: ${converter(movie.episode_run_time)} (Episódio)`}>
                                                        <span className="duracao-movie-assistir"><i className="fa-regular fa-clock"></i> {converter(movie.episode_run_time)}</span>
                                                    </section>
                                                </SwiperSlide>
                                            }
                                            {movie.number_of_seasons &&
                                                <SwiperSlide>
                                                    <section className="section-temporadas" title={`${movie.number_of_seasons} Temporadas e ${movie.number_of_episodes} Episódios`}>
                                                        <span>{movie.number_of_seasons}T. </span> | 
                                                        <span>{movie.number_of_episodes} EP's.</span>
                                                    </section>
                                                </SwiperSlide>
                                            }
                                            
                                            {idImdb &&
                                                <SwiperSlide>
                                                    <div className="div-logo-imdb">
                                                        <i className="fa-brands fa-imdb"></i>
                                                        <span>{idImdb}</span>
                                                    </div>
                                                </SwiperSlide>
                                            }
                                        </Swiper>
                                    </div>
                                    {movie.overview &&
                                        <span className="descricao-movie-assistir">{movie.overview}</span>
                                    }
                                    <div className="generos-movie-assistir">
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
                                            {movie.genres &&
                                                movie.genres.map((genero) => {
                                                    return(
                                                        <SwiperSlide key={`${genero.name}/${genero.id}`}>
                                                            <Tippy content={idioma == 'portugues' ? `Ver ${definirFilmeSerie}s de ${genero.name}` : `View ${definirFilmeSerie}s of ${genero.name}`}>
                                                                <span onClick={()=>pesquisarGenero(genero.name, genero.id)}>{genero.name}</span>
                                                            </Tippy>
                                                        </SwiperSlide>
                                                    )
                                                })
                                            }
                                        </Swiper>
                                    </div>
                                    {!preview &&
                                        <div className="div-compartilhar-e-favorito">
                                            <Compartilhar />
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                        {!preview &&
                            <>
                                {filmeSerie == 'tv' &&
                                    <div className="div-temporadas-episodios-serie-assistir" ref={constScrollAssistir}>
                                        <h2 className="h2-assistir">{idioma == 'portugues' ? 'Assistir' : 'Watch'} {movie.name}</h2>
                                        <div className="div-temporadas-serie-assistir" id="div-temporadas-serie-assistir">
                                            <h2 className="h2-titulo-temporada">{idioma == 'portugues' ? 'Temporada' : 'Season'}</h2>
                                            <section className="section-temporadas-serie-assistir" id="section-temporadas-serie-assistir" onScroll={()=>scrollDivTemporadasAssistir()}>
                                                {scrollDivTemporadas >= 20 &&
                                                    <button className="bt-slide-section-serie-assistir bt-left-section-serie-assistir" id="bt-left-section-temporadas-serie-assistir" onClick={()=>btLeftSlideTemporadas()}><i className="fas fa-angle-left"></i></button>
                                                }
                                                {movie.seasons &&
                                                    movie.seasons.map((season) => {
                                                        return(
                                                            <div className="div-escolher-temporada" key={`${season.name}/temporada=${season.season_number}`}>
                                                                {season.name != "Especiais" &&
                                                                    <section className="temporada-serie-assistir">
                                                                        <input type='radio' name='input-escolher-temporada' id={`input-escolher-temporada-${season.season_number}`}/>
                                                                        <label htmlFor={`input-escolher-temporada-${season.season_number}`} onClick={()=>definirTemporada(season.season_number)}>
                                                                            <img loading="lazy" src={!economiaInternet ? `${image_path}${season.poster_path}` : `${backgroundErro}`} alt={season.name}  onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-avatar.png";}}/>
                                                                            <span className="span-hover-n-temporada">{season.season_number}</span>
                                                                        </label>
                                                                    </section>
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                }
                                                <button className="bt-slide-section-serie-assistir bt-right-section-serie-assistir" id="bt-right-section-temporadas-serie-assistir" onClick={()=>btRightSlideTemporadas()}><i className="fas fa-angle-right"></i></button>
                                            </section>
                                            {temporada && <button className="bt-abrir-detalhes-temporada" onClick={()=>setDetalhesTemporada(true)}>{idioma == 'portugues' ? `detalhes da ${temporada}° temporada` : `details of ${temporada}° season`} <i className="fa-solid fa-arrow-right"></i></button>}
                                        </div>
                                        
                                        {temporada &&
                                            <div>
                                                <h2 className="h2-titulo-episodio">{idioma == 'portugues' ? 'Episódios' : 'Episodes'}</h2>
                                                <section id="section-episodios-serie-assistir" className={`section-episodios-serie-assistir ${temporada? 'mostrar-episodios-serie-assistir' : ''}`} onScroll={()=>scrollDivEpisodiosAssistir()}>
                                                    {scrollDivEpisodios >= 20 &&
                                                        <button className="bt-slide-section-serie-assistir bt-left-section-serie-assistir" id="bt-left-section-episodios-serie-assistir" onClick={()=>btLeftSlideEpisodios()}><i className="fas fa-angle-left"></i></button>
                                                    }
                                                    {movie.seasons &&
                                                        episodios.map(ep => {
                                                            return(
                                                                <section className="episodio-serie-assistir" key={`episodio=${ep.episode_number}/${ep.name}`}>
                                                                    <input type='radio' name='input-escolher-episodio' id={`input-escolher-episodio-${ep.episode_number}`}/>
                                                                    <label htmlFor={`input-escolher-episodio-${ep.episode_number}`} onClick={()=>definirEpisodio(ep.episode_number)}>
                                                                        <img loading="lazy" src={!economiaInternet && ep.still_path ? `${image_path}${ep.still_path}` : `${backgroundErro}`} alt={ep.name}  onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-erro-background-pessoa.png";}}/>
                                                                        <Link to={`/assistir=tv&${id}/${temporada}/${ep.episode_number}`}id={`link-escolher-episodio-${ep.episode_number}`}  className="span-hover-n-episodio a-episodio-serie">
                                                                            <span>{ep.episode_number}</span>
                                                                            <Tippy content='Assistido'>
                                                                                <span className="olho-episodio-visualizado"> <i className="fa-solid fa-eye"></i></span>
                                                                            </Tippy>
                                                                        </Link>
                                                                    </label>
                                                                </section>
                                                            )
                                                        })
                                                    }
                                                    <button className="bt-slide-section-serie-assistir bt-right-section-serie-assistir" id="bt-right-section-temporadas-serie-assistir" onClick={()=>btRightSlideEpisodios()}><i className="fas fa-angle-right"></i></button>
                                                </section>
                                            </div>
                                        }
                                        {episodio &&
                                        <section className={`section-opcoes-video ${episodio ? 'mostrar-opcoes-video' : ''}`}>
                                                <span className="span-informacoes-video-assistir">{idioma == 'portugues' ? `Assistir ${temporada}° temporada / ep. ${episodio}` : `Watch ${temporada}° season / ep. ${episodio}`}</span>
                                                    <div className="div-opcoes-video-assistir">
                                                        <section className="opcao-video-assistir">
                                                            <input type='radio' name='input-escolher-opcao-video' id={`input-escolher-opcao-video-1`}/>
                                                            <label htmlFor={`input-escolher-opcao-video-1`} id='label-escolher-opcao-video-1' onClick={()=>definirOpcaoAssistir(1)}>
                                                                <span className="span-hover-opcao-video">{idioma == 'portugues' ? 'opção 1' : 'option 1'}</span>
                                                            </label>
                                                        </section>
                                                        <section className="opcao-video-assistir">
                                                            <input type='radio' name='input-escolher-opcao-video' id={`input-escolher-opcao-video-2`}/>
                                                            <label htmlFor={`input-escolher-opcao-video-2`} id='label-escolher-opcao-video-2' onClick={()=>definirOpcaoAssistir(2)}>
                                                                <span className="span-hover-opcao-video">{idioma == 'portugues' ? 'opção 2' : 'option 2'}</span>
                                                            </label>
                                                        </section>
                                                    </div>
                                                    <div className="div-abrir-pop-up-bloquear-anuncios">  
                                                        <button onClick={()=>setPopUp(true)}><i className="fa-solid fa-ban"></i> {idioma == 'portugues' ? 'Bloquear Anuncios' : 'Block ads'} </button>
                                                    </div>
                                        </section>
                                        }
                                    </div>
                                }
                                
                                {filmeSerie == 'movie' &&
                                    <section className='mostrar-opcoes-video' ref={constScrollAssistir}>
                                        <span className="span-informacoes-video-assistir">{idioma == 'portugues' ? 'Assistir' : 'Watch'} {movie.title}</span>
                                        {filmeSerie == 'movie' &&
                                            <div className="div-opcoes-video-assistir">
                                                <section className="opcao-video-assistir">
                                                    <input type='radio' name='input-escolher-opcao-video' id={`input-escolher-opcao-video-1`}/>
                                                    <label htmlFor={`input-escolher-opcao-video-1`} id='label-escolher-opcao-video-1' onClick={()=>setOpcaoAssistir(1)}>
                                                        <span className="span-hover-opcao-video">{idioma == 'portugues' ? 'opção 1' : 'option 1'}</span>
                                                    </label>
                                                </section>
                                                <section className="opcao-video-assistir">
                                                    <input type='radio' name='input-escolher-opcao-video' id={`input-escolher-opcao-video-2`}/>
                                                    <label htmlFor={`input-escolher-opcao-video-2`}onClick={()=>setOpcaoAssistir(2)}>
                                                        <span className="span-hover-opcao-video">{idioma == 'portugues' ? 'opção 2' : 'option 2'}</span>
                                                    </label>
                                                </section>
                                            </div>
                                        }
                                        <div className="div-abrir-pop-up-bloquear-anuncios">  
                                            <button onClick={()=>setPopUp(true)}><i className="fa-solid fa-ban"></i> {idioma == 'portugues' ? 'Bloquear Anuncios' : 'Block ads'} </button>
                                        </div>
                                    </section>
                                }
                            </>
                        }

                        {filmeSerie == 'movie' && !preview &&
                            <div className="div-iframe-movie-assistir" id="iframe-assistir">
                                {opcaoAssistir == 2 &&
                                    <span className="span-alert-iframe"><i className="fa-solid fa-triangle-exclamation"></i> Alguns filmes podem não estar disponível nesta opção!</span>
                            }
                                <iframe src={opcaoAssistir == 1 ? `https://embed.warezcdn.net/filme/${idImdb}`
                                : `https://embedder.net/e/${idImdb}`} allowFullScreen scrolling="no" allowtransparency="true" height="500px" frameBorder="0"></iframe>
                            </div>
                        }
                        {filmeSerie == 'tv' && temporada && episodio && opcaoAssistir &&
                            <div className={'div-iframe-movie-assistir'} id="iframe-assistir" ref={constScrollDirecionar}>
                                {opcaoAssistir == 2 &&
                                    <span className="span-alert-iframe"><i className="fa-solid fa-triangle-exclamation"></i> Algumas Séries podem não estar disponível nesta opção!</span>
                                }
                                <iframe src={opcaoAssistir == 1 ? `https://embed.warezcdn.net/serie/${idImdb}/${temporada}/${episodio}`
                                : `https://embedder.net/e/series?imdb=${idImdb}&sea=${temporada}&epi=${episodio}`} allowFullScreen scrolling="no" allowtransparency="true" height="500px" frameBorder="0"></iframe>
                            </div>
                        }
                        {!preview &&
                            <>
                                <Sugestao idmovie={id}/>
                                {/*<VideosFilmeSerie id={id} filmeSerie={filmeSerie} definirFilmeSerie={definirFilmeSerie}/>*/}               
                                <Comentarios id={id} filmeSerie={filmeSerie} definirFilmeSerie={definirFilmeSerie}/>
                            </>
                        }
                    </div>
        
                    {window.scrollY >= 200 && !preview &&
                        <div className={window.scrollY >= 800 ? "nome-movie-scroll-ativado" : "nome-movie-scroll-desativado"}>
                            <span><i className="fa-solid fa-eye"></i> {movie.name ? movie.name : movie.title}</span>
                        </div>
                    }
                </div>

            }
            
            {movie.success == false &&
                redirecionarErro()
            }
        </>
    )
}