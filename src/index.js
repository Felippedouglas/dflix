import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Routes, Route } from 'react-router-dom'
import BarraNav from './componentes/nav';
import Assistir from './paginas/assistir';
import Favoritos from './paginas/favoritos';
import Home from './paginas/home';
import Pesquisar from './paginas/pesquisar';
import PesqusiarGenero from './paginas/pesquisar/genero';
import Pessoa from './paginas/pessoa';
import $ from 'jquery';
import Footer from './componentes/footer';
import Conta from './paginas/conta';
import './global.css';

// eslint-disable-next-line
import "swiper/css/bundle";

setTimeout(()=>{

  $(window).on('scroll', function() {
      if ($(window).scrollTop() > 200) {
          document.getElementById('button-topo-pagina').style.display = 'flex';
      } else if ($(window).scrollTop() < 200){
          document.getElementById('button-topo-pagina').style.display = 'none';
      }
  })

  ReactDOM.render(
    <HashRouter>
      <button onClick={()=>window.scrollTo(0,0)} className='button-topo-pagina' id="button-topo-pagina"><i class="fa-solid fa-circle-chevron-up"></i></button>
      <BarraNav />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/conta" element={<Conta/>}/>
        <Route path="/:preview/:filmeSerie&:id/" element={<Home/>}/>
        <Route path="/assistir=:filmeSerie&:id/" element={<Assistir/>}/>
        <Route path="/assistir=:filmeSerie&:id/:temporada/:episodio" element={<Assistir/>}/>
        <Route path="/comentarios:popUpComentarios/:filmeSerie&:id/" element={<Assistir/>}/>
        <Route path="/elenco:popUpAtores/:filmeSerie&:id/" element={<Assistir/>}/>
        <Route path="/pesquisar/" element={<Pesquisar/>}/>
        <Route path="/pesquisar/search=:movieName&pagina=:numeroPagina/" element={<Pesquisar/>}/>
        <Route path="/:filmeSerie/genero=:idGenero/:generoPesquisado&infantil=:infantil&pagina=:numeroPagina/" element={<PesqusiarGenero/>}/>
        <Route path="/pessoa=:idPessoa/bg=:backgroundMovie/" element={<Pessoa/>}/>
        <Route path="/favoritos/" element={<Favoritos/>}/>
      </Routes>
      <Footer />
    </HashRouter>,
    document.getElementById('app')
  );
}, 2000)