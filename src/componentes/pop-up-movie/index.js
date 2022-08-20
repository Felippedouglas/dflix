import './style.css';
import { useParams } from "react-router-dom";
import $ from 'jquery';

export default function PopUpMovie(props) {

    const { preview } = useParams();

    setTimeout(()=>{
        if (preview) {
            props.setPopUpMovie(true);
            setTimeout(()=>{
                document.getElementById("container-pop-up-movie").style.opacity = '1';
                setTimeout(()=>{
                    document.getElementById("pop-up-movie").style.bottom = '0';
                }, 10)
            }, 10)
        } else if (!preview) {
            props.setPopUpMovie(false);
            document.title = 'DFLIX';
        }
    
        if (preview) {
            document.getElementById("video-movie-principal").pause()
        } else if (!preview) {
            document.getElementById("video-movie-principal").play()
        }
    }, 100);

    return (props.popUpMovie) ? (
        <div className="container-pop-up-movie" id="container-pop-up-movie">
            <div className="pop-up-movie" id="pop-up-movie">
                { props.children }
            </div>
        </div>
    ) : "";
}