import { useState, useEffect, React } from "react";
import './style.css';
import ImgAvatar from '../../componentes/imgs/img-avatar.png'
import Alert from "../../componentes/alert";


export default function Conta() {
    
    const [ alert, setAlert ] = useState(false);
    const [ alertTitle, setAlertTitle ] = useState('Configurações');
    const [ alertMessage, setAlertMessage ] = useState();

    const [ economiaInternet, setEconomiaInternet ] = useState();
    const [ favoritosHome, setFavoritosHome ] = useState();
    const [ salvarHistorico, setSalvarHistorico ] = useState();
    const [ exibirHistorico, setExibirHistorico ] = useState();
    const [ nomeUsuario, setNomeUsuario ] = useState();

    useEffect(()=>{
        
        setEconomiaInternet(localStorage.getItem('economia'));
        setFavoritosHome(localStorage.getItem('FavoritoHome'));
        setSalvarHistorico(localStorage.getItem('salvarHistorico'));
        setExibirHistorico(localStorage.getItem('exibirHistorico'));
        setNomeUsuario(localStorage.getItem('nomeUsuario'));

        document.getElementById("content-conta").style.display = 'flex';
    }, [favoritosHome, economiaInternet, nomeUsuario])

    function favoritoHome(e) {
        if (!alert) {
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
            }, 5000)
        }

        if (e == 'ativar') {
            localStorage.setItem('FavoritoHome', true)
            setAlertMessage('Favoritos Home foi ATIVADO!');
         
        } else {
            localStorage.removeItem('FavoritoHome')
            setAlertMessage('Favoritos Home foi DESATIVADO!');
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
            setAlertMessage('A Economia de dados foi ATIVADA!');
        } else {
            localStorage.removeItem('economia')
            setAlertMessage('A Economia de dados foi DESATIVADA!');
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
            setAlertMessage('Salvar Histórico de pesquisas foi ATIVADO!');
        } else {
            localStorage.removeItem('salvarHistorico')
            setAlertMessage('Salvar Histórico de pesquisas foi DESATIVADO!');
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
            setAlertMessage('Exibir Histórico de pesquisa foi ATIVADO');
        } else {
            localStorage.removeItem('exibirHistorico')
            setAlertMessage('Exibir Histórico de pesquisa foi DESATIVADO');
        }

        setExibirHistorico(!exibirHistorico)
    }

    function salvarNomeUsuario(e) {
        setNomeUsuario(e)
        localStorage.setItem('nomeUsuario', e);
    }

    function verificarNomeUsuario() {
        if (nomeUsuario == '') {
            var numero = (Math.random()*1000).toFixed()
            localStorage.setItem('nomeUsuario', 'user' + numero)
            setNomeUsuario('nomeUsuario', 'user' + numero)
        }
        if (!alert) {
            setAlert(true)
            setAlertMessage('Nome alterado com sucesso!');
            setTimeout(()=>{
                setAlert(false)
            }, 5000)
        }
    }

    return(
        <div className="content-conta" id="content-conta">

            <Alert alert={alert} alertTitle={alertTitle} alertMessage={alertMessage}/>
            
            <div className="div-conta">
                <div className="div-informacoes-user">
                    <img className="img-perfil" src={ImgAvatar} alt="img-perfil" />
                    <div>
                        <input type='text' id="input-nome-usuario" spellCheck='false' value={nomeUsuario} maxLength={20} className="input-nome-usuario" onChange={(e)=>salvarNomeUsuario(e.target.value)} onBlur={()=>verificarNomeUsuario()}/>
                        <label className="label-edit-nome-usuario" htmlFor="input-nome-usuario"> <i class="fa-regular fa-pen-to-square"></i></label>
                    </div>
                </div>
            </div>
            <div className="div-configuracoes">
                <h2 className="h2-titulo-sections h2-titulo-configuracoes">configurações</h2>
                <ul>
                    <div className="header-ul-configuracao">
                        <span className="nome-configuracao">favoritos home</span>
                        <button onClick={()=> favoritosHome ? favoritoHome('desativar') : favoritoHome('ativar')} className={favoritosHome ? 'bt-ativar-desativar-configuracao bt-desativar-configuracao' : 'bt-ativar-desativar-configuracao bt-ativar-configuracao' }>
                            <div></div>
                        </button>
                    </div>
                    <p className="descricao-configuracao">Esta opção Ativa ou Desativa a exibição de séries/tv e filmes marcados como favoritos na página inicial</p>
                </ul>
                <ul>
                    <div className="header-ul-configuracao">
                        <span className="nome-configuracao">Economia de dados</span>
                        <button onClick={()=> economiaInternet ? economia('desativar') : economia('ativar')} className={economiaInternet ? 'bt-ativar-desativar-configuracao bt-desativar-configuracao' : 'bt-ativar-desativar-configuracao bt-ativar-configuracao' }>
                            <div></div>
                        </button>
                    </div>
                    <p className="descricao-configuracao">Ative esta opção caso tenha uma internet lenta. Imagens irrelevantes não serão exibidas.</p>
                </ul>
                <ul>
                    <div className="header-ul-configuracao">
                        <span className="nome-configuracao">salvar pesquisas</span>
                        <button onClick={()=> salvarHistorico ? functionSalvarHistorico('desativar') : functionSalvarHistorico('ativar')} className={salvarHistorico ? 'bt-ativar-desativar-configuracao bt-desativar-configuracao' : 'bt-ativar-desativar-configuracao bt-ativar-configuracao' }>
                            <div></div>
                        </button>
                    </div>
                    <p className="descricao-configuracao">Salve os nomes de filmes, séries e pessoas pesquisadas.</p>
                </ul>
                <ul>
                    <div className="header-ul-configuracao">
                        <span className="nome-configuracao">Exibir histórico de pesquisa</span>
                        <button onClick={()=> exibirHistorico ? functionExibirHistorico('desativar') : functionExibirHistorico('ativar')} className={exibirHistorico ? 'bt-ativar-desativar-configuracao bt-desativar-configuracao' : 'bt-ativar-desativar-configuracao bt-ativar-configuracao' }>
                            <div></div>
                        </button>
                    </div>
                    <p className="descricao-configuracao">Esta opção ativa ou desativa a exibição do histórico de pesquisa.</p>
                </ul>
            </div>
        </div>
    )
}