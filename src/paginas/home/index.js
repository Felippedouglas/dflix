import "./style.css";
import PagPopularSerie from "../paginas-movie/serie";
import PagPopularFilme from "../paginas-movie/filme";
import MoviePrincipal from "./componentes/movie-principal";
import { useState } from "react";

export default function Home() {
    const [categoriaFilme, setCategoriaFilme] = useState('popular')
    const [categoriaSerie, setCategoriaSerie] = useState('popular')

    setTimeout(()=>{
        document.title = 'DFLIX'
        document.getElementById('container-home').style.display = 'block';

        if (!JSON.parse(localStorage.getItem('favoritos'))) {
            localStorage.setItem('favoritos', '[]')
        }
    }, 1)

    return (
        <div className="container-home" id="container-home">
            <MoviePrincipal/>
            <PagPopularSerie categoriaSerie={categoriaSerie} setCategoriaSerie={setCategoriaSerie}/>
            <PagPopularFilme categoriaFilme={categoriaFilme} setCategoriaFilme={setCategoriaFilme}/>
        </div>
    )
}