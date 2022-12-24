import { useEffect, useState } from 'react'
import { APIKey } from '../../../../config/key';
import Atores from '../atores';
import './style.css';

export default function DetalhesTemporada(props) {
    
    const image_path = 'https://image.tmdb.org/t/p/w200';
    const [ detalhesTemporada, setDetalhesTemporada ] = useState({});
    const [ imgTemporada, setImgTemporada ] = useState();
    const [ temporada, setTemporada ] = useState(props.temporada);

    const [ idioma, setIdioma ] = useState();

    useEffect(()=> {

        var idioma = localStorage.getItem('idioma') || 'portugues';
        setIdioma(idioma);

        setTimeout(()=>{
            if (props.detalhesTemporada) {
                fetch(`https://api.themoviedb.org/3/tv/${props.id}/season/${temporada}?api_key=${APIKey}&language=${idioma == 'portugues' ? 'pt-BR' : 'en-US'}`)
                .then(Response => Response.json())
                    .then(data => {
                        setDetalhesTemporada(data)
                        setImgTemporada(data.poster_path)
                    });
            }
        })

    }, [temporada])
    
    return (
        <div className='container-detalhes-temporada'>
            <div className='div-background-detalhes-temporada'>
                <section className='section-background-detalhes-temporada' style={{backgroundImage: `url(${image_path}${detalhesTemporada.poster_path})`}}></section>
                <div className='content-detalhes-temporada'>
                    <button className='bt-fechar-popup-movie bt-fechar-detalhes-temporada' onClick={()=>props.setDetalhesTemporada(false)}><i className='fa-solid fa-xmark'></i></button>
                    <div className='div-img-titulo-serie-detalhes-temporada'>
                        <section className='section-img-detalhes-temporada'>
                            <img loading="lazy" src={imgTemporada != undefined ? `${image_path}${imgTemporada}` : ''} alt={props.titulo} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src='https://dflix.netlify.app/imagens/img-erro-exclamacao.png';}}/>                        </section>
                        <section className='section-sobre-temporada-detalhes'>
                            <header className='header-detalhes-temporada'>
                                {temporada > 1 &&
                                    <button onClick={()=>setTemporada(temporada - 1)}><i className='fas fa-angle-left'></i></button>
                                }
                                <h2 className='h2-numero-temporada'>{idioma == 'portugues' ? 'Temporada' : 'Season'} {temporada}</h2>
                                {temporada < props.totalTemporadas &&
                                    <button onClick={()=>setTemporada(temporada + 1)}><i className='fas fa-angle-right'></i></button>
                                }
                            </header>
                            <h2>{props.titulo}</h2>
                            <div className='div-sobre-temporada'>
                                {detalhesTemporada.air_date &&
                                    <span>{detalhesTemporada.air_date.slice(0,4)}</span>
                                }
                                {detalhesTemporada.episodes &&
                                    <span>{detalhesTemporada.episodes.length} {idioma == 'portugues' ? 'Episódios' : 'Episodes'}</span>
                                }
                                {props.classificacaoIndicativa &&
                                    <span className={`span-classificacao-indicativa span-classificacao-indicativa-${props.classificacaoIndicativa}`}  title={(props.classificacaoIndicativa == 10) || (props.classificacaoIndicativa == 12) || (props.classificacaoIndicativa == 14) || (props.classificacaoIndicativa == 16) || (props.classificacaoIndicativa == 18) ? `Classificação indicativa: ${props.classificacaoIndicativa} Anos` : `Classificação indicativa: Livre`}>{props.classificacaoIndicativa}</span>
                                }
                            </div>
                            {props.idImdb &&
                                <div className="div-logo-imdb div-logo-imdb-detalhes-temporada">
                                    <i className="fa-brands fa-imdb"></i>
                                    <span>{props.idImdb}</span>
                                </div>
                            }
                            <p className='p-sobre-temporada-serie'>{detalhesTemporada.overview ? detalhesTemporada.overview : props.descricao}</p>
                        </section>
                    </div>
                    <Atores id={props.id} filmeSerie='tv' totalTemporadas={temporada}/>
                </div>
            </div>
        </div>
    )
}