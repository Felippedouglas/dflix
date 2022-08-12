import './style.css';

export default function PopUp(props) {

    return (props.popUp) ? (
        <div className="container-pop-up">
            <div className="pop-up">
                { props.children }
            </div>
        </div>
    ) : "";
}