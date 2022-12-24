import './style.css';
import ImgWarez from '../imgs/logo-warez-cdn.png';
import ImgTmdb from '../imgs/logo-tmdb.svg';
import $ from 'jquery';
import { useEffect, useState } from 'react';

export default function Footer() {

    const [ idioma, setIdioma ] = useState();

    useEffect(()=>{
    }, [idioma])
    
    $(window).on('scroll', function() {
        if ($(window).scrollTop() >= 1) {
            document.getElementById('footer').style.display = 'block';
        } else if ($(window).scrollTop() == 0){
            document.getElementById('footer').style.display = 'none';
        }
        
        setIdioma(localStorage.getItem('idioma') || 'portugues')
    })

    return(
        <footer className="footer" id='footer'>
            <div className="div-creditos-apis">
                <a href="https://www.themoviedb.org/" target="_blank">
                    <img src={ImgTmdb} alt="tmdb"/>
                </a>
                <a href="https://warezcdn.net/" target="_blank">
                    <img src={ImgWarez} alt="warez cdn"/>
                </a>
            </div>
            <div className="div-creditos-felippe-footer">
                <section>
                    <span className="span-felippe">© {idioma == 'portugues' ? 'Desenvolvido por' : 'Developed by'} <strong>Felippe douglas</strong></span>
                </section>
                <section className="section-links-redes-sociais-footer">
                    <a href="https://github.com/Felippedouglas" target="_blank">
                        <button><i className="fa-brands fa-github"></i></button>
                    </a>
                    <a href="https://www.linkedin.com/in/felippe-douglas-01956321b/" target="_blank">
                        <button><i className="fa-brands fa-linkedin"></i></button>
                    </a>
                    <a href="https://www.felippedouglas.tech" target="_blank">
                        <button><i className="fa-solid fa-user"></i></button>
                    </a>
                </section>
            </div>
            <div  className='div-dflix-indexa'>
                <span>O site DFLIX indexa conteúdo encontrado na web por meio de api's, não hospedamos os conteúdos em nosso domínio.</span>
            </div>
        </footer>
    )
}