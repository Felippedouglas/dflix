import { useState, useEffect, React } from "react";
import Alert from "../../componentes/alert";
import BandeiraEua from './bandeira-eua.png';
import BandeiraBrasil from './bandeira-brasil.png';
import LogoGoogle from '../../componentes/imgs/logo-google.png';
import Usuario from "../usuario";
import './style.css';
import Login from "../usuario/login";
import Logout from "../usuario/logout";
import { AppFirebase } from "../../service/firebase";
import { doc, getFirestore, setDoc } from "firebase/firestore";


export default function Conta() {
    
    const [ user, setUser ] = useState({});

    const [ loginLogout, setLoginLogout ] = useState()
    
    const [ alert, setAlert ] = useState(false);
    const [ alertTitle, setAlertTitle ] = useState();
    const [ alertMessage, setAlertMessage ] = useState();

    const [ economiaInternet, setEconomiaInternet ] = useState();
    const [ favoritosHome, setFavoritosHome ] = useState();
    const [ salvarHistorico, setSalvarHistorico ] = useState();
    const [ exibirHistorico, setExibirHistorico ] = useState();
    const [ nomeUsuario, setNomeUsuario ] = useState();

    const [ idioma, setIdioma ] = useState();

    useEffect(()=> {

        if (user.uid) {
            const database = getFirestore(AppFirebase);
                async function addUsuarioDb() {
    
                    await setDoc(doc(database, "users", user.uid), {
                        nome: user.displayName,
                        email: user.email,
                        img: user.photoURL,
                    });
                    
            }
            
            addUsuarioDb();
        }

        setEconomiaInternet(localStorage.getItem('economia'));
        setFavoritosHome(localStorage.getItem('FavoritoHome'));
        setSalvarHistorico(localStorage.getItem('salvarHistorico'));
        setExibirHistorico(localStorage.getItem('exibirHistorico'));
        setNomeUsuario(localStorage.getItem('nomeUsuario'));
        
        setIdioma(localStorage.getItem('idioma') || 'portugues')

        setAlertTitle(`${idioma == 'portugues' ? 'Configurações' : 'settings'}`)

        document.getElementById("content-conta").style.display = 'flex';
    }, [favoritosHome, economiaInternet, nomeUsuario, idioma, user])

    function favoritoHome(e) {
        if (!alert) {
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
            }, 5000)
        }

        if (e == 'ativar') {
            localStorage.setItem('FavoritoHome', true)
            setAlertMessage(`${idioma == 'portugues' ? "Favoritos Home foi ATIVADO!" : "Favorites Home has been ON!"}`);
         
        } else {
            localStorage.removeItem('FavoritoHome')
            setAlertMessage(`${idioma == 'portugues' ? "Favoritos Home foi DESATIVADO!" : "Favorites Home has been DISABLED!"}`);
        }
        
        setFavoritosHome(!favoritosHome)
    }
    
    function economia(e) {
        if (!alert) {
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
            }, 5000)
        }

        if (e == 'ativar') {
            localStorage.setItem('economia', true)
            setAlertMessage(`${idioma == 'portugues' ? "A Economia de dados foi ATIVADA!" : "Data economy has been ON!"}`);
        } else {
            localStorage.removeItem('economia')
            setAlertMessage(`${idioma == 'portugues' ? "A Economia de dados foi DESATIVADA!" : "Data economy has been DISABLED!"}`);
        }

        setEconomiaInternet(!economiaInternet)
    }

    function functionSalvarHistorico(e) {
        if (!alert) {
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
            }, 5000)
        }

        if (e == 'ativar') {
            localStorage.setItem('salvarHistorico', true)
            setAlertMessage(`${idioma == 'portugues' ? "Salvar Histórico de pesquisas foi ATIVADO!" : "Save Search History has been ON!"}`);
        } else {
            localStorage.removeItem('salvarHistorico')
            setAlertMessage(`${idioma == 'portugues' ? "Salvar Histórico de pesquisas foi DESATIVADO!" : "Save Search History has been DISABLED!"}`);
        }

        setSalvarHistorico(!salvarHistorico)
    }

    function functionExibirHistorico(e) {
        if (!alert) {
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
            }, 5000)
        }

        if (e == 'ativar') {
            localStorage.setItem('exibirHistorico', true)
            setAlertMessage(`${idioma == 'portugues' ? "Exibir Histórico de pesquisa foi ATIVADO" : "View Search History has been ON"}`);
        } else {
            localStorage.removeItem('exibirHistorico')
            setAlertMessage(`${idioma == 'portugues' ? "Exibir Histórico de pesquisa foi DESATIVADO" : "View Search History has been DISABLED"}`);
        }

        setExibirHistorico(!exibirHistorico)
    }

    function definirIdioma(e) {
        if (e != idioma) {
            localStorage.setItem('idioma', e)
            setIdioma(e)
            window.scrollTo(0,0)
        }
    }

    function definirLoginLogout(loginLogout, ) {
        setLoginLogout(loginLogout);
    }

    return(
        <div className="content-conta" id="content-conta">

            <Alert alert={alert} alertTitle={alertTitle} alertMessage={alertMessage}/>
            <Usuario setUser={setUser}/>
            {loginLogout == 'login' &&
                <Login setUser={setUser}/>
            }
            {loginLogout == 'logout' &&
                <Logout setUser={setUser}/>
            }
            <div className="div-conta">
                <div className="div-informacoes-user">
                    <img className="img-perfil" src={user.photoURL ? user.photoURL : 'https://dflix.netlify.app/imagens/img-avatar.png'} alt='user' onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-avatar.png";}} />
                    {user.displayName &&
                        <h2 className="nome-usuario">{user.displayName ? user.displayName : "User 404"}</h2>
                    }
                    {!user.displayName &&
                        <button onClick={()=>definirLoginLogout('login', 'google')} className="bt-login-conta"><img className="logo-google-email" src={LogoGoogle} alt="google"/> Login com Google</button>
                    }
                    {user.email &&
                        <span className="span-email-usuario"><img className="logo-google-email" src={LogoGoogle} alt="google"/> {user.email}</span>
                    }
                    {user.email && user.displayName &&
                        <button onClick={()=>definirLoginLogout('logout')} className="bt-sair-conta"><i className="fa-sharp fa-solid fa-right-to-bracket"></i> Sair</button>
                    }
                    <div className="div-idioma-configuracoes">
                        <div className="header-ul-configuracao">
                            <span className="nome-configuracao"><i className="fa-solid fa-earth-americas"></i>{idioma == 'portugues' ? 'Idioma' : 'Language'}</span>
                            <span className="span-beta"><i className="fa-solid fa-circle-info"></i> Beta</span>
                        </div>
                        <div className="div-idiomas-conta">
                            <button className="portugues selecionarIdioma" onClick={()=>definirIdioma('portugues')}><img src={BandeiraBrasil} alt="bandeira do brasil"/>Português {idioma == 'portugues' && <i className="fa-solid fa-check"></i>}</button>
                            <button className="ingles selecionarIdioma" onClick={()=>definirIdioma('ingles')}><img src={BandeiraEua} alt="bandeira dos eua"/>English {idioma == 'ingles' && <i className="fa-solid fa-check"></i>}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="div-configuracoes">
                <h2 className="h2-titulo-sections h2-titulo-configuracoes">{idioma == 'portugues' ? 'Configurações' : 'settings'}</h2>
                <ul>
                    <div className="header-ul-configuracao">
                        <span className="nome-configuracao">{idioma == 'portugues' ? 'favoritos página inicial' : 'Favorites on homepage'}</span>
                        <button onClick={()=> favoritosHome ? favoritoHome('desativar') : favoritoHome('ativar')} className={favoritosHome ? 'bt-ativar-desativar-configuracao bt-desativar-configuracao' : 'bt-ativar-desativar-configuracao bt-ativar-configuracao' }>
                            <div></div>
                        </button>
                    </div>
                    <p className="descricao-configuracao">
                        {idioma == 'portugues' ? "Esta opção Ativa ou Desativa a exibição de séries/tv e filmes marcados como favoritos na página inicial."
                        : "This option Enables or Disables the display of tv and movies marked as favorites on the homepage."}</p>
                </ul>
                <ul>
                    <div className="header-ul-configuracao">
                        <span className="nome-configuracao">{idioma == 'portugues' ? 'Economia de dados' : 'Data economy'}</span>
                        <button onClick={()=> economiaInternet ? economia('desativar') : economia('ativar')} className={economiaInternet ? 'bt-ativar-desativar-configuracao bt-desativar-configuracao' : 'bt-ativar-desativar-configuracao bt-ativar-configuracao' }>
                            <div></div>
                        </button>
                    </div>
                    <p className="descricao-configuracao">{idioma == 'portugues' ? "Ative esta opção caso tenha uma internet lenta. Algumas funcionalidades não estarão disponíveis, mas nada que atrapalhe a sua experiência no site."
                    : "Activate this option if you have a slow internet connection. Some features will not be available, but nothing that interferes with your experience on the site."}</p>
                </ul>
                <ul>
                    <div className="header-ul-configuracao">
                        <span className="nome-configuracao">{idioma == 'portugues' ? 'salvar pesquisas' : 'Save searches'}</span>
                        <button onClick={()=> salvarHistorico ? functionSalvarHistorico('desativar') : functionSalvarHistorico('ativar')} className={salvarHistorico ? 'bt-ativar-desativar-configuracao bt-desativar-configuracao' : 'bt-ativar-desativar-configuracao bt-ativar-configuracao' }>
                            <div></div>
                        </button>
                    </div>
                    <p className="descricao-configuracao">{idioma == 'portugues' ? "Salve os nomes de filmes, séries e pessoas pesquisadas."
                    : "Save the names of movies, series and people searched."}</p>
                </ul>
                <ul>
                    <div className="header-ul-configuracao">
                        <span className="nome-configuracao">{idioma == 'portugues' ? 'Exibir histórico de pesquisa' : 'Display search history'}</span>
                        <button onClick={()=> exibirHistorico ? functionExibirHistorico('desativar') : functionExibirHistorico('ativar')} className={exibirHistorico ? 'bt-ativar-desativar-configuracao bt-desativar-configuracao' : 'bt-ativar-desativar-configuracao bt-ativar-configuracao' }>
                            <div></div>
                        </button>
                    </div>
                    <p className="descricao-configuracao">{idioma == 'portugues' ? "Esta opção ativa ou desativa a exibição do histórico de pesquisa."
                    : "This option enables or disables the display of search history."}</p>
                </ul>
            </div>
        </div>
    )
}