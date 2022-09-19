export default function Alert(props) {
    return(
        <div className={props.alert ? "alert-ativado" : "alert-desativado"}>
            {props.alertTitle &&
                <h2>{props.alertTitle}</h2>
            }
            {props.alertMessage &&
                <p>{props.alertMessage}</p>
            }
        </div>
    )
}