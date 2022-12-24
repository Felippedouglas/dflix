import { Link } from "react-router-dom"
import './style.css';
import $ from 'jquery';
import { useEffect, useState } from "react";
import PopUpNav from "./components/pop-up-nav";
import Notificacoes from "./components/notificacoes";
import { TodasNotificacoes } from "./components/notificacoes/notificacoes";
import BandeiraEua from './bandeira-eua.png';
import BandeiraBrasil from './bandeira-brasil.png';
import Login from "../../paginas/usuario";
import Logout from "../../paginas/usuario/logout";


export default function Nav() {

    const [ user, setUser ] = useState({});

    const [ logout, setLogout ] = useState(false);

    const [ popUpNav, setPopUpNav ] = useState(false);
    const [ widthClient, setWidthClient ] = useState();
    const [ economiaInternet, setEconomiaInternet ] = useState();
    const [ nomeUsuario, setNomeUsuario ] = useState();
    const [ exibirNotificacoes, setExibirNotificacoes ] = useState(false);
    
    const [ dia, setDia ] = useState();
    const [ mes, setMes ] = useState();
    const [ ano, setAno ] = useState();

    const [ diaVisualizacaoNotificacao, setDiaVisualizacaoNotificacao ] = useState();
    const [ mesVisualizacaoNotificacao, setMesVisualizacaoNotificacao ] = useState();
    const [ anoVisualizacaoNotificacao, setAnoVisualizacaoNotificacao ] = useState();
    
    const [ idioma, setIdioma ] = useState();
    const [ novasNotificacoes, setNovasNotificacoes ] = useState(false);

    useEffect(()=>{
        setDia(TodasNotificacoes.ultima_atualizacao.dia);
        setMes(TodasNotificacoes.ultima_atualizacao.mes);
        setAno(TodasNotificacoes.ultima_atualizacao.ano);

        setDiaVisualizacaoNotificacao(Number(localStorage.getItem('diaVisualizacaoNotificacao') || 0));
        setMesVisualizacaoNotificacao(Number(localStorage.getItem('mesVisualizacaoNotificacao') || 0));
        setAnoVisualizacaoNotificacao(Number(localStorage.getItem('anoVisualizacaoNotificacao') || 0));

        setTimeout(() => {
            if ((diaVisualizacaoNotificacao < dia && mesVisualizacaoNotificacao < mes) || (anoVisualizacaoNotificacao < ano) || (mesVisualizacaoNotificacao < mes && anoVisualizacaoNotificacao == ano) || (mesVisualizacaoNotificacao == mes && diaVisualizacaoNotificacao < dia) ) {
                setNovasNotificacoes(true);
            } else {
                setNovasNotificacoes(false);
            }
        }, 100);

        
    }, [exibirNotificacoes, diaVisualizacaoNotificacao, mesVisualizacaoNotificacao, anoVisualizacaoNotificacao, widthClient])
    
    
    setInterval(()=>{
        setIdioma(localStorage.getItem('idioma') || 'portugues')
        setWidthClient(document.body.clientWidth);
        setEconomiaInternet(localStorage.getItem('economia'));
        setNomeUsuario(localStorage.getItem('nomeUsuario'));
    }, 1000)

    $(window).on('scroll', function() {
        if ($(window).scrollTop() >= 1) {
            document.getElementById('content-nav').style.background = '#050505';
            document.getElementById('content-nav').style.borderBottom = '1px solid #505050';
        } else if ($(window).scrollTop() == 0){
            document.getElementById('content-nav').style.background = 'initial';
            document.getElementById('content-nav').style.borderBottom = '1px solid transparent';
        }
    })
    
    function abrirNav() {
        setTimeout(() => {
            setPopUpNav(!popUpNav);
            document.body.style.overflow = 'hidden';
        }, 100);
    }
    
    function fecharNav() {
        setTimeout(() => {
            setPopUpNav(!popUpNav);
            document.body.style.overflow = 'auto';
        }, 100);
    }

    function abrirFecharNotificacoes() {

        if (exibirNotificacoes) {
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = 0;
            setExibirNotificacoes(false);            
        } else {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '7px';
            setExibirNotificacoes(true);
            var date = new Date();
            localStorage.setItem('diaVisualizacaoNotificacao', date.getDate());
            localStorage.setItem('mesVisualizacaoNotificacao', date.getMonth() + 1);
            localStorage.setItem('anoVisualizacaoNotificacao', date.getFullYear());
            document.getElementById("content-notificacoes").scrollTo(0,0);
        }
    }

    function definirIdioma(e) {
        if (e != idioma) {
            localStorage.setItem('idioma', e)
            setIdioma(e)
            window.scrollTo(0,0)
        }
    }

    return(

        <div className='content-nav' id="content-nav">

            <Login setUser={setUser}/>
            {logout &&
                <Logout />
            }

            <section className='section-img-list-nav'>
                <Link to="/" className="link-logo-dflix"><img src="https://dflix.netlify.app/icones/dflix.svg" alt="logo-dflix" /></Link>
                <div className="div-links-nav">
                    <ul>
                        <Link to='/'>
                            <i className="fa-solid fa-house-crack"></i>
                            <span className="span-link-nav">{idioma == 'portugues' ? 'início' : 'home'}</span>
                        </Link>
                        <Link to='/tv/genero=10759/Action & Adventure&infantil=false&pagina=1'>
                            <i className="fa-solid fa-tv"></i>
                            <span className="span-link-nav">{idioma == 'portugues' ? 'séries' : 'tv'}</span>
                        </Link>
                        <Link to='/movie/genero=28/ação&infantil=false&pagina=1'>
                            <i className="fa-solid fa-clapperboard"></i>
                            <span className="span-link-nav">{idioma == 'portugues' ? 'filmes' : 'movies'}</span>
                        </Link>
                        <Link id="link-infatil-desabilitar-mobile" to='/tv/genero=10762/kids&infantil=true&pagina=1'>
                            <i className="fa-solid fa-child-reaching"></i>
                            <span className="span-link-nav">{idioma == 'portugues' ? 'infantil' : 'kids'}</span>
                        </Link>
                        <Link to={`/favoritos/`} className='icone-favoritos-pesquisar'>
                            <i className="fa-solid fa-heart"></i>
                            <span className="span-link-nav">{idioma == 'portugues' ? 'favoritos' : 'favorites'}</span>
                        </Link>
                    </ul>
                </div>
            </section>
            <section className="section-lupa-menu-mobile">
                <button onClick={abrirFecharNotificacoes} className="button-abrir-notificacoes"><i className="fa-solid fa-bell"></i> {novasNotificacoes ? <span className="span-novas-notificacoes"><i className="fa-solid fa-info"></i></span> : ''}</button>
                <Link to={`/pesquisar/`} className='icone-lupa-pesquisar'><i className="fas fa-search"></i></Link>
                <div className='div-abrir-pop-up-nav' onClick={()=>abrirNav()}>
                    <i className="fa-solid fa-bars"></i>
                </div>
            </section>

            <PopUpNav popUpNav={popUpNav} setPopUpNav={setPopUpNav}>
                <div className='div-fechar-pop-up-nav' onClick={()=>fecharNav()}>
                    <span><i className="fa-solid fa-bars"></i></span>
                </div>
                <div className="div-menu-hamburguer-mobile">
                    <section className="section-menu-hamburguer-nav-mobile">
                        <ul>
                            {user.email == 'dfelipex18@gmail.com' &&
                                <Link to='/keyword=207317&pagina=1' onClick={()=>fecharNav()}><i className="fa-solid fa-heart"></i> <span>Keyword</span></Link>
                            }
                            <Link to={`/conta/`} onClick={()=>fecharNav()}>
                                <img className="img-perfil-nav" src={user.photoURL ? user.photoURL : 'https://dflix.netlify.app/imagens/img-avatar.png'} alt='user' onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-avatar.png";}} />
                                <span>{ user.displayName ? user.displayName.split(' ')[0] : 'Fazer Login'}</span>
                            </Link>
                            <Link to={`/conta/`} onClick={()=>fecharNav()}><i className="fa-solid fa-gear"></i> <span className="span-nav-menu-hamburguer">{idioma == 'portugues' ? 'configurações' : 'settings'}</span></Link>
                            {idioma == 'portugues' ?
                            <a><i className="fa-solid fa-wifi"></i> <span className="span-nav-menu-hamburguer">uso: {economiaInternet ? 'Reduzido' : 'Recomendado'}</span></a>
                            : <a><i className="fa-solid fa-wifi"></i> <span className="span-nav-menu-hamburguer">use: {economiaInternet ? 'reduced' : 'recommended'}</span></a>
                            }
                            {user.email && user.displayName &&
                                <button className="bt-sair-conta-nav" onClick={()=>setLogout(true)}><i className="fa-sharp fa-solid fa-right-to-bracket"></i> Sair</button>
                            }
                            <h3 className="h3-idioma-nav">
                                <p className="nome-configuracao"><i className="fa-solid fa-earth-americas"></i> {idioma == 'portugues' ? 'Idioma' : 'Language'}</p>
                                <span className="span-beta-nav"><i className="fa-solid fa-circle-info"></i> Beta</span>
                            </h3>
                            <div className="div-idiomas-conta-nav">
                                <button className="portugues selecionarIdioma" onClick={()=>definirIdioma('portugues')}><span><img src={BandeiraBrasil} alt="bandeira do brasil"/>Português </span>{idioma == 'portugues' && <i className="fa-solid fa-check"></i>}</button>
                                <button className="ingles selecionarIdioma" onClick={()=>definirIdioma('ingles')}><span><img src={BandeiraEua} alt="bandeira dos eua"/>English </span>{idioma == 'ingles' && <i className="fa-solid fa-check"></i>}</button>
                            </div>
                        </ul>
                        {widthClient <= 600 &&
                            <ul>
                                <Link to='/' onClick={()=>fecharNav()}><i className="fa-solid fa-house-crack"></i> <span className="span-link-nav-mobile">{idioma == 'portugues' ? 'início' : 'home'}</span></Link>
                                <Link to='/tv/genero=10759/Action & Adventure&infantil=false&pagina=1' onClick={()=>fecharNav()}><i className="fa-solid fa-tv"></i> <span className="span-link-nav-mobile">{idioma == 'portugues' ? 'series' : 'tv'}</span></Link>
                                <Link to='/movie/genero=28/ação&infantil=false&pagina=1' onClick={()=>fecharNav()}><i className="fa-solid fa-clapperboard"></i> <span className="span-link-nav-mobile">{idioma == 'portugues' ? 'filmes' : 'movies'}</span></Link>
                                <Link to='/tv/genero=10762/kids&infantil=true&pagina=1' onClick={()=>fecharNav()}><i className="fa-solid fa-child-reaching"></i> <span className="span-link-nav-mobile">{idioma == 'portugues' ? 'infantil' : 'kids'}</span></Link>
                                <Link to='/favoritos' onClick={()=>fecharNav()}><i className="fa-solid fa-heart"></i> <span>{idioma == 'portugues' ? 'Favoritos' : 'Favorites'}</span></Link>
                            </ul>
                        }
                    </section>
                </div>
            </PopUpNav>
            <Notificacoes exibirNotificacoes={exibirNotificacoes} setExibirNotificacoes={setExibirNotificacoes}/>
        </div>
    )
}