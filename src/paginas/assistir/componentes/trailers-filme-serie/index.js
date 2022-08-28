import { useEffect, useState } from "react";
import { APIKey } from "../../../../config/key";
import './style.css';


//swiper slide
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode } from "swiper";

export default function VideosFilmeSerie(props) {
    
    const [ videosFilmesSerie , setVideosFilmesSerie ] = useState([])
    
    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/${props.filmeSerie}/${props.id}/videos?api_key=${APIKey}&language=pt-BR`)
            .then(Response => Response.json())
            .then(data => {
                setVideosFilmesSerie(data.results)
        })
    }, [props.id])

    const mapVideosFilmesSerie = videosFilmesSerie.map((videoFilmesSerie)=> {
        return (
            <SwiperSlide>
                <section className="div-trailer-movie" title={videoFilmesSerie.name}>
                    <iframe src={`https://www.youtube.com/embed/${videoFilmesSerie.key}`} allowfullscreen="allowfullscreen" frameBorder="0"></iframe>
                    <span className="span-titulo-trailer">{videoFilmesSerie.name}</span>
                </section>
            </SwiperSlide>
        )
    })

    return (
        <div className="content-trailers">
            <h2 className="h2-trailers h2-titulo-sections" id="trailers">Trailers</h2>
            <div className="div-trailers-movie">
                {videosFilmesSerie.length != 0 &&
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
                        {mapVideosFilmesSerie}
                    </Swiper>
                }
                {videosFilmesSerie.length == 0 &&
                    <span>Não há trailers disponíveis!</span>
                }
            </div>
        </div>
    )
}