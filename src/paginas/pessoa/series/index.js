import { React, useEffect, useState } from "react"
import { APIKey } from "../../../config/key"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom";
import '../filme-serie-pessoa-style.css'

export default function PessoaSerieParticipado(props) {

    const image_path = 'https://image.tmdb.org/t/p/w500'
    const { idPessoa } = useParams()
    const [seriesParticipados, setSeriesParticipados] = useState([])

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/person/${idPessoa}/tv_credits?api_key=${APIKey}&language=pt-BR`)
        .then(Response => Response.json())
        .then(data => {
            setSeriesParticipados(data)
            })
    }, [idPessoa])

    return (
        <>
            <h2 className="h2-movies-pessoa">Séries  com {props.nomePessoa}</h2>
            <div className="div-movie-pessoa">
            {seriesParticipados.cast &&
                seriesParticipados.cast.map(serieParticipado => {
                    return (
                        <>
                            {serieParticipado.vote_average != 0 &&
                                <div className="movie" key={serieParticipado.id}>
                                    <Link to={`/assistir=tv&${serieParticipado.id}`}>
                                        <img loading="lazy" src={`${image_path}${serieParticipado.poster_path}`} alt={serieParticipado.title} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-erro-exclamacao.png";}}/>
                                        <section className="section-informacoes-movie">
                                            <div class="div-avaliacao-movie">
                                                <span class="span-estrela-movie">
                                                    <i class="fas fa-star"></i>
                                                </span>
                                                <span>{serieParticipado.vote_average.toFixed(1)} </span>
                                            </div>
                                            {serieParticipado.first_air_date &&
                                                <span>{serieParticipado.first_air_date.slice(0,4)}</span>
                                            }
                                        </section>
                                    </Link>
                                    <span className="span-titulo-movie">{serieParticipado.name}</span>
                                </div>
                            }
                        </>
                    )
                })
            }
            </div>
        </>
    )
}