import "./style.css";
import PagPopularSerie from "../paginas-movie/serie";
import PagPopularFilme from "../paginas-movie/filme";
import MoviePrincipal from "./componentes/movie-principal";
import { useEffect, useState } from "react";
import PagMoviesFavoritos from "./componentes/movies-favoritos";
import { Link, useParams } from "react-router-dom";
import PagAnimes from "../paginas-movie/anime";
import Usuario from "../usuario";
import PopUp from "../../componentes/pop-up";
import ImgBackground from './componentes/background-popup.svg'
import { AppFirebase } from "../../service/firebase";
import { doc, getFirestore, setDoc } from "firebase/firestore";

export default function Home() {

    const [ user, setUser ] = useState({});

    const [ popUp, setPopUp ] = useState(false);
    const [categoriaFilme, setCategoriaFilme] = useState('popular');
    const [categoriaSerie, setCategoriaSerie] = useState('popular');
    const [filmeSerieAnime, setFilmeSerieAnime] = useState('tv');
    const [ favoritosHome, setFavoritosHome ] = useState();
    const { preview } = useParams();
    const [ economiaInternet, setEconomiaInternet ] = useState();

    useEffect(()=>{

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

        setTimeout(()=>{
            document.title = 'DFLIX'
            document.querySelector("meta[name=theme-color]").setAttribute("content", '#181818');
            
            document.getElementById('container-home').style.display = 'block';

            setFavoritosHome(localStorage.getItem('FavoritoHome'))

            setTimeout(()=> {
                document.getElementById('container-home').style.opacity = '1';
            }, 200)
            
            if (!localStorage.getItem('usuario')) {
                localStorage.setItem('FavoritoHome', true)
                localStorage.setItem('salvarHistorico', true)
                localStorage.setItem('exibirHistorico', true)
                localStorage.setItem('usuario', 'true')
            } else if (!localStorage.getItem('nomeUsuario')) {
                localStorage.setItem('nomeUsuario', 'user' + (Math.random()*1000).toFixed())
            }
    
            setEconomiaInternet(localStorage.getItem('economia'));

            function verificarUsuario() {
                var fazerLogin = sessionStorage.getItem("fazerLogin" || false);
                
                if (!user.uid) {
                    if (!fazerLogin || fazerLogin === undefined) {
                        setPopUp(true);
                    }
                } else {
                    setPopUp(false);
                }
            }

            verificarUsuario()
        }, 100)

    }, [preview, filmeSerieAnime, economiaInternet, user])

    function fecharPopUpLogin() {
        setPopUp(false);
        sessionStorage.setItem("fazerLogin", true)
    }

    return (
        <div className="container-home" id="container-home">
            <PopUp popUp={popUp} setPopUp={setPopUp}>
                <div className="pop-up-login-home">
                    <button onClick={()=>fecharPopUpLogin()} className='bt-fechar-pop-up'><i className="fa-solid fa-xmark"></i> Fechar</button>
                    <div className="content-pop-up-login-home">
                        <img src={ImgBackground}/>
                        <h2>Fazer Login</h2>
                        <p>Crie uma conta ou faça login para sincronizar seus dados do site com outros dispositivos e aproveitar todas as funcionalidades disponíveis na dflix:</p>
                        <ul>
                            <li><i className="fa-solid fa-floppy-disk"></i> Salvar filmes e séries favoritas</li>
                            <li><i className="fa-solid fa-clock-rotate-left"></i> Salvar histórico de pesquisa</li>
                            <li><i className="fa-solid fa-check"></i> Marcar filmes, temporadas e episódios de series como já assistidos (em breve!)</li>
                        </ul>
                        <footer>
                            <Link className="link-cadastrar" to='/login'><i className="fa-solid fa-right-from-bracket"></i> Entrar</Link>
                            <Link to='/login/cadastrar'><i className="fa-solid fa-envelope"></i> Cadastrar-se</Link>
                        </footer>
                    </div>
                </div>
            </PopUp>
            <Usuario setUser={setUser}/>
            <MoviePrincipal/>
            <PagPopularSerie categoriaSerie={categoriaSerie} setCategoriaSerie={setCategoriaSerie}/>
            {favoritosHome && user &&
                <PagMoviesFavoritos categoriaSerie={categoriaSerie} setCategoriaSerie={setCategoriaSerie}/>
            }
            <PagPopularFilme categoriaFilme={categoriaFilme} setCategoriaFilme={setCategoriaFilme}/>
            {!economiaInternet &&
                <>
                    <PagAnimes filmeSerieAnime={filmeSerieAnime} setFilmeSerieAnime={setFilmeSerieAnime}/>
                </>
            }
        </div>
    )
}