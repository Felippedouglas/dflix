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

    
    const copyToClipboard = () => {
       copy(copyText);
       if (!alert) {
           setAlert(true)
           setTimeout(()=>{
               setAlert(false)
           }, 5000)
       }
       setAlertTitle('Link copiado')
       setAlertMessage('Link copiado para área de transferência!');
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
        setAlertTitle('Compartilhar');
        setAlertMessage(`Você será redirecionado para uma nova página!`);
    }

    return (
        
        <div className='content-compartilhar-assistir'>
            
            <Alert alert={alert} alertTitle={alertTitle} alertMessage={alertMessage}/>

            <div className='content-compartilhar-assisitr-redes-sociais'>
                <Tippy content='Copiar Link'>
                    <section>
                        <a onClick={copyToClipboard}><i class="fa-solid fa-link"></i></a>
                    </section>
                </Tippy>
                <Tippy content='Compartilhar no WhatsApp'>
                    <section>
                        <a onClick={()=>redirecionar(`https://api.whatsapp.com/send?text=${window.location.href}`)} target='_blank'><i class="fa-brands fa-whatsapp"></i></a>
                    </section>
                </Tippy>
                <Tippy content='Compartilhar no Facebook'>
                    <section>
                        <a onClick={()=>redirecionar(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`)}><i class="fa-brands fa-facebook-f"></i></a>
                    </section>
                </Tippy>
            </div>
        </div>
    )
}