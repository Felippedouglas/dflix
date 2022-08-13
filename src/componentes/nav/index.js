import { Link } from "react-router-dom"
import './style.css';
import $ from 'jquery';
import { useState } from "react";
import PopUpNav from "./components/pop-up-nav";


export default function Nav() {

    const [ popUpNav, setPopUpNav ] = useState(false);

    $(window).on('scroll', function() {
        if ($(window).scrollTop() >= 1) {
            document.getElementById('content-nav').style.background = '#000';
        } else if ($(window).scrollTop() == 0){
            document.getElementById('content-nav').style.background = 'initial';
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

    return(

        <div className='content-nav' id="content-nav">
            <section className='section-img-list-nav'>
                <Link to="/"><img className="logo-dflix" src="https://dflix.netlify.app/icones/dflix.svg" alt="logo-dflix" /></Link>
                <div className="div-links-nav">
                    <ul>
                        <Link to='/'>Início</Link>
                        <Link to='/tv/genero=10759/Action & Adventure&infantil=false&pagina=1'>Séries</Link>
                        <Link to='/movie/genero=28/ação&infantil=false&pagina=1'>Filmes</Link>
                        <Link to='/tv/genero=10762/kids&infantil=true&pagina=1'>Infantil</Link>
                        <Link to={`/favoritos/`} className='icone-favoritos-pesquisar'>Favoritos</Link>
                    </ul>
                </div>
            </section>
            <section className="section-lupa-menu-mobile">
                <Link to={`/pesquisar/`} className='icone-lupa-pesquisar'><i className="fas fa-search"></i></Link>
                <div className='div-abrir-pop-up-nav' onClick={()=>abrirNav()}>
                    <i class="fa-solid fa-bars"></i>
                </div>
            </section>

            <PopUpNav popUpNav={popUpNav} setPopUpNav={setPopUpNav}>
                <div className='div-fechar-pop-up-nav' onClick={()=>fecharNav()}>
                    <span><i class="fa-solid fa-bars"></i> Menu</span>
                </div>
                <div className="div-menu-hamburguer-mobile">
                    <ul className="ul-menu-hamburguer-nav-mobile">
                        <Link to='/' onClick={()=>fecharNav()}><i class="fa-solid fa-house-crack"></i> Início</Link>
                        <Link to='/tv/genero=10759/Action & Adventure&infantil=false&pagina=1' onClick={()=>fecharNav()}><i class="fa-solid fa-tv"></i> Séries</Link>
                        <Link to='/movie/genero=28/ação&infantil=false&pagina=1' onClick={()=>fecharNav()}><i class="fa-solid fa-clapperboard"></i> Filmes</Link>
                        <Link to='/tv/genero=10762/kids&infantil=true&pagina=1' onClick={()=>fecharNav()}><i class="fa-solid fa-child-reaching"></i> Infantil</Link>
                        <Link to='/favoritos' onClick={()=>fecharNav()}><i className="fa-solid fa-heart"></i> Favoritos</Link>
                    </ul>
                </div>
            </PopUpNav>
        </div>
    )
}