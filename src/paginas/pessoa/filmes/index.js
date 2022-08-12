import { React, useEffect, useState } from "react"
import { APIKey } from "../../../config/key"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom";
import '../filme-serie-pessoa-style.css'

export default function PessoaFilmeParticipado(props) {

    const image_path = 'https://image.tmdb.org/t/p/w500'
    const { idPessoa } = useParams()
    const [filmesParticipados, setFilmesParticipados] = useState([])

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/person/${idPessoa}/movie_credits?api_key=${APIKey}&language=pt-BR`)
        .then(Response => Response.json())
        .then(data => {
            setFilmesParticipados(data)
            console.log(data)
            })
    }, [idPessoa])

    return(
        <>
            <h2 className="h2-movies-pessoa">Filmes com {props.nomePessoa}</h2>
            <div className="div-movie-pessoa">
                {filmesParticipados.cast &&
                    filmesParticipados.cast.map(filmeParticipado => {
                        return (
                        <>
                            {filmeParticipado.vote_average != 0 &&
                                <div className="movie" key={filmeParticipado.id}>
                                    <Link to={`/assistir=movie&${filmeParticipado.id}`}>
                                        <img loading="lazy" src={`${image_path}${filmeParticipado.poster_path}`} alt={filmeParticipado.title} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-erro-exclamacao.png";}}/>
                                        <section className="section-informacoes-movie">
                                            <div class="div-avaliacao-movie">
                                                <span class="span-estrela-movie">
                                                    <i class="fas fa-star"></i>
                                                </span>
                                                <span>{filmeParticipado.vote_average.toFixed(1)} </span>
                                            </div>
                                            {filmeParticipado.release_date &&
                                                <span>{filmeParticipado.release_date.slice(0,4)}</span>
                                            }
                                        </section>
                                    </Link>
                                    <span className="span-titulo-movie">{filmeParticipado.title}</span>
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