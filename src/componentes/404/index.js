import { Link } from 'react-router-dom';
import './404.css';

export default function Erro404() {
    return(
        <div className="content-erro-404">
            <h2>Algo deu errado! :(</h2>
            <Link to='/' className='bt-voltar-erro-404'>Voltar</Link>
        </div>
    )
}