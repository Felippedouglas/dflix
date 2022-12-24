import Tippy from '@tippyjs/react';
import { useEffect, useState } from 'react';
import 'tippy.js/dist/tippy.css';
import copy from "copy-to-clipboard";
import Alert from '../../../../componentes/alert';
import './style.css';

export default function Compartilhar() {

    const [ alert, setAlert ] = useState(false);
    const [ alertTitle, setAlertTitle ] = useState();
    const [ alertMessage, setAlertMessage ] = useState();
    const [copyText, setCopyText] = useState(document.location.href);

    const [ idioma, setIdioma ] = useState();

    useEffect(()=>{
        var idioma = localStorage.getItem('idioma') || 'portugues';
        setIdioma(idioma);
    })
    
    const copyToClipboard = () => {
       copy(copyText);
       if (!alert) {
           setAlert(true)
           setTimeout(()=>{
               setAlert(false)
           }, 5000)
       }
       setAlertTitle(idioma == 'portugues' ? 'Link copiado' : 'Link copied')
       setAlertMessage(idioma == 'portugues' ? 'Link copiado para área de transferência!' : 'Link copied to clipboard!');
    }
    
    function redirecionar(e) {

        setTimeout(()=>{
            window.open(e, '_blank');
        }, 2000)

        if (!alert) {
            setAlert(true)
            setTimeout(()=>{
                setAlert(false)
            }, 5000)
        }
        setAlertTitle(idioma == 'portugues' ? 'Compartilhar' : 'Share');
        setAlertMessage(idioma == 'portugues' ? 'Você será redirecionado para uma nova página!' : 'You will be redirected to a new page!');
    }

    return (
        
        <div className='content-compartilhar-assistir'>
            
            <Alert alert={alert} alertTitle={alertTitle} alertMessage={alertMessage}/>

            <div className='content-compartilhar-assisitr-redes-sociais'>
                <Tippy content={idioma == 'portugues' ? 'Copiar Link' : 'Copy Link'}>
                    <section>
                        <a onClick={copyToClipboard}><i className="fa-solid fa-link"></i></a>
                    </section>
                </Tippy>
                <Tippy content={idioma == 'portugues' ? 'Compartilhar no WhatsApp' : 'Share on WhatsApp'}>
                    <section>
                        <a onClick={()=>redirecionar(`https://api.whatsapp.com/send?text="${copyText}"`)} target='_blank'><i className="fa-brands fa-whatsapp"></i></a>
                    </section>
                </Tippy>
                <Tippy content={idioma == 'portugues' ? 'Compartilhar no Facebook' : 'Share on Facebook'}>
                    <section>
                        <a onClick={()=>redirecionar(`https://www.facebook.com/sharer/sharer.php?u="${copyText}"`)}><i className="fa-brands fa-facebook-f"></i></a>
                    </section>
                </Tippy>
            </div>
        </div>
    )
}