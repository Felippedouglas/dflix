import './style.css';
import $ from 'jquery';

export default function PopUpNav(props) {
    
    $(document).mouseup(function(e) {
        var container = $(".container-pop-up-nav");

        if (container.is(e.target) && container.has(e.target).length === 0) {
            props.setPopUpNav(false)
        }
    });

    return (props.popUpNav) ? (
        <div className="container-pop-up-nav">
            <div className="pop-up-nav">
                { props.children }
            </div>
        </div>
    ) : "";
}