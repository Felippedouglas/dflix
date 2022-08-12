import { useEffect, useState } from "react"
import { APIKey } from "../../../../config/key"
import './style.css'

export default function VideosFilmeSerie(props) {
    
    const [ videosFilmesSerie , setVideosFilmesSerie ] = useState([])
    
    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/${props.filmeSerie}/${props.id}/videos?api_key=${APIKey}&language=pt-BR`)
            .then(Response => Response.json())
            .then(data => {
                setVideosFilmesSerie(data.results)
        })
    }, [])

    const mapVideosFilmesSerie = videosFilmesSerie.map((videoFilmesSerie)=> {
        return (
            <section className="div-trailer-movie" title={videoFilmesSerie.name}>
                <iframe src={`https://www.youtube.com/embed/${videoFilmesSerie.key}`} allowfullscreen="allowfullscreen" frameBorder="0"></iframe>
                <span className="span-titulo-trailer">{videoFilmesSerie.name}</span>
            </section>
        )
    })

    return (
        <div className="content-trailers">
            <h2 className="h2-trailers h2-titulo-sections" id="trailers">Trailers</h2>
            <div className="div-trailers-movie">
                {mapVideosFilmesSerie}
                {videosFilmesSerie.length == 0 &&
                    <span>Não há trailers disponíveis!</span>
                }
            </div>
        </div>
    )
}