
import { useEffect, useState } from 'react';
import { firebase, auth } from '../../../service/firebase';
import ImgBackground from '../../../componentes/imgs/background-people.svg'
import Usuario from '..';
import { updateProfile } from 'firebase/auth';
import LogoGoogle from '../../../componentes/imgs/logo-google.png';
import { BackgroundCoontainerLogin, ContainerLogin } from './style';
import { Link, useParams } from 'react-router-dom';

export default function Login() {

    const [ user, setUser ] = useState({});

    const [ darkMode, setDarkMode ] = useState();
    const [ nome, setNome ] = useState();
    const [ email, setEmail ] = useState();
    const [ senha, setSenha ] = useState();
    const [ msgErro, setMsgErro ] = useState();
    const [ logincadastrar, setLogincadastrar ] = useState('');
    const { cadastrar } = useParams();

    useEffect(()=> {

        if (user.uid) {
            window.location.href = '/';
        }

        if (cadastrar === 'cadastrar') {
            setLogincadastrar('cadastrar')
        }

        window.title = 'Login - DFLIX';
        document.querySelector("meta[name=theme-color]").setAttribute("content", darkMode ? '#181818' : '#fff');

        window.scrollTo(0, 0);

    }, [user, cadastrar])

    const condicao = /\S+@\S+\.\S+/;

    const loginGoogle = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
    }

    const loginEmail = async () => {

        if (email && senha) {
            if (condicao.test(email)) {
                await firebase.auth().signInWithEmailAndPassword(email, senha).then(()=> {
                }).catch(() =>{
                    setMsgErro('Email ou senha incorreta!');
                })
            } else {
                setMsgErro('Formato de email inválido');
            }
        } else if (!email) {
            setMsgErro('Preencha o campo email');

        } else if (!senha) {
            setMsgErro('Preencha o campo senha');

        }
        
        setTimeout(()=> {
            setMsgErro();
        }, 5000)
    }

    const cadastrarUsuario = async () => {

        if (nome && email && senha) {
            if (condicao.test(email) && nome.length >= 6 && senha.length >= 6) {
                await firebase.auth().createUserWithEmailAndPassword(email, senha).then(()=> {
                    updateProfile(auth.currentUser, { displayName: nome})
                }).catch(() =>{
                    setMsgErro('Email já cadastrado!');
                })
            } else if (nome.length < 6) {
                setMsgErro('O nome deve conter no mínimo 6 caracteres');
            } else if (senha.length < 6) {
                setMsgErro('A senha deve conter no mínimo 6 caracteres');
            } else {
                setMsgErro('Verifique o email digitado!');
            }

            setTimeout(()=> {
                setMsgErro();
            }, 5000)

        } else {

            if (!nome || !email || !senha) {
                if (!nome) {
                    setMsgErro('Preencha o campo nome!');
                } else if (!email) {
                    setMsgErro('Preencha o campo email!');
                } else if (!senha) {
                    setMsgErro('Preencha o campo senha!');
                }
    
                setTimeout(()=> {
                    setMsgErro();
                }, 5000)
            }

        }
    }

    return (
        <BackgroundCoontainerLogin darkMode={darkMode}>
            <nav className='nav-logo-dark-mode'>
                <Link className='logo-dflix-login' to='/'><img src='https://dflix.netlify.app/icones/dflix.svg'/></Link>
                <button onClick={()=>setDarkMode(!darkMode)}>{darkMode ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}</button>
            </nav>
            <ContainerLogin darkMode={darkMode}>

                <aside className='aside-background-login'>
                    <img src={ImgBackground}/>
                </aside>

                <Usuario setUser={setUser}/>
                {logincadastrar == '' &&
                    <div className='div-login'>
                        <h2>Fazer login</h2>
                        <form action='' method='' className='form-login-cadastrar'>
                            <fieldset>
                                <legend>Email</legend>
                                <input required type='email' placeholder='email@exemplo.com' onChange={(e)=>setEmail(e.target.value)}/>
                            </fieldset>
                            <fieldset>
                                <legend>Senha</legend>
                                <input required type='text' placeholder='************' onChange={(e)=>setSenha(e.target.value)}/>
                            </fieldset>
                            <button onClick={()=>window.location.href = '/?#/redefinir-senha'} className="bt-redefinir-senha">Esqueceu a senha?</button>
                        </form>
                        <button onClick={loginEmail} className="bt-login-cadastrar"><i className="fa-solid fa-right-from-bracket"></i> Entrar</button>
                        {msgErro &&
                            <span className='span-erro-login'>{msgErro}</span>
                        }
                        <div className='div-login-alternativo'>
                            <span className='span-ou'>ou</span>
                            {/*<button className='google'  onClick={loginGoogle}><img src={LogoGoogle}/> Login com Google</button>*/}
                            <span className='span-link-login-cadastrar'>Não tem uma conta? <button onClick={()=>setLogincadastrar('cadastrar')}>Cadastrar-se</button></span>
                        </div>
                    </div>
                }
                {logincadastrar == 'cadastrar' &&
                    <div className='div-cadastrar'>
                        <h2>Cadastrar-se</h2>
                        <form action='' method='' className='form-login-cadastrar'>
                            <fieldset>
                                <legend>Nome</legend>
                                <input required type='text' maxLength={15} onChange={(e)=>setNome(e.target.value)}/>
                            </fieldset>
                            <fieldset>
                                <legend>Email</legend>
                                <input required type='email' onChange={(e)=>setEmail(e.target.value)}/>
                            </fieldset>
                            <fieldset>
                                <legend>Senha</legend>
                                <input required type='text' onChange={(e)=>setSenha(e.target.value)}/>
                            </fieldset>
                        </form>
                        <button onClick={cadastrarUsuario} className="bt-login-cadastrar">Cadastra-se</button>
                        {msgErro &&
                            <span className='span-erro-login'>{msgErro}</span>
                        }
                        <div className='div-login-alternativo'>
                            <span className='span-ou'>ou</span>
                            {/*<button className='google' onClick={loginGoogle}><img src={LogoGoogle}/>Login com Google</button>*/}
                            <span className='span-link-login-cadastrar'>Já tem uma conta? <button onClick={()=>setLogincadastrar('')}>Fazer login</button></span>
                        </div>
                    </div>
                }
            </ContainerLogin>
        </BackgroundCoontainerLogin>
    )

}