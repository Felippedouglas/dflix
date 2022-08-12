import Tippy from '@tippyjs/react';
import { useState } from 'react';
import 'tippy.js/dist/tippy.css';
import copy from "copy-to-clipboard";
import './style.css';

export default function Compartilhar() {


    const [copyText, setCopyText] = useState(document.location.href);
    
    const copyToClipboard = () => {
       copy(copyText);
       alert(`Copiado para área de transferência "${copyText}"`);
    }

    return (
        
        <div className='content-compartilhar-assistir'>
            <div className='content-compartilhar-assisitr-redes-sociais'>
                <Tippy content='Copiar Link'>
                    <section>
                        <a onClick={copyToClipboard}><i class="fa-solid fa-link"></i></a>
                    </section>
                </Tippy>
                <Tippy content='Compartilhar no WhatsApp'>
                    <section>
                        <a href={`https://api.whatsapp.com/send?text=${window.location.href}`} target='_blank'><i class="fa-brands fa-whatsapp"></i></a>
                    </section>
                </Tippy>
                <Tippy content='Compartilhar no Facebook'>
                    <section>
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target='_blank'><i class="fa-brands fa-facebook-f"></i></a>
                    </section>
                </Tippy>
            </div>
        </div>
    )
}