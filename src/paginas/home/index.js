import "./style.css";
import PagPopularSerie from "../paginas-movie/serie";
import PagPopularFilme from "../paginas-movie/filme";
import MoviePrincipal from "./componentes/movie-principal";
import { useEffect, useState } from "react";
import PagMoviesFavoritos from "./componentes/movies-favoritos";
import { useParams } from "react-router-dom";

export default function Home() {

    const [categoriaFilme, setCategoriaFilme] = useState('popular')
    const [categoriaSerie, setCategoriaSerie] = useState('popular')
    const [ favoritos, setFavoritos ] = useState([]);
    const [ favoritosHome, setFavoritosHome ] = useState();
    const { preview } = useParams();

    useEffect(()=>{
        setTimeout(()=>{
            document.title = 'DFLIX'
            document.getElementById('container-home').style.display = 'block';
            
            if (!JSON.parse(localStorage.getItem('favoritos'))) {
                localStorage.setItem('favoritos', '[]')
            }

            setFavoritosHome(localStorage.getItem('FavoritoHome'))
            
            const favoritosLocalStorage = JSON.parse(localStorage.getItem('favoritos') || "[]");
            setFavoritos(favoritosLocalStorage);

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

        }, 100)

    }, [preview])


    return (
        <div className="container-home" id="container-home">
            <MoviePrincipal/>
            <PagPopularSerie categoriaSerie={categoriaSerie} setCategoriaSerie={setCategoriaSerie}/>
            {favoritos.length >= 1 && favoritosHome &&
                <PagMoviesFavoritos categoriaSerie={categoriaSerie} setCategoriaSerie={setCategoriaSerie}/>
            }
            <PagPopularFilme categoriaFilme={categoriaFilme} setCategoriaFilme={setCategoriaFilme}/>
        </div>
    )
}