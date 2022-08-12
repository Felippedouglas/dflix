import './style.css';

export default function PopUpNav(props) {

    return (props.popUpNav) ? (
        <div className="container-pop-up-nav">
            <div className="pop-up-nav">
                { props.children }
            </div>
        </div>
    ) : "";
}