import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Routes, Route } from 'react-router-dom';
import BarraNav from './componentes/nav';
import Assistir from './paginas/assistir';
import Favoritos from './paginas/favoritos';
import Home from './paginas/home';
import Pesquisar from './paginas/pesquisar';
import PesqusiarGenero from './paginas/pesquisar/genero';
import Pessoa from './paginas/pessoa';
import PesqusiarKeyword from './paginas/pesquisar/keyword';
import Footer from './componentes/footer';
import Conta from './paginas/conta';
import './global.css';
import Usuario from './paginas/usuario';

setTimeout(()=> {

  ReactDOM.render(
    <HashRouter>
      <BarraNav />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Usuario/>}/>
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
        <Route path="/keyword=:keyword&pagina=:numeroPagina/" element={<PesqusiarKeyword/>}/>
        <Route path="/pessoa=:idPessoa/bg=:backgroundMovie/:exibir/" element={<Pessoa/>}/>
        <Route path="/favoritos/" element={<Favoritos/>}/>
      </Routes>
      <Footer />
    </HashRouter>,
    document.getElementById('app')
  );
}, 4000)