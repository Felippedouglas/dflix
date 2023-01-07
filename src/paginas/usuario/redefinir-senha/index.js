import { useEffect, useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import ImgBackground from '../../../componentes/imgs/background-redefinir-senha.svg'
import './style.css';
import { Link } from "react-router-dom";
import Usuario from "..";
import { BackgroundCoontainerLogin, ContainerLogin } from "../login/style";

export default function RedefinirSenha() {

    const [ darkMode, setDarkMode ] = useState(false);
    const [ user, setUser ] = useState({});

    const [ email, setEmail ] = useState();
    const [ emailEnviado, setEmailEnviado ] = useState(false);
    const [ msgErro, setMsgErro ] = useState();

    useEffect(()=>{

        document.querySelector("meta[name=theme-color]").setAttribute("content", darkMode ? '#181818' : '#fff');
        
        if (user.uid) {
            window.location.href = '/#/conta';
        }

        window.scrollTo(0, 0);

    }, [user])
    
    const redefinirSenha = async () => {

        const condicao = /\S+@\S+\.\S+/;

        if (email && condicao.test(email)) {
            const auth = getAuth();
            sendPasswordResetEmail(auth, email).then(() => {
                setEmailEnviado(true);
            }).catch(() => {

                setMsgErro('O email digitado não está cadastrado na dflix!');

                setTimeout(()=> {
                    setMsgErro()
                }, 5000)
            })
        } else if (email && !condicao.test(email)) {
            setMsgErro('Formato de email inválido');

            setTimeout(()=> {
                setMsgErro()
            }, 5000)
        } else {
            setMsgErro('Preencha seu email');

            setTimeout(()=> {
                setMsgErro()
            }, 5000)
        }
    }

    return (
        <BackgroundCoontainerLogin darkMode={darkMode}>

            <nav className='nav-logo-dark-mode'>
                <Link className='logo-dflix-login' to='/'><img src='https://dflix.netlify.app/icones/dflix.svg'/></Link>
                <button onClick={()=>setDarkMode(!darkMode)}>{darkMode ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}</button>
            </nav>

            <Usuario setUser={setUser}/>

            <ContainerLogin darkMode={darkMode}>
                <aside className="aside-img">
                    <img src={ImgBackground}/>
                </aside>

                {!emailEnviado &&
                    <div className='div-redefinir-senha'>
                        <h2>Redefinir Senha</h2>
                        <form action='' method='' className='form-login-cadastrar'>
                            <fieldset>
                                <legend>Email</legend>
                                <input required type='email' placeholder='email@exemplo.com' onChange={(e)=>setEmail(e.target.value)}/>
                            </fieldset>
                        </form>
                        <button onClick={redefinirSenha} className="bt-login-cadastrar"><i className="fa-solid fa-paper-plane"></i> Enviar email</button>
                        {msgErro &&
                            <span className='span-erro-login'>{msgErro}</span>
                        }
                        <span className="msg-sobre-redefinir-senha">Um email com um link para redefinir sua senha será enviado para seu email</span>
                    </div>
                }

                {emailEnviado && email &&
                    <div className="email-redefinir-enviado div-login">
                        <h2><i className="fa-solid fa-paper-plane"></i> Email Enviado!</h2>
                        <p>Um email de redefinição de senha foi enviado para <strong>{email}</strong>. Dentro de alguns minutos verifique seu email e click no link para redefir sua senha.</p>
                        <Link to='/' className="link-home-email-enviado"><i className="fa-solid fa-house-crack"></i> Ir p/ inicio</Link>
                    </div>
                }
                {emailEnviado &&
                    <div className="email-redefinir-enviado div-login">
                        <h2><i className="fa-solid fa-circle-info"></i> Erro!</h2>
                        <Link to='/' className="link-home-email-enviado"><i className="fa-solid fa-house-crack"></i> Ir p/ inicio</Link>
                    </div>
                }
            </ContainerLogin>
        </BackgroundCoontainerLogin>
    )
}