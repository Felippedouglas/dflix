import { React, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { APIKey } from "../../config/key";
import PessoaFilmeParticipado from "./filmes";
import PessoaSerieParticipado from "./series";
import backgroundErro from '../../componentes/imgs/img-erro-background-pessoa.png';
import './style.css';

export default function Pessoa() {

    const { idPessoa, backgroundMovie } = useParams();
    const [ pessoa, setPessoa ] = useState([]);
    const [ idadepessoa, setIdadePessoa ] = useState();
    const [ backgroundImgPessoa, setBackgroundImgPessoa ] = useState();
    const [ posterImgPessoa, setPosterImgPessoa ] = useState();
    const [ nameMovieBackgroundImgPessoa, setNameMovieBackgroundImgPessoa ] = useState();
    const [ idMovieBackgroundImgPessoa, setIdMovieBackgroundImgPessoa ] = useState();
    const [ economiaInternet, setEconomiaInternet ] = useState();
    const image_path = 'https://image.tmdb.org/t/p/w500';

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/person/${idPessoa}?api_key=${APIKey}&language=pt-BR`)
        .then(Response => Response.json())
        .then(data => {
            setPessoa(data)
        })

        setEconomiaInternet(localStorage.getItem('economia'))
            
        document.title = `DFLIX`;
    }, [idPessoa])

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/discover/${backgroundMovie}?api_key=${APIKey}&language=pt-BR&with_people=${idPessoa}&sort_by=popularity.desc&page=1`)
        .then(Response => Response.json())
        .then(data => {
            setBackgroundImgPessoa(data.results[0].backdrop_path);
            setPosterImgPessoa(data.results[0].poster_path);
            setIdMovieBackgroundImgPessoa(data.results[0].id)
            if(backgroundMovie == 'tv') {
                setNameMovieBackgroundImgPessoa(data.results[0].name);
            } else if(backgroundMovie == 'movie') {
                setNameMovieBackgroundImgPessoa(data.results[0].title);
            }
        })
            
        document.title = `DFLIX`;
    }, [idPessoa])
        
    // definir idade pessoa
    setTimeout(()=>{
        if (pessoa.birthday) {
            if (pessoa.deathday) {
                function idade(ano_aniversario, mes_aniversario, dia_aniversario) {
                    var d = new Date,
                        ano_morte = pessoa.deathday.slice(0,4),
                        mes_morte = pessoa.deathday.slice(5,7),
                        dia_morte = pessoa.deathday.slice(8,10),
                
                        ano_aniversario = +ano_aniversario,
                        mes_aniversario = +mes_aniversario,
                        dia_aniversario = +dia_aniversario,
                
                        quantos_anos = ano_morte - ano_aniversario;
                
                    if (mes_morte < mes_aniversario || mes_morte == mes_aniversario && dia_morte < dia_aniversario) {
                        quantos_anos--;
                    }
                
                    return quantos_anos < 0 ? 0 : quantos_anos;
                }
                setIdadePessoa(idade(pessoa.birthday.slice(0,4), pessoa.birthday.slice(5,7), pessoa.birthday.slice(8,10)));
            } else if(!pessoa.deathday) {
                function idade(ano_aniversario, mes_aniversario, dia_aniversario) {
                    var d = new Date,
                        ano_atual = d.getFullYear(),
                        mes_atual = d.getMonth() + 1,
                        dia_atual = d.getDate(),
                        
                        ano_aniversario = +ano_aniversario,
                        mes_aniversario = +mes_aniversario,
                        dia_aniversario = +dia_aniversario,
                
                        quantos_anos = ano_atual - ano_aniversario;
                
                    if (mes_atual < mes_aniversario || mes_atual == mes_aniversario && dia_atual < dia_aniversario) {
                        quantos_anos--;
                    }
                
                    return quantos_anos < 0 ? 0 : quantos_anos;
                }
                setIdadePessoa(idade(pessoa.birthday.slice(0,4), pessoa.birthday.slice(5,7), pessoa.birthday.slice(8,10)));
            }
        }
    }, 100)

    setTimeout(()=>{
        if(pessoa.name != undefined) {
            document.title = `${pessoa.name} - DFLIX`;
        }
    }, 100)

    function redirecionarErro() {
        window.location = '/404'
    }
    
    return (
        <>
            {pessoa.name &&
                <div className="container-pessoa" id="container-pessoa">
                    <section className="section-pessoa">
                        <section className="section-background-pessoa">
                            {!economiaInternet &&
                                <Link to={`/assistir=${backgroundMovie}&${idMovieBackgroundImgPessoa}`} className="nome-movie-background"><i class="fa-regular fa-image"></i> {nameMovieBackgroundImgPessoa}</Link>
                            }
                            {document.body.clientWidth >= 600 && !economiaInternet &&
                                <img src={backgroundImgPessoa != undefined ? `${image_path}${backgroundImgPessoa}` : `${backgroundErro}`} alt={`img background ${pessoa.name}`}/>
                            }
                            {document.body.clientWidth < 600 && !economiaInternet &&
                                <img src={backgroundImgPessoa != undefined ? `${image_path}${posterImgPessoa}` : `${backgroundErro}`} alt={`img background ${pessoa.name}`}/>
                            }
                            {economiaInternet &&
                                <img src={backgroundErro} alt={`img background ${pessoa.name}`}/>
                            }
                        </section>
                        <section className="section-informacoes-pessoa">
                            <img className="img-pessoa" loading="lazy" src={`${image_path}${pessoa.profile_path}`} alt={pessoa.name} onError={({ currentTarget }) => {currentTarget.onerror = null; currentTarget.src="https://dflix.netlify.app/imagens/img-avatar.png";}}/>
                            <div className="div-sobre-pessoa">
                                <section className="nome-pessoa">
                                    <h1>{pessoa.name}</h1>
                                </section>
                                <section className="sobre-pessoa">
                                    {pessoa.birthday &&
                                        <span>{pessoa.birthday.slice(8,10)}/{pessoa.birthday.slice(5,7)}/{pessoa.birthday.slice(0,4)}</span>
                                    }
                                    {pessoa.deathday &&
                                        <span> - <i class="fa-solid fa-cross"></i> {(pessoa.deathday).slice(8,10)}/{(pessoa.deathday).slice(5,7)}/{(pessoa.deathday).slice(0,4)}</span>
                                    }
                                    {pessoa.birthday &&
                                        <span> | {idadepessoa} anos</span>
                                    }
                                    <section>
                                        {pessoa.place_of_birth &&
                                            <span>{pessoa.place_of_birth}</span>
                                        }
                                    </section>
                                </section>
                            </div>
                        </section>
                    </section>
                    <section>
                        {pessoa.biography != '' &&
                            <section className="section-biográfia-pessoa">
                                <h2 className="h2-titulo-sections">biográfia</h2>
                                <span>{pessoa.biography}</span>
                            </section>
                        }
                        <PessoaFilmeParticipado nomePessoa={pessoa.name}/>
                        <PessoaSerieParticipado nomePessoa={pessoa.name}/>
                    </section>
                </div>
            }
            {pessoa.success == false &&
                redirecionarErro()
            }
        </>
    )
}