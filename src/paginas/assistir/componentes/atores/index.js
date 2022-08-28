import { useEffect, useState } from 'react';
import PopUp from '../../../../componentes/pop-up';
import { APIKey } from '../../../../config/key';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import './style.css';
import { useParams } from 'react-router-dom';


//swiper slide
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode } from "swiper";

export default function Atores(props) {

    const [ atores, setAtores ] = useState([]);
    const image_path = 'https://image.tmdb.org/t/p/w500';
    const [ popUp, setPopUp ] = useState(false);
    const {  filmeSerie, id, popUpAtores, preview } = useParams();
    
    useEffect(() => {
        if (props.filmeSerie == 'movie') {
            fetch(`https://api.themoviedb.org/3/movie/${props.id}/credits?api_key=${APIKey}&language=pt-BR`)
            .then(Response => Response.json())
            .then(data => {
                setAtores(data.cast);
                })
    
                if (popUpAtores == '=true') {
                    setPopUp(!popUp);
            }
        }
        
        else if (props.filmeSerie == 'tv') {
            setTimeout(()=>{
                fetch(`https://api.themoviedb.org/3/tv/${props.id}/season/${props.totalTemporadas}/credits?api_key=${APIKey}&language=pt-BR`)
                .then(Response => Response.json())
                .then(data => {
                    setAtores(data.cast);
                    })
        
                    if (popUpAtores == '=true') {
                        setPopUp(!popUp);
                }
            }, 10)
        }
    }, [props.id, props.totalTemporadas]);

    function redirecionar(idAtor) {
        window.location.href = `/#/pessoa=${idAtor}/bg=${filmeSerie}`;
        document.body.style.overflow = 'auto'
    }
    
    function abrirElenco() {
        setPopUp(!popUp);
        window.location.href = `/#/elenco=true/${filmeSerie}&${id}`;
        document.body.style.overflow = 'hidden';
    }
    
    function fecharElenco() {
        setPopUp(!popUp);
        window.location.href = `/#/assistir=${filmeSerie}&${id}`;
        document.body.style.overflow = 'auto';
    }

    return (
        <>
            <div className='div-atores' id='div-atores'>
                <Swiper
                    slidesPerView={'auto'}
                    spaceBetween={10}
                    freeMode={false}
                    pagination={{
                    clickable: true,
                    }}
                    modules={[FreeMode]}
                    className="mySwiper"
                    id="swiper-slide"
                >
                    {atores.map(ator =>{
                        return(
                            <SwiperSlide>
                                <Tippy content='Detalhes'>
                                    <section className='ator' onClick={()=>redirecionar(ator.id)}>
                                        <img loading="lazy" src={`${image_path}${ator.profile_path}`} alt={ator.name} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src='https://dflix.netlify.app/imagens/img-avatar.png';}}/>
                                        <section className='section-nome-ator-personagem'>
                                            <span className='nome-ator'>{ator.original_name}</span>
                                            <span className='nome-personagem'>{ator.character}</span>
                                        </section>
                                    </section>
                                </Tippy>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
                {!preview &&
                    <span className='span-abrir-popup-atores' onClick={()=>abrirElenco()}><i class="fas fa-plus-circle"></i></span>
                }
                
            </div>
            
            <PopUp popUp={popUp} setPopUp={setPopUp}>

                <h2 className='h2-titulo-popup'>
                    <span>Elenco</span>
                    <button className='bt-fechar-popup' onClick={()=>fecharElenco()}><i class="fa-solid fa-xmark"></i></button>
                </h2>
                {atores.map(ator =>{
                    if (ator) {
                        return (
                            <section className='ator ator-pop-up' onClick={()=>redirecionar(ator.id)}>
                                <img loading="lazy" src={`${image_path}${ator.profile_path}`} alt={ator.name}  onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src='https://dflix.netlify.app/imagens/img-avatar.png';}}/>
                                <section className='section-nome-ator-personagem'>
                                    <span className='nome-ator'>{ator.original_name}</span>
                                    <span className='nome-personagem'>{ator.character}</span>
                                </section>
                                <span className='seta-hover-pop-up-atores'><i class="fas fa-angle-right"></i></span>
                            </section>
                        )
                    }
                })}
                
            </PopUp>

        </>
    )
}