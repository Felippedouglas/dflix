import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import './style.css';
import $ from 'jquery';
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { AppFirebase } from "../../../../service/firebase";
import Usuario from "../../../usuario";

export default function PagMoviesFavoritos() {

    const [ user, setUser ] = useState({});
    
    const image_path = 'https://image.tmdb.org/t/p/w500';
    const [ popUpMovie, setPopUpMovie ] = useState(false);

    const [ favoritos, setFavoritos ] = useState([]);
    const [ favoritosLength, setFavoritosLength ] = useState();

    const { preview } = useParams();
    const [ atualizarState, setAtualizarState ] = useState();
    const [ organizarFavoritosPor, setOrganizarFavoritosPor ] = useState();
    const [ exibirOcultarOpcoesFavoritos, setExibirOcultarOpcoesFavoritos ] = useState(false);
    const [ exibirApenas, setExibirApenas ] = useState('');

    const [ idioma, setIdioma ] = useState();

    const constScrollOpcoesMoviesFavoritos = useRef(null);

    useEffect(() => {
        
        const database = getFirestore(AppFirebase);
        const favoritosCollectionRef = collection(database, `users/${user.uid}/favoritos`);
        const storageOrganizarFavoritosPor = localStorage.getItem("organizarFavoritosPor") || 'recentes';

        const getFavoritos = async () => {
            const data = await getDocs(favoritosCollectionRef);

            if (storageOrganizarFavoritosPor == 'recentes') {
                setFavoritos(data.docs.map((doc) => ({...doc.data(), id: doc.id})).reverse());
            } else {
                setFavoritos(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
            }
            
            setFavoritosLength(data.docs.map((doc) => ({...doc.data(), id: doc.id})).length);
        }
        
        
        setOrganizarFavoritosPor(storageOrganizarFavoritosPor)
        
        setIdioma(localStorage.getItem('idioma') || 'portugues')
        setTimeout(() => {
            getFavoritos();
            
        }, 1000);

    }, [preview, atualizarState, exibirApenas, user]);

    function salvarOrganizarFavoritosPor(e) {
        if (e == 1) {
            localStorage.setItem("organizarFavoritosPor", 'recentes')
        } else {
            localStorage.setItem("organizarFavoritosPor", 'antigos')
        }
        
        setExibirOcultarOpcoesFavoritos(!exibirOcultarOpcoesFavoritos)
        setAtualizarState(e)
    }
    
    function definirExibirApenas(e) {
        setExibirApenas(e)
        setExibirOcultarOpcoesFavoritos(!exibirOcultarOpcoesFavoritos)
    }

    var divSlider = document.getElementById("list-movie-favoritos")

    function btLeftSlideSerie() {
        divSlider.scrollLeft -= 380;
    }
    
    function btRightSlideSerie() {
        divSlider.scrollLeft += 380;
    }
    
    function abrirMovie() {
        setPopUpMovie(!popUpMovie);
    }

    const scrollOpcoesMoviesFavoritos = () =>
    window.scrollTo({
      top: constScrollOpcoesMoviesFavoritos.current.offsetTop -200,
      behavior: "smooth",
    });

    $(document).mouseup(function(e) {
        if (exibirOcultarOpcoesFavoritos) {
            var container = $(".sections-opcoes-movies-favoritos");
            
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                setExibirOcultarOpcoesFavoritos(!exibirOcultarOpcoesFavoritos)
            }
        }
    });

    function definirExibirOcultarOpcoesFavoritos() {
        setExibirOcultarOpcoesFavoritos(!exibirOcultarOpcoesFavoritos);
        
        setTimeout(() => {
            scrollOpcoesMoviesFavoritos();
            setAtualizarState((Math.random()*1000))
        }, 10);
    }

    return(
        <>
            <Usuario setUser={setUser}/>
            <>
                {favoritos &&
                    <div className="content-movies content-movies-favoritos">
                    
                        <div className="div-name-categoria-movie div-name-categoria-movie-favoritos">
                            <h2 className="h2-filme-serie-titulo-categoria">{idioma == 'portugues' ? 'favoritos' : 'favorites'}</h2> <button className="bt-abrir-opcoes-favoritos-home" onClick={()=>definirExibirOcultarOpcoesFavoritos()}><i className="fa-solid fa-sliders"></i></button>
                            {exibirOcultarOpcoesFavoritos &&
                                <section className="sections-opcoes-movies-favoritos">
                                    <div className="div-opcoes-ordenar-movies-favoritos">
                                        <h3 className="h3-ordenar-por">{idioma == 'portugues' ? 'Ordenar por' : 'Order by'}</h3>
                                        <button onClick={()=>salvarOrganizarFavoritosPor(1)}><span className="span-ordenar-favoritos-por">{idioma == 'portugues' ? 'Recentes' : 'Last'}</span> {(organizarFavoritosPor == 'recentes') && <i className="fa-solid fa-check"></i>}</button>
                                        <button onClick={()=>salvarOrganizarFavoritosPor(2)}><span className="span-ordenar-favoritos-por">{idioma == 'portugues' ? 'Antigos' : 'Old'}</span> {(organizarFavoritosPor == 'antigos') && <i className="fa-solid fa-check"></i>}</button>
                                    </div>
                                    <div className="div-opcoes-ordenar-movies-favoritos">
                                        <h3 className="h3-ordenar-por">{idioma == 'portugues' ? 'Exibir' : 'Display'}</h3>
                                        <button onClick={()=>definirExibirApenas('')}><span className="span-ordenar-favoritos-por">{idioma == 'portugues' ? 'Tudo' : 'All'}</span>  {(exibirApenas == '') && <i className="fa-solid fa-check"></i>}</button>
                                        <button onClick={()=>definirExibirApenas('movie')}><span className="span-ordenar-favoritos-por">{idioma == 'portugues' ? 'Filmes' : 'Movies'}</span>   {(exibirApenas == 'movie') && <i className="fa-solid fa-check"></i>}</button>
                                        <button onClick={()=>definirExibirApenas('tv')}><span className="span-ordenar-favoritos-por">{idioma == 'portugues' ? 'Séries' : 'Filmes'}</span>   {(exibirApenas == 'tv') && <i className="fa-solid fa-check"></i>}</button>
                                    </div>
                                    <Link to='/conta' className="link-conta-movies-favoritos"><i className="fa-solid fa-gear"></i><span className="span-conta-movies-favoritos">{idioma == 'portugues' ? 'Configurações' : 'Settings'}</span></Link>
                                </section>
                            }
                        </div>
                        <div className="div-movies-favoritos" ref={constScrollOpcoesMoviesFavoritos}>
                            <div className="div-movies" id="list-movie-favoritos">
                                {favoritos.map(movie => {
                                    return (
                                        <div key={`todos-favoritos-${movie.type}-${movie.id}`}>
                                            {exibirApenas == '' &&
                                                <div className="movie">
                                                    <Link to={`/preview/${movie.type}&${movie.idMovie}`} onClick={()=>abrirMovie()}>
                                                        <img loading="lazy" src={`${image_path}${movie.img}`} alt={movie.title} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-erro-exclamacao.png"; currentTarget.height='50px'}}/>
                                                        <section className="section-informacoes-movie">
                                                            <div>
                                                                {idioma == 'portugues' ?
                                                                    <span>{movie.type == 'tv' ? 'Série' : "Filme"} </span>
                                                                    : <span>{movie.type == 'tv' ? 'Serie' : "Movie"} </span>
                                                                }
                                                            </div>
                                                            {movie.year &&
                                                                <span>{movie.year.slice(0,4)}</span>
                                                            }
                                                        </section>
                                                    </Link>
                                                    <span className="span-titulo-movie">{movie.name}</span>
                                                </div>
                                            }
                                            {exibirApenas == 'movie' &&
                                                <>
                                                    {movie.type == 'movie' &&
                                                        <div className="movie">
                                                            <Link to={`/preview/${movie.type}&${movie.id}`} onClick={()=>abrirMovie()}>
                                                                <img loading="lazy" src={`${image_path}${movie.img}`} alt={movie.title} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-erro-exclamacao.png"; currentTarget.height='50px'}}/>
                                                                <section className="section-informacoes-movie">
                                                                    <div className="div-avaliacao-movie">
                                                                        <span className="span-estrela-movie"><i className="fas fa-star"></i></span>
                                                                        <span>{movie.vote_average.toFixed(1)} </span>
                                                                    </div>
                                                                    {movie.year &&
                                                                        <span>{movie.year.slice(0,4)}</span>
                                                                    }
                                                                </section>
                                                            </Link>
                                                            <span className="span-titulo-movie">{movie.name}</span>
                                                        </div>
                                                    }
                                                </>
                                            }
                                            {exibirApenas == 'tv' &&
                                                <>
                                                    {movie.type == 'tv' &&
                                                        <div className="movie">
                                                            <Link to={`/preview/${movie.type}&${movie.id}`} onClick={()=>abrirMovie()}>
                                                                <img loading="lazy" src={`${image_path}${movie.img}`} alt={movie.title} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-erro-exclamacao.png"; currentTarget.height='50px'}}/>
                                                                <section className="section-informacoes-movie">
                                                                    <div className="div-avaliacao-movie">
                                                                        <span className="span-estrela-movie"><i className="fas fa-star"></i></span>
                                                                        <span>{movie.vote_average.toFixed(1)} </span>
                                                                    </div>
                                                                    {movie.year &&
                                                                        <span>{movie.year.slice(0,4)}</span>
                                                                    }
                                                                </section>
                                                            </Link>
                                                            <span className="span-titulo-movie">{movie.name}</span>
                                                        </div>
                                                    }
                                                </>
                                            }
                                        </div>
                                        )
                                    })
                                }
                                {favoritos && favoritos.length == 0 && 
                                    <span className="span-sem-favoritos">Nâo há favoritos!</span>
                                }
                            </div>
                            {favoritos.length >= 4 && 
                                <div className="div-bts-movies-favoritos">
                                    <button className="bt-slide bt-left-slide" onClick={btLeftSlideSerie}><i className="fas fa-angle-left"></i></button>
                                    <button className="bt-slide bt-right-slide" onClick={btRightSlideSerie}><i className="fas fa-angle-right"></i></button>
                                </div>
                            }
                        </div>
                    </div>
                }
            </>
        </>
    )
}