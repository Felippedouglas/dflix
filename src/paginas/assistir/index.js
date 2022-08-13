import { useState, useEffect, React, Component } from "react";
import { Link, useParams } from "react-router-dom";
import { APIKey } from "../../config/key";
import Sugestao from "../paginas-movie/sugestoes";
import Comentarios from "../assistir/componentes/comentarios";
import VideosFilmeSerie from "./componentes/trailers-filme-serie";
import Atores from "./componentes/atores";
import Compartilhar from "./componentes/compartilhar";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import './style.css';


export default function Assistir() {
    const { filmeSerie, id } = useParams();
    const [ movie, setMovie ] = useState({});
    const [ opcaoAssistir, setOpcaoAssistir ] = useState(1)
    const [ temporada, setTemporada ] = useState();
    const [ episodio, setEpisodio ] = useState();
    const [ episodios, setEpisodios] = useState([])
    const image_path = 'https://image.tmdb.org/t/p/w500';
    const [ definirFilmeSerie, setDefinirFilmeSerie ] = useState();
    const [ idImdb, setIdImdb ] = useState();
    const [ scrollDivTemporadas, setScrollDivTemporadas ] = useState()
    const [ scrollDivEpisodios, setScrollDivEpisodios ] = useState()


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
    const [ favoritos, setFavoritos ] = useState()

    setTimeout(()=> {
        if (filmeSerie == 'movie') {
            setDefinirFilmeSerie('filme');
            setNomeMovieFavorito(movie.title)
            setYearMovieFavorito(movie.release_date.slice(0,4))
            setRunTimeMovieFavorito(movie.runtime)
        } else if (filmeSerie == 'tv') {
            setDefinirFilmeSerie('serie');
            setNomeMovieFavorito(movie.name)
            setYearMovieFavorito(movie.first_air_date.slice(0,4))
            setRunTimeMovieFavorito(movie.episode_run_time[0])
        }

        setTimeout(()=>{
            {favoritos.map(favorito => {
                if (favorito.imdbId == idImdb) {
                    setFavoritoIsTrue(true)
                }
            })}
        }, 1)

    }, 1);

    // filme ou série
    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/${filmeSerie}/${id}?api_key=${APIKey}&language=pt-BR`)
        .then(Response => Response.json())
        .then(data => {
            
            const favoritosLocalStorage = JSON.parse(localStorage.getItem('favoritos') || "[]");
            setFavoritos(favoritosLocalStorage);
            
            setMovie(data);
            setDescriptionMovieFavorito(data.overview)
            setImgMovieFavorito(`${image_path}${data.poster_path}`)
            setImgBackgroundMovieFavorito(`${image_path}${data.backdrop_path}`)
            setIdMovieFavorito(data.id)
            setTipoMovieFavorito(filmeSerie)
            setVoteAverageMovieFavorito(data.vote_average)
        });
        
            
        setTimeout(()=>{
            if (movie.title) {
                document.title = `${movie.title} | DFLIX`;
                setNomeMovieFavorito(movie.title)
            } else if (movie.name) {
                document.title = `${movie.name} | DFLIX`;
                setNomeMovieFavorito(movie.name)
            }
        }, 100);
    }, [id, favoritoIsTrue, favoritos]);

    // id imdb filme e série
    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/${filmeSerie}/${id}/external_ids?api_key=${APIKey}&language=pt-BR`)
        .then(Response => Response.json())
        .then(data => {
            setIdImdb(data.imdb_id);
            setImdbIdMovieFavorito(data.imdb_id)
            setTimeout(()=>{
                document.getElementById("label-escolher-opcao-video").click()
            }, 10)
            });

    }, [id]);

    // detalhes da temporada de uma série

    useEffect(() => {
        if (temporada) {   
            fetch(`https://api.themoviedb.org/3/tv/${id}/season/${temporada}?api_key=${APIKey}&language=pt-BR`)
            .then(Response => Response.json())
            .then(data => {
                setEpisodios(data.episodes);
            });
        }

    }, [id, temporada]);
    
    const converter = (minutos) => {
        const horas = Math.floor(minutos/ 60);
        const min = minutos % 60;
        const textoHoras = (`${horas}`);
        const textoMinutos = (`${min}`);

        if (minutos <= 59) {
            return `${textoMinutos}min`;
        } else {
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
    function salvarFavoritos() {
        let favoritos = JSON.parse(localStorage.getItem('favoritos') || "[]")
        setFavoritoIsTrue(true)
      
        let favorito = {
          name: nomeMovieFavorito,
          description: descriptionMovieFavorito,
          img: imgMovieFavorito,
          imgBackground: imgBackgroundMovieFavorito,
          type: tipoMovieFavorito,
          year: yearMovieFavorito,
          runtime: runTimeMovieFavorito,
          vote_average: voteAverageMovieFavorito,
          id: idMovieFavorito,
          imdbId: imdbIdMovieFavorito,
        }
    
        favoritos.push(favorito)
        localStorage.setItem('favoritos', JSON.stringify(favoritos))
    }
  
    function removerFavoritos(e) {
      let favoritos = JSON.parse(localStorage.getItem('favoritos'))
      setFavoritoIsTrue(false)

      if (favoritos != '') {
        favoritos.splice(e,1)
        localStorage.setItem('favoritos', JSON.stringify(favoritos))
      }

      setTimeout(()=>{
        window.location.reload()
      })
    }

    function definirTemporada(e) {
        setTemporada(e)
        
        setTimeout(()=>{
            document.getElementById("link-escolher-episodio-1").click()
            document.getElementById("section-episodios-serie-assistir").scrollTo(0,0)
        }, 1)
    }

    function definirEpisodio(e) {
        setEpisodio(e)
        setTimeout(()=>{
            document.getElementById("label-escolher-opcao-video").click()
        }, 100)
    }

    var divSliderTemporadas = document.getElementById("section-temporadas-serie-assistir")
    var btLeftTemporadas = document.getElementById("bt-left-section-temporadas-serie-assistir")

    function btLeftSlideTemporadas() {
        divSliderTemporadas.scrollLeft -= 200;
    }
    
    function btRightSlideTemporadas() {
        divSliderTemporadas.scrollLeft += 200;
        btLeftTemporadas.style.display = "block";
        btLeftTemporadas.style.left = "-20px";
        btLeftTemporadas.style.padding = "0 40px 0 20px";
    }

    var divSliderEpisodios = document.getElementById("section-episodios-serie-assistir")
    var btLeftEpisodios = document.getElementById("bt-left-section-episodios-serie-assistir")

    function btLeftSlideEpisodios() {
        divSliderEpisodios.scrollLeft -= 200;
    }
    
    function btRightSlideEpisodios() {
        divSliderEpisodios.scrollLeft += 200;
        btLeftEpisodios.style.left = "-20px";
        btLeftEpisodios.style.padding = "0 40px 0 20px";
    }
    
    return(
        <>
            {movie.id &&
                <div className="container-assistir" id="container-assistir">
                    <div className="all-content-assistir">
                        <div className="content-movie-assistir" style={{backgroundImage: `url(${image_path}${movie.backdrop_path})`}}>
                            <div className="movie-assistir">
                                <div className="div-imagem-movie-assistir">
                                    <img loading="lazy" src={`${image_path}${movie.poster_path}`} id='img-movie-assistir' alt={movie.name} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src='https://dflix.netlify.app/imagens/img-erro-exclamacao.png';}}/>
                                </div>
                                <div className="detalhes-movie-assistir">
                                    <span className="span-assistir-filmes-series">assistir {definirFilmeSerie} online na dflix</span>
                                    <h1 className="titulo-movie-assistir">{movie.title}{movie.name}</h1>
                                    <Atores id={id} filmeSerie={filmeSerie}/>
                                    <div className="informacoes-movie-assistir">
                                        <section>
                                            {movie.first_air_date &&
                                                <span>{movie.first_air_date.slice(0,4)}</span>
                                            }
                                            {movie.release_date &&
                                                <span>{movie.release_date.slice(0,4)}</span>
                                            }
                                        </section>
                                        {movie.status == 'Ended' &&
                                            <section className="section-serie-finalizada">
                                                <span>finalizada</span>
                                            </section>
                                        }
                                        {movie.vote_average != 0 &&
                                            <section>
                                                <span><i className="fas fa-star"></i> {(movie.vote_average).toFixed(1)}</span>
                                            </section>
                                        }
                                        {movie.runtime &&
                                            <section className="lancamento-movie-assitir">
                                                <span className="duracao-movie-assistir"><i class="fa-solid fa-clock-rotate-left"></i> {converter(movie.runtime)}</span>
                                            </section>
                                        }
                                        {movie.episode_run_time && movie.episode_run_time.length == 1 && 
                                            <section className="lancamento-movie-assitir">
                                                <span className="duracao-movie-assistir"><i class="fa-solid fa-clock-rotate-left"></i> {converter(movie.episode_run_time)} (ep.)</span>
                                            </section>
                                        }
                                        {movie.number_of_seasons &&
                                            <section className="section-temporadas">
                                                <span>{movie.number_of_seasons}T. </span> | 
                                                <span>{movie.number_of_episodes} EP's.</span>
                                            </section>
                                        }
                                    </div>
                                    <span className="descricao-movie-assistir">{movie.overview}</span>
                                    <div className="generos-movie-assistir">
                                        {movie.genres &&
                                            movie.genres.map((genero) => {
                                                return(
                                                    <Tippy content={`Ver ${definirFilmeSerie}s de ${genero.name}`}>
                                                        <span onClick={()=>pesquisarGenero(genero.name, genero.id)}>{genero.name}</span>
                                                    </Tippy>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="div-compartilhar-e-favorito">
                                        <Compartilhar />
                                        <Tippy content={favoritoIsTrue ? 'Remover favorito' : 'Adicionar favorito'}>
                                            {favoritoIsTrue ? <button className="botao-favorito botao-remover-favorito" onClick={()=>removerFavoritos(favoritos.findIndex( (element) => element.imdbId == idImdb))}><i class="fa-solid fa-heart"></i></button>
                                            : <button className="botao-favorito botao-adicionar-favorito" onClick={()=>salvarFavoritos()}><i class="fa-solid fa-heart-crack"></i></button>
                                            }
                                        </Tippy>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {filmeSerie == 'tv' &&
                            <div className="div-temporadas-episodios-serie-assistir">
                                <h2 className="h2-assistir">Assistir {movie.name}</h2>
                                <div className="div-temporadas-serie-assistir" id="div-temporadas-serie-assistir">
                                    <h2 className="h2-titulo-temporada">Temporada</h2>
                                    <section className="section-temporadas-serie-assistir" id="section-temporadas-serie-assistir" onScroll={()=>scrollDivTemporadasAssistir()}>
                                        {scrollDivTemporadas >= 50 &&
                                            <button className="bt-slide-section-serie-assitir bt-left-section-serie-assistir" id="bt-left-section-temporadas-serie-assistir" onClick={()=>btLeftSlideTemporadas()}><i class="fas fa-angle-left"></i></button>
                                        }
                                        {movie.seasons &&
                                            movie.seasons.map((season) => {
                                                return(
                                                    <div className="div-escolher-temporada">
                                                        {season.name != "Especiais" &&
                                                            <section className="temporada-serie-assistir">
                                                                <input type='radio' name='input-escolher-temporada' id={`input-escolher-temporada-${season.season_number}`}/>
                                                                <label for={`input-escolher-temporada-${season.season_number}`} onClick={()=>definirTemporada(season.season_number)}>
                                                                    <img loading="lazy" src={`${image_path}${season.poster_path}`} alt={season.name}  onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-avatar.png";}}/>
                                                                    <span className="span-hover-n-temporada">{season.season_number}</span>
                                                                </label>
                                                            </section>
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                        <button className="bt-slide-section-serie-assitir bt-right-section-serie-assistir" id="bt-right-section-temporadas-serie-assistir" onClick={()=>btRightSlideTemporadas()}><i class="fas fa-angle-right"></i></button>
                                    </section>
                                </div>
                                {temporada &&
                                    <div>
                                        <h2 className="h2-titulo-episodio">Episódio</h2>
                                        <section id="section-episodios-serie-assistir" className={`section-episodios-serie-assistir ${temporada? 'mostrar-episodios-serie-assistir' : ''}`} onScroll={()=>scrollDivEpisodiosAssistir()}>
                                            {scrollDivEpisodios >= 50 &&
                                                <button className="bt-slide-section-serie-assitir bt-left-section-serie-assistir" id="bt-left-section-episodios-serie-assistir" onClick={()=>btLeftSlideEpisodios()}><i class="fas fa-angle-left"></i></button>
                                            }
                                            {movie.seasons &&
                                                episodios.map(ep => {
                                                    return(
                                                        <section className="episodio-serie-assistir">
                                                            <input type='radio' name='input-escolher-episodio' id={`input-escolher-episodio-${ep.episode_number}`}/>
                                                            <label for={`input-escolher-episodio-${ep.episode_number}`} onClick={()=>definirEpisodio(ep.episode_number)}>
                                                                <img loading="lazy" src={`${image_path}${ep.still_path}`} alt={ep.name}  onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-avatar.png";}}/>
                                                                <Link to={`/assistir=tv&${id}/${temporada}/${ep.episode_number}`}id={`link-escolher-episodio-${ep.episode_number}`}  className="span-hover-n-episodio a-episodio-serie">
                                                                    <span>{ep.episode_number}</span>
                                                                    <Tippy content='Assistido'>
                                                                        <span className="olho-episodio-visualizado"> <i class="fa-solid fa-eye"></i></span>
                                                                    </Tippy>
                                                                </Link>
                                                            </label>
                                                        </section>
                                                    )
                                                })
                                            }
                                            <button className="bt-slide-section-serie-assitir bt-right-section-serie-assistir" id="bt-right-section-temporadas-serie-assistir" onClick={()=>btRightSlideEpisodios()}><i class="fas fa-angle-right"></i></button>
                                        </section>
                                    </div>
                                }
                                <section className={`section-opcoes-video ${episodio ? 'mostrar-opcoes-video' : ''}`}>
                                    <span className="span-informacoes-video-assistir">Assistir {temporada}° temporada / ep. {episodio}</span>
                                    {episodio &&
                                        <div className="div-opcoes-video-assistir">
                                            <section className="opcao-video-assistir">
                                                <input type='radio' name='input-escolher-opcao-video' id={`input-escolher-opcao-video-1`}/>
                                                <label for={`input-escolher-opcao-video-1`} id='label-escolher-opcao-video' onClick={()=>setOpcaoAssistir(1)}>
                                                    <span className="span-hover-opcao-video">opção 1</span>
                                                </label>
                                            </section>
                                            <section className="opcao-video-assistir">
                                                <input type='radio' name='input-escolher-opcao-video' id={`input-escolher-opcao-video-2`}/>
                                                <label for={`input-escolher-opcao-video-2`}onClick={()=>setOpcaoAssistir(2)}>
                                                    <span className="span-hover-opcao-video">opção 2</span>
                                                </label>
                                            </section>
                                        </div>
                                    }
                                </section>
                            </div>
                        }

                        
                        {filmeSerie == 'movie' &&
                            <section className='mostrar-opcoes-video'>
                                <span className="span-informacoes-video-assistir">Assistir {movie.title}</span>
                                {filmeSerie == 'movie' &&
                                    <div className="div-opcoes-video-assistir">
                                        <section className="opcao-video-assistir">
                                            <input type='radio' name='input-escolher-opcao-video' id={`input-escolher-opcao-video-1`}/>
                                            <label for={`input-escolher-opcao-video-1`} id='label-escolher-opcao-video' onClick={()=>setOpcaoAssistir(1)}>
                                                <span className="span-hover-opcao-video">opção 1</span>
                                            </label>
                                        </section>
                                        <section className="opcao-video-assistir">
                                            <input type='radio' name='input-escolher-opcao-video' id={`input-escolher-opcao-video-2`}/>
                                            <label for={`input-escolher-opcao-video-2`}onClick={()=>setOpcaoAssistir(2)}>
                                                <span className="span-hover-opcao-video">opção 2</span>
                                            </label>
                                        </section>
                                    </div>
                                }
                            </section>
                        }

                        {filmeSerie == 'movie' &&
                            <div className="div-iframe-movie-assistir" id="iframe-assistir">
                                {opcaoAssistir == 2 &&
                                    <span className="span-alert-iframe"><i class="fa-solid fa-triangle-exclamation"></i> Alguns filmes podem não estar disponível nesta opção!</span>
                            }
                                <iframe src={opcaoAssistir == 1 ? `https://embed.warezcdn.net/${definirFilmeSerie}/${idImdb}`
                                : `https://embed.uauflix.online/${idImdb}`} allowfullscreen="allowfullscreen" scrolling="no" allowtransparency height="500px" frameBorder="0"></iframe>
                            </div>
                        }
                        {filmeSerie == 'tv' && temporada && episodio && opcaoAssistir &&
                            <div className={'div-iframe-movie-assistir'} id="iframe-assistir">
                                {opcaoAssistir == 2 &&
                                    <span className="span-alert-iframe"><i class="fa-solid fa-triangle-exclamation"></i> Algumas Séries podem não estar disponível nesta opção!</span>
                                }
                                <iframe src={opcaoAssistir == 1 ? `https://embed.warezcdn.net/serie/${idImdb}/${temporada}/${episodio}`
                                : `https://embed.uauflix.online/tv/${id}/${temporada}/${episodio}/dub`} allowfullscreen="allowfullscreen" scrolling="no" allowtransparency height="500px" frameBorder="0"></iframe>
                            </div>
                        }
                        <Sugestao idmovie={id}/>
                        <VideosFilmeSerie id={id} filmeSerie={filmeSerie} definirFilmeSerie={definirFilmeSerie}/>                    
                        <Comentarios id={id} filmeSerie={filmeSerie} definirFilmeSerie={definirFilmeSerie}/>
                    </div>
                </div>

            }
            {movie.success == false &&
                redirecionarErro()
            }
        </>
    )
}