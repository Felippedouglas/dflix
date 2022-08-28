import { APIKey } from "../../config/key";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import './style.css';

export default function Pesquisar() {
    
    const { numeroPagina, movieName } = useParams();
    const [ name, setName] = useState(movieName);
    const [ paginasMovie, setPaginasMovies] = useState();
    const [ tipoPesquisa, setTipoPesquisa] = useState('multi');
    const [ movies, setMovies] = useState([]);
    const [ filmeSeriePessoa, setFilmeSeriePessoa] = useState();
    const [ filmePesquisado, setFilmePesquisado] = useState(movieName);
    const [ data] = useState(new Date);
    const image_path = 'https://image.tmdb.org/t/p/w500';
    const [ totalResultadosMovies, setTotalResultadosMovies ] = useState();
    const [ totalResultadosPessoas, setTotalResultadosPessoas ] = useState();
    const [ salvarHistorico, setSalvarHistorico ] = useState();
    const [ exibirHistorico, setExibirHistorico ] = useState();

    const [ historico, setHistorico ] = useState([]);
    const [ itemHistoritoTrue, setItemHistoritoTrue ] = useState(false);
    
    useEffect(() => {
        const historicoLocalStorage = JSON.parse(localStorage.getItem('historico') || "[]");
        setHistorico(historicoLocalStorage);
        setSalvarHistorico(localStorage.getItem('salvarHistorico'));
        setExibirHistorico(localStorage.getItem('exibirHistorico'));

    }, [numeroPagina]);
    
    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/search/${tipoPesquisa}?api_key=${APIKey}&language=pt-BR&page=${numeroPagina}&adult=false&query=${movieName}`)
            .then(Response => Response.json())
            .then(data => {
                setMovies(data.results);

                setTimeout(()=>{
                    if (tipoPesquisa == 'multi') {
                        document.getElementById('label-escolher-tipo-pesquisa-multi').click();
                    }
                }, 100)
                setPaginasMovies(data.total_pages);
            })

            var divMovies = document.getElementById("div-movie-pesquisar")
            var divpessoas = document.getElementById("div-pessoa-pesquisar")
    
            setInterval(()=>{
                if (divMovies) {
                    setTotalResultadosMovies(divMovies.childElementCount);
                }
    
                else if (divpessoas) {
                    setTotalResultadosPessoas(divpessoas.childElementCount);
                }
            }, 100)

            document.title = 'Pesqsuisar - DFLIX';
    }, [movieName, numeroPagina, tipoPesquisa])

    function salvaHistorico(e) {
        let historico = JSON.parse(localStorage.getItem('historico') || "[]")
        
        setTimeout(()=>{
            historico.map((itemHistorico)=>{
                if (e == itemHistorico.name) {
                    setItemHistoritoTrue('true')
                }
            })

            setTimeout(()=>{
                if(itemHistoritoTrue != 'true' && salvarHistorico == 'true') {
                    let addItemHistorico = {
                        name: e,
                        data: `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${String(data.getFullYear()).padStart(2, '0')}`,
                        hora: `${String(data.getHours()).padStart(2, '0')}:${String(data.getMinutes()).padStart(2, '0')}`
                    }
                    historico.push(addItemHistorico)
                    localStorage.setItem('historico', JSON.stringify(historico));
                }
            }, 10)
        }, 10)

    }

    function removerDoHistorico(e) {
      let historico = JSON.parse(localStorage.getItem('historico'));
      if (historico != '') {
        historico.splice(e,1)
        localStorage.setItem('historico', JSON.stringify(historico));
      }
      document.getElementById("item-historico-" + e).style.display = 'none'
    }
    
    function limparHistorico() {
        localStorage.removeItem('historico');
        document.getElementById("section-itens-historico").style.display = 'none';
    }

    function moviePesquisar(e) {
        setName(e)
        setFilmePesquisado(e);
        document.getElementById('input-pesquisar').focus()
    }

    function pesquisarMovieHistorico(e, movieName) {
        window.location.href = e;
        setName(movieName)
    }

    document.addEventListener('keydown', function(e) {
        switch (e.keyCode) {
            case 13:
                document.getElementById("bt-pequisar-movie").click();
                break;
        }
    }, false);
                
    function definirFilmePesquisado(props) {
        setFilmePesquisado(props);
        setName(props);
    }
    
    function settingsPesquisa(tipoPesquisa) {
        setTipoPesquisa(tipoPesquisa)
        setFilmeSeriePessoa(tipoPesquisa)
        window.location.href = `/#/pesquisar/search=${movieName}&pagina=1`
    }
 
    const inputPesquisar = document.getElementById("input-pesquisar");

    function recarregarPagina() {
        salvaHistorico(filmePesquisado)
        setTimeout(()=>{
            if(inputPesquisar.value && inputPesquisar.value.length >= 3) {
                window.location.href = `/#/pesquisar/search=${filmePesquisado}&pagina=1`;
                inputPesquisar.blur()
            }
        }, 10)/* else if (inputPesquisar.value.length <= 3) {
            alert('digite um valor maior que 3');
        } else {
            alert('digite um valor');
        }*/
    };
    
    setTimeout(() => {

        if (movieName != '') {
            document.getElementById('div-movie-pesquisar').style.display = 'flex';
            document.getElementById('div-pessoa-pesquisar').style.display = 'flex';
        }

    }, 1);

    
            /*{numeroPagina && movieName && !totalResultadosMovies != 0 && !totalResultadosPessoas != 0 &&
                <div className="div-nenhum-resultado-pesquisar">
                    <i class="fa-regular fa-face-sad-cry"></i>
                    <span className="span-nenhum-resultado-pesquisar">Nenhum resultado encontrado!</span>
                </div>
            }*/

    return (
        <div className="componente-pequisar" id="componente-pequisar">
            <header className="header-componente-pesquisar">
                <section className="section-input-pesquisar">
                    <input autoComplete="off" minLength={3} maxLength={30} autoFocus type='text' id="input-pesquisar" value={name} placeholder='Pesquise por filmes e séries' onChange={(e)=>definirFilmePesquisado(e.target.value)}/>
                    <a onClick={()=>recarregarPagina()} id='bt-pequisar-movie'><i className="fas fa-search"></i></a>
                </section>
                {!numeroPagina && !exibirHistorico &&
                    <section className="section-salvar-pesquisa-desativado section-exibir-historico-pesquisa-desativado">
                        <span>Exibição do histórico de pesquisas está desativado</span>
                        <Link to='/conta'><i class="fa-solid fa-gear"></i></Link>
                    </section>
                }
                {!numeroPagina && exibirHistorico == 'true' &&
                    <section className="section-itens-historico" id="section-itens-historico">
                        {historico.length >= 1 &&
                            <section className="section-limpar-historico">
                                <button onClick={()=>limparHistorico()}><i class="fa-solid fa-trash-can"></i> Limpar tudo</button>
                            </section>
                        }
                        {!salvarHistorico &&
                            <section className="section-salvar-pesquisa-desativado">
                                <span>salvar pesquisas está desativado</span>
                                <Link to='/conta'><i class="fa-solid fa-gear"></i></Link>
                            </section>
                        }
                        {historico.slice(0).reverse().map((e)=>{
                            return(
                                <section className="section-item-historico" id={`item-historico-${historico.findIndex( (element) => element.name == e.name)}`}>
                                    <a onClick={()=>pesquisarMovieHistorico(`/#/pesquisar/search=${e.name}&pagina=1`, e.name)}>
                                        <span className="nome-item-historico"><i class="fa-solid fa-clock-rotate-left"></i> {e.name}</span>
                                        <span className="data-item-historico" title={`${e.data} às ${e.hora}`}>{e.data} às {e.hora}</span>
                                    </a>
                                    <button className="bt-excluir-item-historico" title="Excluir" onClick={()=>removerDoHistorico(historico.findIndex( (element) => element.name == e.name))}><i class="fas fa-close"></i></button>
                                    <button className="bt-excluir-item-historico" title="Excluir" onClick={()=>moviePesquisar(e.name)}><i class="fa-solid fa-arrow-up-right-from-square"></i></button>
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
                            <span onClick={()=>settingsPesquisa('multi')}>Tudo</span>
                        </label>
                    </section>
                    <section>
                        <input className="input-escolher-filtro" type='radio' name='input-radio-tipo-pesquisa' id={`input-tipo-pesquisa=2`}/>
                        <label className="label-escolher-filtro" htmlFor={`input-tipo-pesquisa=2`}>
                            <span onClick={()=>settingsPesquisa('movie')}>Filmes</span>
                        </label>
                    </section>
                    <section>
                        <input className="input-escolher-filtro" type='radio' name='input-radio-tipo-pesquisa' id={`input-tipo-pesquisa=3`}/>
                        <label className="label-escolher-filtro" htmlFor={`input-tipo-pesquisa=3`}>
                            <span onClick={()=>settingsPesquisa('tv')}>Séries</span>
                        </label>
                    </section>
                    <section>
                        <input className="input-escolher-filtro" type='radio' name='input-radio-tipo-pesquisa' id={`input-tipo-pesquisa=4`}/>
                        <label className="label-escolher-filtro" htmlFor={`input-tipo-pesquisa=4`}>
                            <span onClick={()=>settingsPesquisa('person')}>Pessoas</span>
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
                                <>
                                    {((movie.release_date || movie.first_air_date) && movie.poster_path) &&
                                        <div className='movie-pesquisar' title={movie.title? movie.title : movie.name}>
                                            <Link to={`/assistir=${tipoPesquisa == 'multi'? movie.media_type : filmeSeriePessoa}&${movie.id}`}>
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
                                            {
                                            movie.media_type == 'movie' &&
                                                <span className='span-movie-filme'>Filme</span>
                                            }
                                            {
                                            movie.media_type == 'tv' &&
                                                <span className='span-movie-serie'>Série</span>
                                            }
                                            <span className="titulo-movie">{movie.title}{movie.name}</span>
                                        </div>
                                    }
                                </>
                                )
                            })
                        }
                    </div>
                    }
                    <div className="div-pessoa-pesquisar" id="div-pessoa-pesquisar">
                        {movies.map(movie => {
                            return (
                                <>
                                {movie.profile_path &&
                                    <div className='pessoa-pesquisar'>
                                        <Link to={`/pessoa=${movie.id}/bg=movie`}>
                                            <img src={`${image_path}${movie.profile_path}`} alt={movie.name} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-erro-exclamacao.png";}}/>
                                            <section className="section-informacoes-pessoa-pesquisar">
                                                <span className="titulo-pessoa">{movie.name}</span>
                                            </section>
                                        </Link>
                                        <span className='span-pessoa'>Pessoa</span>
                                    </div>
                                }
                                </>
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
                            <label className="label-escolher-genero label-bt-pagina-genero" id="label-paginas-generos=1" for="input-paginas-genero=1">
                                <Link onClick={()=>window.scrollTo(0,0)} to={`/pesquisar/search=${movieName}&pagina=${Number(numeroPagina) - 1}`} className="bt-pagina-pesquisar"><i class="fa-solid fa-angle-left"></i> Anterior: {Number(numeroPagina) - 1}</Link>
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
                        <label className="label-escolher-genero label-bt-pagina-genero" id="label-paginas-generos=2" for="input-paginas-genero=2">
                            <Link onClick={()=>window.scrollTo(0,0)} to={`/pesquisar/search=${movieName}&pagina=${Number(numeroPagina) + 1}`} className="bt-pagina-pesquisar">{numeroPagina == 1 ? 'Ver mais' : `Próximo: ${Number(numeroPagina) + 1}`} <i class="fa-solid fa-angle-right"></i></Link>
                        </label>
                    </section>
                </div>
            </div>
            }
        </div>
    )
}