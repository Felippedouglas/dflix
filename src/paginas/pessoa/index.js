import { React, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { APIKey } from "../../config/key";
import backgroundErro from '../../componentes/imgs/img-erro-background-pessoa.png';
import './style.css';
import Alert from "../../componentes/alert";
import PopUp from "../../componentes/pop-up";

export default function Pessoa() {

    const [ alert, setAlert ] = useState(false);
    const [ alertTitle, setAlertTitle ] = useState('Configurações');
    const [ alertMessage, setAlertMessage ] = useState();

    const [ movies, setMoviesParticipados ] = useState([]);
    const [ numeroFilhos, setNumeroFilhos ] = useState();
    const [ carregando, setCarregando ] = useState();
    
    const [ popUp, setPopUp ] = useState(false);
    const [ fotoPopUp, setFotoPopUp ] = useState('');
    const [ fotoOriginalPopUp, setFotoOriginalPopUp ] = useState('');
    const [ alturaFotoPopUp, setAlturaFotoPopUp ] = useState();
    const [ larguraFotoPopUp, setLarguraFotoPopUp ] = useState();
    const [ avaliacoesFotoPopUp, setAvaliacoesFotoPopUp ] = useState();

    const [ pessoaImages, setPessoaImages ] = useState([]);
    const [ pessoaImagesQuantidade, setPessoaImagesQuantidade ] = useState();
    const { idPessoa, backgroundMovie, exibir } = useParams();
    const [ pessoa, setPessoa ] = useState([]);
    const [ idadepessoa, setIdadePessoa ] = useState();
    const [ backgroundImgPessoa, setBackgroundImgPessoa ] = useState();
    const [ posterImgPessoa, setPosterImgPessoa ] = useState();
    const [ nameMovieBackgroundImgPessoa, setNameMovieBackgroundImgPessoa ] = useState();
    const [ idMovieBackgroundImgPessoa, setIdMovieBackgroundImgPessoa ] = useState();
    const [ economiaInternet, setEconomiaInternet ] = useState();
    const [ stateExibir, setStateExibir ] = useState();
    const image_path = 'https://image.tmdb.org/t/p/w200';

    const [ idioma, setIdioma ] = useState();

    useEffect(() => {

        var idioma = localStorage.getItem('idioma') || 'portugues';
        setIdioma(idioma);
        
        fetch(`https://api.themoviedb.org/3/person/${idPessoa}?api_key=${APIKey}&language=${idioma == 'portugues' ? 'pt-BR' : 'en-US'}`)
        .then(Response => Response.json())
        .then(data => {
            setPessoa(data);
        })
        
        fetch(`https://api.themoviedb.org/3/person/${idPessoa}/images?api_key=${APIKey}`)
        .then(Response => Response.json())
        .then(data => {
            setPessoaImages(data);
            setPessoaImagesQuantidade(data.profiles.length);
        })
        
        if (stateExibir == 'movie' || stateExibir =='tv') {
            fetch(`https://api.themoviedb.org/3/person/${idPessoa}/${stateExibir}_credits?api_key=${APIKey}&language=${idioma == 'portugues' ? 'pt-BR' : 'en-US'}`)
            .then(Response => Response.json())
            .then(data => {
                setMoviesParticipados(data);
            })

            setNumeroFilhos(1);

            setTimeout(()=>{
                var numeroFilhos = document.getElementById("verificar-numero-filhos");
                if (numeroFilhos) {
                    setNumeroFilhos(numeroFilhos.childElementCount);
                }
            }, 1000)
        }
        
        setEconomiaInternet(localStorage.getItem('economia'));

        setTimeout(()=>{
            setCarregando(true);
            setTimeout(()=>{
                setCarregando(false)
            }, 300)
        }, 10)

        if(exibir) {
            setTimeout(()=>{
                document.getElementById(`label-exibir-${exibir}`).click();
                setTimeout(()=>{
                    document.getElementById(`link-exibir-${exibir}`).click();
                }, 10)
            }, 300)
        }
        document.title = `DFLIX`;
        document.querySelector("meta[name=theme-color]").setAttribute("content", '#181818');
    }, [idPessoa, stateExibir, exibir])

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/discover/${backgroundMovie}?api_key=${APIKey}&language=${idioma == 'portugues' ? 'pt-BR' : 'en-US'}&with_people=${idPessoa}&sort_by=popularity.desc&page=1`)
        .then(Response => Response.json())
        .then(data => {
            setBackgroundImgPessoa(data.results[0].backdrop_path);
            setPosterImgPessoa(data.results[0].poster_path);
            setIdMovieBackgroundImgPessoa(data.results[0].id)
            if(backgroundMovie == 'tv') {
                setNameMovieBackgroundImgPessoa(data.results[0].name);
            } else if(backgroundMovie == 'movie') {
                setNameMovieBackgroundImgPessoa(data.results[0].title);
            }
        })
            
        document.title = `DFLIX`;
    }, [idPessoa, exibir])
        
    // definir idade pessoa
    setTimeout(()=>{
        if (pessoa.birthday) {
            if (pessoa.deathday) {
                function idade(ano_aniversario, mes_aniversario, dia_aniversario) {
                    var d = new Date,
                        ano_morte = pessoa.deathday.slice(0,4),
                        mes_morte = pessoa.deathday.slice(5,7),
                        dia_morte = pessoa.deathday.slice(8,10),
                
                        ano_aniversario = +ano_aniversario,
                        mes_aniversario = +mes_aniversario,
                        dia_aniversario = +dia_aniversario,
                
                        quantos_anos = ano_morte - ano_aniversario;
                
                    if (mes_morte < mes_aniversario || mes_morte == mes_aniversario && dia_morte < dia_aniversario) {
                        quantos_anos--;
                    }
                
                    return quantos_anos < 0 ? 0 : quantos_anos;
                }
                setIdadePessoa(idade(pessoa.birthday.slice(0,4), pessoa.birthday.slice(5,7), pessoa.birthday.slice(8,10)));
            } else if(!pessoa.deathday) {
                function idade(ano_aniversario, mes_aniversario, dia_aniversario) {
                    var d = new Date,
                        ano_atual = d.getFullYear(),
                        mes_atual = d.getMonth() + 1,
                        dia_atual = d.getDate(),
                        
                        ano_aniversario = +ano_aniversario,
                        mes_aniversario = +mes_aniversario,
                        dia_aniversario = +dia_aniversario,
                
                        quantos_anos = ano_atual - ano_aniversario;
                
                    if (mes_atual < mes_aniversario || mes_atual == mes_aniversario && dia_atual < dia_aniversario) {
                        quantos_anos--;
                    }
                
                    return quantos_anos < 0 ? 0 : quantos_anos;
                }
                setIdadePessoa(idade(pessoa.birthday.slice(0,4), pessoa.birthday.slice(5,7), pessoa.birthday.slice(8,10)));
            }
        }
    }, 100)

    setTimeout(()=>{
        if(pessoa.name != undefined) {
            document.title = `${pessoa.name} - DFLIX`;
        }
    }, 100)

    function redirecionarErro() {
        window.location = '/404'
    }

    function erro() {
        if (!alert) {
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
            }, 5000)
        }

        setAlertTitle(idioma == 'portugues' ?  'Erro!' : 'Error!');
        setAlertMessage(idioma == 'portugues' ? 'Esta opção ainda não está disponível' : 'This option is not yet available');
    }
    
    function abrirFoto(img, imgOriginal, largura, altura, avaliacoes, link) {
        setPopUp(!popUp);
        document.body.style.overflow = 'hidden';
        setFotoPopUp(img);
        setFotoOriginalPopUp(imgOriginal);
        setLarguraFotoPopUp(largura);
        setAlturaFotoPopUp(altura);
        setAvaliacoesFotoPopUp(avaliacoes);
    }
    
    function fecharFoto() {
        setPopUp(!popUp);
        document.body.style.overflow = 'auto';
    }
    
    return (
        <>
        <PopUp popUp={popUp} setPopUp={setPopUp}>
            <section className="section-pop-up-foto-ator">
                <button className='bt-fechar-popup bt-fechar-foto-pessoa' onClick={()=>fecharFoto()}><i className="fa-solid fa-xmark"></i></button>
                <img src={fotoPopUp}/>
                <section className="section-info-foto-pessoa">
                    <a href={fotoOriginalPopUp} target="_blank"><i className="fa-solid fa-up-right-from-square"></i> {idioma == 'portugues' ? 'Abrir em uma nova guia' : 'Open in new tab'}</a>
                </section>
                <section className="section-info-foto-pessoa">
                    <span>{idioma == 'portugues' ? 'Tamanho' : 'Size'}</span>
                    <p>{alturaFotoPopUp} x {larguraFotoPopUp}</p>
                </section>
                <section className="section-info-foto-pessoa">
                    <span>{idioma == 'portugues' ? 'Avaliações' : 'Rating'}</span>
                    <p><i className="fa-solid fa-thumbs-up"></i> {avaliacoesFotoPopUp}</p>
                </section>
            </section>

        </PopUp>
        <Alert alert={alert} alertTitle={alertTitle} alertMessage={alertMessage}/>
            {pessoa.name &&
                <div className="container-pessoa" id="container-pessoa">
                    <section className="section-pessoa">
                        <section className="section-background-pessoa">
                            {!economiaInternet &&
                                <Link to={`/assistir=${backgroundMovie}&${idMovieBackgroundImgPessoa}`} className="nome-movie-background"><i className="fa-regular fa-image"></i> {nameMovieBackgroundImgPessoa}</Link>
                            }
                            {document.body.clientWidth >= 600 && !economiaInternet &&
                                <img src={backgroundImgPessoa != undefined ? `${image_path}${backgroundImgPessoa}` : `${backgroundErro}`} alt={`img background ${pessoa.name}`}/>
                            }
                            {document.body.clientWidth < 600 && !economiaInternet &&
                                <img src={backgroundImgPessoa != undefined ? `${image_path}${posterImgPessoa}` : `${backgroundErro}`} alt={`img background ${pessoa.name}`}/>
                            }
                            {economiaInternet &&
                                <img src={backgroundErro} alt={`img background ${pessoa.name}`}/>
                            }
                        </section>
                        <section className="section-informacoes-pessoa">
                            <img className="img-pessoa" loading="lazy" src={pessoa.profile_path ? `${image_path}${pessoa.profile_path}` : 'https://dflix.netlify.app/imagens/img-avatar.png'} alt={pessoa.name} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-avatar.png";}}/>
                            <div className="div-sobre-pessoa">
                                <section className="nome-pessoa">
                                    <h1>{pessoa.name}</h1>
                                    {pessoa.birthday && !pessoa.deathday &&
                                        <span className="span-idade-pessoa">{idadepessoa}{idioma == 'portugues' ? ' Anos' : ' Years old'}</span>
                                    }
                                </section>
                                <nav>
                                    <div className="div-escolher-categoria-movie div-escolher-categoria-exibir">
                                        <section className="section-categoria-movie section-categoria-exibir">
                                            <input type="radio" autoFocus name="input-radio-categoria-filme" id="input-radio-categoria-filme"/>
                                            <label htmlFor="input-radio-categoria-filme" id="label-exibir-filmes">
                                                <Link onClick={()=>setStateExibir('movie')} className="link-exibir-pc" id="link-exibir-filmes" to={`/pessoa=${idPessoa}/bg=movie/filmes`}>{idioma == 'portugues' ? 'Filmes' : 'Movies'}</Link>
                                                <Link onClick={()=>setStateExibir('movie')} className="link-exibir-mobile" id="link-exibir-filmes" to={`/pessoa=${idPessoa}/bg=movie/filmes`}> <i className="fa-solid fa-clapperboard"></i></Link>
                                            </label>
                                        </section>
                                        <section className="section-categoria-movie section-categoria-exibir">
                                            <input type="radio" name="input-radio-categoria-filme" id="input-radio-categoria-filme-2"/>
                                            <label htmlFor="input-radio-categoria-filme-2" id="label-exibir-series">
                                                <Link onClick={()=>setStateExibir('tv')} className="link-exibir-pc" id="link-exibir-series" to={`/pessoa=${idPessoa}/bg=tv/series`}>{idioma == 'portugues' ? 'Séries' : 'Series'}</Link>
                                                <Link onClick={()=>setStateExibir('tv')} className="link-exibir-mobile" id="link-exibir-series" to={`/pessoa=${idPessoa}/bg=movie/series`}> <i className="fa-solid fa-tv"></i></Link>
                                            </label>
                                        </section>
                                        <section className="section-categoria-movie section-categoria-exibir">
                                            <input type="radio" name="input-radio-categoria-filme" id="input-radio-categoria-filme-3"/>
                                            <label htmlFor="input-radio-categoria-filme-3" id="label-exibir-fotos">
                                                <Link onClick={()=>setStateExibir('fotos')} className="link-exibir-pc" id="link-exibir-fotos" to={`/pessoa=${idPessoa}/bg=${backgroundMovie}/fotos`}>{idioma == 'portugues' ? 'Fotos' : 'Photos'} | {pessoaImagesQuantidade}</Link>
                                                <Link onClick={()=>setStateExibir('fotos')} className="link-exibir-mobile" id="link-exibir-fotos" to={`/pessoa=${idPessoa}/bg=movie/fotos`}> <i className="fa-solid fa-image"></i> {pessoaImagesQuantidade}</Link>
                                            </label>
                                        </section>
                                        <section className="section-categoria-movie section-categoria-exibir">
                                            <input type="radio" name="input-radio-categoria-filme" id="input-radio-categoria-filme-4"/>
                                            <label htmlFor="input-radio-categoria-filme-4" id="label-exibir-sobre">
                                                <Link onClick={()=>setStateExibir('sobre')} className="link-exibir-pc" id="link-exibir-sobre" to={`/pessoa=${idPessoa}/bg=${backgroundMovie}/sobre`}>{idioma == 'portugues' ? 'Sobre' : 'About'}</Link>
                                                <Link onClick={()=>setStateExibir('sobre')} className="link-exibir-mobile" id="link-exibir-sobre" to={`/pessoa=${idPessoa}/bg=movie/sobre`}> <i className="fa-solid fa-address-card"></i></Link>
                                            </label>
                                        </section>
                                        {carregando &&
                                            <section>
                                                <span className="span-carregando-exibir" id="span-carregando-exibir"><i className="fa-solid fa-circle-notch fa-spin"></i></span>
                                            </section>
                                        }
                                    </div>
                                </nav>
                            </div>
                        </section>
                    </section>
                    <section>
                        {stateExibir == 'movie' &&
                            <div className="div-movie-pessoa" id="verificar-numero-filhos">
                                {movies.cast &&
                                    movies.cast.map(filmeParticipado => {
                                        return (
                                        <div key={`${filmeParticipado.title}-${filmeParticipado.id}-${Math.random() * 10000}`}>
                                            {filmeParticipado.vote_count > 0 &&
                                                <div className="movie">
                                                    <Link to={`/assistir=movie&${filmeParticipado.id}`}>
                                                        <img loading="lazy" src={filmeParticipado.poster_path ? `${image_path}${filmeParticipado.poster_path}` : 'https://dflix.netlify.app/imagens/img-erro-exclamacao.png'} alt={filmeParticipado.title} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-erro-exclamacao.png";}}/>
                                                        <section className="section-informacoes-movie">
                                                            <div className="div-avaliacao-movie">
                                                                <span className="span-estrela-movie">
                                                                    <i className="fas fa-star"></i>
                                                                </span>
                                                                <span>{filmeParticipado.vote_average.toFixed(1)} </span>
                                                            </div>
                                                            {filmeParticipado.release_date &&
                                                                <span>{filmeParticipado.release_date.slice(0,4)}</span>
                                                            }
                                                        </section>
                                                    </Link>
                                                    <span className="span-titulo-movie">{filmeParticipado.title}</span>
                                                </div>
                                            }
                                        </div>
                                        )
                                    })
                                }
                                {numeroFilhos == 0 &&
                                    <span>{idioma == 'portugues' ? 'Não há Filmes!' : 'No Movies!'} </span>
                                }
                            </div>
                        }
                        {stateExibir == 'tv' &&
                            <div className="div-movie-pessoa" id="verificar-numero-filhos">
                                {movies.cast &&
                                        movies.cast.map(serieParticipado => {
                                            return (
                                                <div key={`${serieParticipado.name}-${serieParticipado.id}-${Math.random() * 10000}`}>
                                                    {serieParticipado.vote_count > 0 &&
                                                        <div className="movie">
                                                            <Link to={`/assistir=tv&${serieParticipado.id}`}>
                                                                <img loading="lazy" src={serieParticipado.poster_path ? `${image_path}${serieParticipado.poster_path}` : 'https://dflix.netlify.app/imagens/img-erro-exclamacao.png'} alt={serieParticipado.title} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-erro-exclamacao.png";}}/>
                                                                <section className="section-informacoes-movie">
                                                                    <div className="div-avaliacao-movie">
                                                                        <span className="span-estrela-movie">
                                                                            <i className="fas fa-star"></i>
                                                                        </span>
                                                                        <span>{serieParticipado.vote_average.toFixed(1)} </span>
                                                                    </div>
                                                                    {serieParticipado.first_air_date &&
                                                                        <span>{serieParticipado.first_air_date.slice(0,4)}</span>
                                                                    }
                                                                </section>
                                                            </Link>
                                                            <span className="span-titulo-movie">{serieParticipado.name}</span>
                                                        </div>
                                                    }
                                                </div>
                                            )
                                        }
                                    )
                                }
                                {numeroFilhos == 0 &&
                                    <span>{idioma == 'portugues' ? 'Não há Series!' : 'No Series!'}</span>
                                }
                            </div>
                        }
                        {stateExibir == 'fotos' &&
                            <div className="div-movie-pessoa" id="verificar-numero-filhos">
                                {
                                    pessoaImages.profiles.map(fotos => {
                                        return (
                                            <div className="movie" key={`foto=${fotos.file_path}`}>
                                                <button onClick={()=>abrirFoto(`${image_path}${fotos.file_path}`, `https://image.tmdb.org/t/p/original${fotos.file_path}`, `${fotos.width}`, `${fotos.height}`, `${fotos.vote_count}`)} className="bt-abrir-info-foto"><i className="fa-sharp fa-solid fa-info"></i></button>
                                                    <img loading="lazy" src={fotos.file_path ? `${image_path}${fotos.file_path}` : 'https://dflix.netlify.app/imagens/img-erro-exclamacao.png'} alt={"foto"} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-erro-exclamacao.png";}}/>
                                                <span className="span-curtidas" onClick={()=>erro()}><i className="fa-solid fa-thumbs-up"></i><span> {fotos.vote_count}</span></span>
                                            </div>
                                        )
                                    }
                                    )
                                }
                                {pessoaImagesQuantidade == 0 &&
                                    <span>{idioma == 'portugues' ? 'Não há Fotos!' : 'No Photos!'}</span>
                                }
                            </div>
                        }
                        {stateExibir == 'sobre' &&
                            <>
                                <section className="sobre-pessoa">
                                    <section>
                                        {pessoa.place_of_birth &&
                                            <span><i className="fa-solid fa-earth-americas"></i> {pessoa.place_of_birth}</span>
                                        }
                                    </section>
                                    {pessoa.birthday &&
                                        <span><i className="fa-solid fa-calendar-days"></i> {pessoa.birthday.slice(8,10)}/{pessoa.birthday.slice(5,7)}/{pessoa.birthday.slice(0,4)}</span>
                                    }
                                    {pessoa.deathday &&
                                        <span> - <i className="fa-solid fa-cross"></i> {(pessoa.deathday).slice(8,10)}/{(pessoa.deathday).slice(5,7)}/{(pessoa.deathday).slice(0,4)}</span>
                                    }
                                    {pessoa.birthday &&
                                        <span> | {idadepessoa} {idioma == 'portugues' ? 'anos' : 'years old'}</span>
                                    }
                                    <section>
                                        {pessoa.gender == 1 ?
                                            <span><i className="fa-solid fa-venus"></i> {idioma == 'portugues' ? 'Genero: Feminino' : 'Genre: Female'}</span>
                                            : <span><i className="fa-solid fa-mars"></i> {idioma == 'portugues' ? 'Genero: Maculino' : 'Genre: Male'}</span>
                                        }
                                    </section>
                                </section>
                                {pessoa.biography != '' &&
                                    <section className="section-biográfia-pessoa">
                                        <h2 className="h2-titulo-sections"> {idioma == 'portugues' ? 'Biográfia' : 'biography'}</h2>
                                        <span>{pessoa.biography}</span>
                                    </section>
                                }
                            </>
                        }
                    </section>
                </div>
            }
            {pessoa.success == false &&
                redirecionarErro()
            }
        </>
    )
}