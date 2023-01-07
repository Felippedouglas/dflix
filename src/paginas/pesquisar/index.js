import { APIKey } from "../../config/key";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import './style.css';
import Alert from "../../componentes/alert";
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import Usuario from "../usuario";
import { AppFirebase } from "../../service/firebase";

export default function Pesquisar() {

    const [ user, setUser ] = useState({});
    
    const [ alert, setAlert ] = useState(false);
    const [ alertTitle, setAlertTitle ] = useState();
    const [ alertMessage, setAlertMessage ] = useState();
    const [ date, setDate ] = useState(new Date());
    

    const [ exibirListaSugestoesPesquisar, setExibirListaSugestoesPesquisar ] = useState();
    const [ sugestoesNomesPesquisar, setSugestoesNomesPesquisar] = useState([]);
    
    const { sortType, setSortType } = useParams('release_date.desc');
    const { numeroPagina, movieName } = useParams();
    const [ name, setName] = useState(movieName);
    const [ paginasMovie, setPaginasMovies] = useState();
    const [ tipoPesquisa, setTipoPesquisa] = useState('multi');
    const [ movies, setMovies] = useState([]);
    const [ filmeSeriePessoa, setFilmeSeriePessoa] = useState();
    const [ filmePesquisado, setFilmePesquisado] = useState(movieName);
    const [ data] = useState(new Date);
    const image_path = 'https://image.tmdb.org/t/p/w200';
    const [ salvarHistorico, setSalvarHistorico ] = useState();
    const [ exibirHistorico, setExibirHistorico ] = useState();
    const [ economiaInternet, setEconomiaInternet ] = useState();

    const [ historico, setHistorico ] = useState([]);
    
    const [ idioma, setIdioma ] = useState();

    const database = getFirestore(AppFirebase);

    useEffect(() => {
        setSalvarHistorico(localStorage.getItem('salvarHistorico'));
        setExibirHistorico(localStorage.getItem('exibirHistorico'));

        var idioma = localStorage.getItem('idioma') || 'portugues';
        setIdioma(idioma);
        
        fetch(`https://api.themoviedb.org/3/search/${tipoPesquisa}?api_key=${APIKey}&vote_average.gte=1&language=${idioma == 'portugues' ? 'pt-BR' : 'en-US'}&page=${numeroPagina}&adult=false&query=${movieName}&sort_by=${sortType}`)
            .then(Response => Response.json())
            .then(data => {
                setMovies(data.results);

                if (numeroPagina) {
                    setTimeout(()=> {
                        if (tipoPesquisa == 'multi') {
                            document.getElementById('label-escolher-tipo-pesquisa-multi').click();
                        }
                    }, 100)
                    setPaginasMovies(data.total_pages);
                }
        })

        const pesquisasCollectionRef = collection(database, `users/${user.uid}/pesquisas`);

        const getFavoritos = async () => {
            const data = await getDocs(pesquisasCollectionRef);
            const arr = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
            arr.sort(function(a,b) {
                return a.dataPesquisa.seconds - b.data.seconds;
            });

            setTimeout(()=> {
                setHistorico(arr.reverse());
            }, 10)
        }
        
        getFavoritos();

        setEconomiaInternet(localStorage.getItem('economia'));

        document.title = 'Pesqsuisar - DFLIX';
        document.querySelector("meta[name=theme-color]").setAttribute("content", '#181818');
    }, [tipoPesquisa, filmeSeriePessoa, movieName, numeroPagina, tipoPesquisa, user, date])

    function salvaHistorico(e) {

        if (salvarHistorico == 'true' && user.uid) {
            console.log("chamou salvar fav")
            async function adicionarFavoritos() {
    
                await setDoc(doc(database, `users/${user.uid}/pesquisas`, e), {
                    name: e,
                    data: `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${String(data.getFullYear()).padStart(2, '0')}`,
                    hora: `${String(data.getHours()).padStart(2, '0')}:${String(data.getMinutes()).padStart(2, '0')}`,
                    dataPesquisa: date
                });

                console.log('adicionou ao histórico')
            }
            
            setTimeout(()=>{
                adicionarFavoritos();
            }, 100)
        }
    }

    async function removerDoHistorico(e) {
        document.getElementById("item-historico-" + e).style.display = 'none';
        await deleteDoc(doc(database, `users/${user.uid}/pesquisas`, e));
    }
    
    async function limparHistorico() {
        document.getElementById("section-itens-historico").style.display = 'none';
    }

    function moviePesquisar(e) {
        setName(e);
        setFilmePesquisado(e);
        document.getElementById('input-pesquisar').focus();
    }

    function pesquisarMovieHistorico(e, movieName) {
        window.location.href = e;
        setName(movieName);
        window.scrollTo(0,0);
    }

    document.addEventListener('keydown', function(e) {
        switch (e.keyCode) {
            case 13:
                document.getElementById("bt-pequisar-movie").click();
                break;
        }
    }, false);

    const inputPesquisar = document.getElementById("input-pesquisar");
                
    function definirFilmePesquisado(props) {
        setFilmePesquisado(props);
        setName(props);

        if (!name) {
            esconderListaSugestoesNomesPesquisar();
        }

        if (props.length >= 5) {
            fetch(`https://api.themoviedb.org/3/search/${tipoPesquisa}?api_key=${APIKey}&language=${idioma == 'portugues' ? 'pt-BR' : 'en-US'}&page=${numeroPagina}&adult=false&query=${props}`)
                .then(Response => Response.json())
                .then(data => {
                    if (data) {
                        setSugestoesNomesPesquisar(data.results);
                    }
            })
            exibirListaSugestoesNomesPesquisar();
        }
    }
    
    function settingsPesquisa(tipoPesquisa) {
        setTipoPesquisa(tipoPesquisa)
        setFilmeSeriePessoa(tipoPesquisa)
        window.location.href = `/#/pesquisar/search=${movieName}&pagina=1`
    }
 

    function recarregarPagina() {
        setTimeout(()=>{
            if(name && name.length >= 3) {
                salvaHistorico(filmePesquisado);
                window.location.href = `/#/pesquisar/search=${filmePesquisado}&pagina=1`;
                inputPesquisar.blur();
            }
        }, 10)
        
        if (name.length > 0 && name.length <= 3) {
        
            if (!alert) {
                setAlert(true)
                setTimeout(()=>{
                    setAlert(false)
                }, 5000)
            }
            setAlertTitle('Pesquisar')
            setAlertMessage(`Digite um valor maior que 2 dígitos`);
        } else if (name.length == 0) {
        
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
            }, 5000)
            setAlertTitle('Pesquisar')
            setAlertMessage(`Digite algum nome de filme ou série para pesquisar`);
        }

        setTipoPesquisa('multi')
        setFilmeSeriePessoa('multi')
    };

    
    function exibirListaSugestoesNomesPesquisar() {
        if (name.length >= 5 && tipoPesquisa == 'multi') {
            setExibirListaSugestoesPesquisar(true);
        }
    }
    
    function esconderListaSugestoesNomesPesquisar() {

        setTimeout(() => {
            setExibirListaSugestoesPesquisar(false);
        }, 250);
    }

    function redirecionarMovieSugeridoPesquisar(mediaType, id) {
        
        if (mediaType != 'person') {
            window.location.href = `/#/assistir=${mediaType}&${id}`;
        } else {
            window.location.href = `/#/pessoa=${id}&/bg=movie/filmes`;
        }
    }

    return (
        <div className="componente-pequisar" id="componente-pequisar">

            <Alert alert={alert} alertTitle={alertTitle} alertMessage={alertMessage}/>
            <Usuario setUser={setUser}/>

            <header className="header-componente-pesquisar">
                <section className="section-pesquisar">
                    <div className="section-input-pesquisar">
                        <input autoComplete="off" minLength={3} maxLength={40} onFocus={()=>exibirListaSugestoesNomesPesquisar()} onBlur={()=>esconderListaSugestoesNomesPesquisar()} autoFocus type='text' id="input-pesquisar" value={name} placeholder={idioma == 'portugues' ? 'Pesquise por filmes e séries' : 'Search for movies and series'} onChange={(e)=>definirFilmePesquisado(e.target.value)}/>
                        <a onClick={()=>recarregarPagina()} id='bt-pequisar-movie'><i className="fas fa-search"></i></a>
                    </div>
                    {exibirListaSugestoesPesquisar && !economiaInternet &&
                    <div className="div-sugestoes-pesquisar">
                        {
                            <ul>
                                {sugestoesNomesPesquisar.map((sugestao)=>{
                                    return (
                                            <li className="li-movie-sugestao-pesquisar feer" key={sugestao.id} onClick={()=>redirecionarMovieSugeridoPesquisar(sugestao.media_type, sugestao.id)}>
                                                <section className="section-img-movie-sugestao-pesquisar">
                                                    {sugestao.media_type == 'tv' && sugestao.poster_path != null &&
                                                        <img src={`${image_path}${sugestao.poster_path}`} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-avatar.png";}}/>
                                                    }
                                                    {sugestao.media_type == 'movie' && sugestao.poster_path != null &&
                                                        <img src={`${image_path}${sugestao.poster_path}`} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-avatar.png";}}/>
                                                    }
                                                    {sugestao.media_type == 'person' && sugestao.profile_path != null &&
                                                        <img src={`${image_path}${sugestao.profile_path}`} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-avatar.png";}}/>
                                                    }
                                                </section>
                                                <section className="section-informacoes-movie-sugetao-pesquisar">
                                                    <span>{sugestao.title ? sugestao.title : sugestao.name}</span>
                                                    <section className="section-ano-sugestao-pesquisar">
                                                        {sugestao.vote_count > 0 &&
                                                            <span className="span-avaliacao-sugestao-pesquisar"><i className="fas fa-star"></i> {sugestao.vote_average.toFixed(1)}</span>
                                                        }
                                                        {sugestao.first_air_date &&
                                                            <span>{sugestao.first_air_date.slice(0,4)}</span>
                                                        }
                                                        {sugestao.release_date &&
                                                            <span>{sugestao.release_date.slice(0,4)}</span>
                                                        }
                                                    </section>
                                                    <span>{sugestao.media_type == 'movie' ?
                                                        <span className='span-tipo-sugestao-pesquisar span-filme-sugestao-pesquisar'>{idioma == 'portugues' ? 'Filme' : 'Movie'}</span>
                                                        : sugestao.media_type == 'tv' ? <span className='span-tipo-sugestao-pesquisar span-serie-sugestao-pesquisar'>{idioma == 'portugues' ? 'Série' : 'Serie'}</span>
                                                        :
                                                        <span className='span-tipo-sugestao-pesquisar span-pessoa-sugestao-pesquisar'>{idioma == 'portugues' ? 'Pessoa' : 'People'}</span>
                                                    }</span>
                                                </section>
                                            </li>
                                    )
                                })}
                            </ul>
                        }
                        {sugestoesNomesPesquisar.length >= 3 &&
                            <div className="div-link-pesquisar-sugestao-movie">
                                <Link className="link-pesquisar-sugestao-movie" to={`/pesquisar/search=${filmePesquisado}&pagina=1`}><i className="fa-solid fa-plus"></i>{idioma == 'portugues' ? 'Ver tudo' : 'See all'}</Link>
                            </div>
                        }
                    </div>
                    }

                </section>
                {!numeroPagina && !exibirHistorico &&
                    <section className="section-salvar-pesquisa-desativado section-exibir-historico-pesquisa-desativado">
                        <span>{idioma == 'portugues' ? 'Exibição do histórico de pesquisas está desativado' : 'Display of search history is disabled'}</span>
                        <Link to='/conta'><i className="fa-solid fa-gear"></i></Link>
                    </section>
                }
                {!numeroPagina && exibirHistorico == 'true' &&
                    <section className="section-itens-historico" id="section-itens-historico">
                        {/*historico.length >= 1 &&
                            <section className="section-limpar-historico">
                                <button onClick={()=>limparHistorico()}><i className="fa-solid fa-trash-can"></i> {idioma == 'portugues' ? 'Limpar tudo' : 'Clean all'}</button>
                            </section>
                        */}
                        {!salvarHistorico &&
                            <section className="section-salvar-pesquisa-desativado">
                                <span>{idioma == 'portugues' ? 'salvar pesquisas está desativado' : 'save searches is disabled'}</span>
                                <Link to='/conta'><i className="fa-solid fa-gear"></i></Link>
                            </section>
                        }
                        {historico.map((e, key)=>{
                            return(
                                <section className="section-item-historico" key={key} id={`item-historico-${e.name}`}>
                                    <a onClick={()=>pesquisarMovieHistorico(`/#/pesquisar/search=${e.name}&pagina=1`, e.name)}>
                                        <span className="nome-item-historico"><i className="fa-solid fa-clock-rotate-left"></i> {e.name}</span>
                                        <span className="data-item-historico" title={`${e.data} às ${e.hora}`}>{e.data} às {e.hora}</span>
                                    </a>
                                    <button className="bt-excluir-item-historico" title={idioma == 'portugues' ? 'Excluir' : 'Delete'} onClick={()=>removerDoHistorico(e.name)}><i className="fas fa-close"></i></button>
                                    <button className="bt-excluir-item-historico" title={idioma == 'portugues' ? 'Editar' : 'Edit'} onClick={()=>moviePesquisar(e.name)}><i className="fa-solid fa-arrow-up-right-from-square"></i></button>
                                </section>
                            )
                        })}
                    </section>
                }
            </header>
            {numeroPagina &&
                <div className="div-filtro">
                    <section>
                        <input className="input-escolher-filtro" type='radio' name='input-radio-tipo-pesquisa' id={`input-tipo-pesquisa=1`}/>
                        <label className="label-escolher-filtro" id="label-escolher-tipo-pesquisa-multi" htmlFor={`input-tipo-pesquisa=1`}>
                            <span onClick={()=>settingsPesquisa('multi')}>{idioma == 'portugues' ? 'Tudo' : 'All'}</span>
                        </label>
                    </section>
                    <section>
                        <input className="input-escolher-filtro" type='radio' name='input-radio-tipo-pesquisa' id={`input-tipo-pesquisa=2`}/>
                        <label className="label-escolher-filtro" htmlFor={`input-tipo-pesquisa=2`}>
                            <span onClick={()=>settingsPesquisa('movie')}>{idioma == 'portugues' ? 'Filmes' : 'Movies'}</span>
                        </label>
                    </section>
                    <section>
                        <input className="input-escolher-filtro" type='radio' name='input-radio-tipo-pesquisa' id={`input-tipo-pesquisa=3`}/>
                        <label className="label-escolher-filtro" htmlFor={`input-tipo-pesquisa=3`}>
                            <span onClick={()=>settingsPesquisa('tv')}>{idioma == 'portugues' ? 'Séries' : 'Series'}</span>
                        </label>
                    </section>
                    <section>
                        <input className="input-escolher-filtro" type='radio' name='input-radio-tipo-pesquisa' id={`input-tipo-pesquisa=4`}/>
                        <label className="label-escolher-filtro" htmlFor={`input-tipo-pesquisa=4`}>
                            <span onClick={()=>settingsPesquisa('person')}>{idioma == 'portugues' ? 'Pessoas' : 'People'}</span>
                        </label>
                    </section>
                </div>
            }
            {numeroPagina && movieName != '' &&
                <>
                {tipoPesquisa != 'person' &&
                    <div className="div-movie-pesquisar" id="div-movie-pesquisar">
                        {movies.map(movie => {
                            return (
                                <div key={`${movie.type}-${movie.id}`}>
                                    {((movie.release_date || movie.first_air_date) && movie.poster_path) &&
                                        <div className='movie-pesquisar'>
                                            <Link to={`/assistir=${tipoPesquisa == 'multi'? movie.media_type : filmeSeriePessoa}&${movie.id}`}>
                                                <img loading="lazy" src={`${image_path}${movie.poster_path}`} alt={movie.name} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-erro-exclamacao.png";}}/>
                                                <section className="section-informacoes-movie-pesquisar">
                                                    <span><i className="fas fa-star"></i> {movie.vote_average.toFixed(1)}</span>
                                                    {movie.first_air_date &&
                                                        <span>{movie.first_air_date.slice(0,4)}</span>
                                                    }
                                                    {movie.release_date &&
                                                        <span>{movie.release_date.slice(0,4)}</span>
                                                    }
                                                </section>
                                            </Link>
                                            {
                                            movie.media_type == 'movie' &&
                                                <span className='span-movie-filme'>{idioma == 'portugues' ? 'Filme' : 'Movie'}</span>
                                            }
                                            {
                                            movie.media_type == 'tv' &&
                                                <span className='span-movie-serie'>{idioma == 'portugues' ? 'Série' : 'Serie'}</span>
                                            }
                                            <span className="titulo-movie" title={movie.title? movie.title : movie.name}>{movie.title}{movie.name}</span>
                                        </div>
                                    }
                                </div>
                                )
                            })
                        }
                    </div>
                    }
                    <div className="div-pessoa-pesquisar" id="div-pessoa-pesquisar">
                        {movies.map(movie => {
                            return (
                                <div key={`${movie.type}-${movie.id}`}>
                                {movie.profile_path &&
                                    <div className='pessoa-pesquisar' key={movie.id}>
                                        <Link to={`/pessoa=${movie.id}/bg=movie/filmes`}>
                                            <img src={`${image_path}${movie.profile_path}`} alt={movie.name} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-erro-exclamacao.png";}}/>
                                            <section className="section-informacoes-pessoa-pesquisar">
                                                <span className="titulo-pessoa">{movie.name}</span>
                                            </section>
                                        </Link>
                                        <span className='span-pessoa'>{idioma == 'portugues' ? 'Pessoa' : 'People'}</span>
                                    </div>
                                }
                                </div>
                                )
                            })
                        }
                    </div>
                </>
            }
            {numeroPagina && paginasMovie > 1 &&
                <div className="div-generos bts-anterior-proximo">
                    <div id="div-bts-paginas-generos" className="div-bts-paginas-generos div-generos">
                        {Number(numeroPagina) > 1 && 
                            <section>
                                <label className="label-escolher-genero label-bt-pagina-genero" id="label-paginas-generos=1" htmlFor="input-paginas-genero=1">
                                {idioma == 'portugues' &&
                                    <Link onClick={()=>window.scrollTo(0,0)} to={`/pesquisar/search=${movieName}&pagina=${Number(numeroPagina) - 1}`} className="bt-pagina-pesquisar"><i className="fa-solid fa-angle-left"></i> Anterior: {Number(numeroPagina) - 1}</Link>
                                }
                                {idioma == 'ingles' &&
                                    <Link onClick={()=>window.scrollTo(0,0)} to={`/pesquisar/search=${movieName}&pagina=${Number(numeroPagina) - 1}`} className="bt-pagina-pesquisar"><i className="fa-solid fa-angle-left"></i> Previous: {Number(numeroPagina) - 1}</Link>
                                }
                                </label>
                            </section>
                        }
                        {numeroPagina > 1 &&
                            <section>
                                <span className="span-pagina-atual">{numeroPagina}</span>
                            </section>
                        }
                        <section>
                            <input className="input-escolher-genero" type="radio" name="input-radio-genero" id="input-paginas-genero=2"/>
                            <label className="label-escolher-genero label-bt-pagina-genero" id="label-paginas-generos=2" htmlFor="input-paginas-genero=2">
                                {idioma == 'portugues' &&
                                    <Link onClick={()=>window.scrollTo(0,0)} to={`/pesquisar/search=${movieName}&pagina=${Number(numeroPagina) + 1}`} className="bt-pagina-pesquisar">{numeroPagina == 1 ? 'Ver mais' : `Próximo: ${Number(numeroPagina) + 1}`} <i className="fa-solid fa-angle-right"></i></Link>
                                }
                                {idioma == 'ingles' &&
                                    <Link onClick={()=>window.scrollTo(0,0)} to={`/pesquisar/search=${movieName}&pagina=${Number(numeroPagina) + 1}`} className="bt-pagina-pesquisar">{numeroPagina == 1 ? 'More' : `Next: ${Number(numeroPagina) + 1}`} <i className="fa-solid fa-angle-right"></i></Link>
                                }
                            </label>
                        </section>
                    </div>
                </div>
            }
        </div>
    )
}