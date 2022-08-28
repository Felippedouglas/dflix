import { useEffect, useState } from "react";
import { APIKey } from "../../../../config/key";
import PopUp from "../../../../componentes/pop-up";
import './style.css';
import { useParams } from "react-router-dom";
import ImgAvatar from '../../../../componentes/imgs/img-avatar.png'

export default function Comentarios(props) {
    
    const [ comentarios, setComentatios] = useState([]);

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/${props.filmeSerie}/${props.id}/reviews?api_key=${APIKey}&language=en-US&page=1`)
            .then(Response => Response.json())
            .then(data => {
                setComentatios(data.results);
        })
    }, [props.id]);

    const mapComentarios = comentarios.map((comentario) => {
        if(comentarios) {
            return (
                <section className="comentario">
                    <header className="header-detalhes-usuario-comentario">
                        <img loading="lazy" className="img-perfil-comentario" src={ImgAvatar} alt={comentario.author_details.username}/>
                        <h2 className="nome-autor-comentario">@{comentario.author_details.username}</h2>
                        {comentario.author_details.rating &&
                            <h3 className="avaliacao-autor-comentario"><i class="fas fa-star"></i> {Number(comentario.author_details.rating).toFixed(1)}</h3>
                        }
                    </header>
                    <main className="main-comentario">
                        <p>{comentario.content}</p>
                    </main>
                    <footer> 
                        <span>{comentario.created_at.slice(8,10)}/{comentario.created_at.slice(5,7)}/{comentario.created_at.slice(0,4)} às {comentario.created_at.slice(11,16)}</span>
                    </footer>
                </section>
            )
        }
    });

    return(
        <div className="content-comentarios">
            <h2 className="h2-comentarios h2-titulo-sections">Comentários</h2>
            {comentarios.length >= 1 &&
                <div>
                    {mapComentarios}
                </div>
            }
            {comentarios.length == 0 &&
            <section className="comentario">
                <span className="span-erro-comentários-indisponiveis">Não há comentários disponíveis!</span>
            </section>
            }
        </div>
    )
}