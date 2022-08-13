import './style.css';
import ImgWarez from '../imgs/logo-warez-cdn.png';
import ImgTmdb from '../imgs/logo-tmdb.svg';
import $ from 'jquery';

export default function Footer() {

    $(window).on('scroll', function() {
        if ($(window).scrollTop() >= 1) {
            document.getElementById('footer').style.display = 'block';
        } else if ($(window).scrollTop() == 0){
            document.getElementById('footer').style.display = 'none';
        }
    })

    return(
        <footer class="footer" id='footer'>
            <div class="div-creditos-apis">
                <a href="https://www.themoviedb.org/" target="_blank">
                    <img src={ImgTmdb} alt="tmdb"/>
                </a>
                <a href="https://warezcdn.net/" target="_blank">
                    <img src={ImgWarez} alt="warez cdn"/>
                </a>
            </div>
            <div class="div-creditos-felippe-footer">
                <section>
                    <span class="span-felippe">© Felippe douglas - 2022</span>
                </section>
                <section class="section-links-redes-sociais-footer">
                    <a href="https://github.com/Felippedouglas" target="_blank">
                        <button><i class="fa-brands fa-github"></i></button>
                    </a>
                    <a href="https://www.linkedin.com/in/felippe-douglas-01956321b/" target="_blank">
                        <button><i class="fa-brands fa-linkedin"></i></button>
                    </a>
                    <a href="https://www.felippedouglas.tech" target="_blank">
                        <button><i class="fa-solid fa-user"></i></button>
                    </a>
                </section>
            </div>
        </footer>
    )
}