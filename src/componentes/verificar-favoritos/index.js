import { useEffect, useState } from "react";
import { APIKey } from "../../config/key";

export default function VerificarFavoritos(props) {

    // favoritos
    const [ nomeMovieFavorito, setNomeMovieFavorito ] = useState();
    const [ descriptionMovieFavorito, setDescriptionMovieFavorito ] = useState();
    const [ imgMovieFavorito, setImgMovieFavorito ] = useState();
    const [ imgBackgroundMovieFavorito, setImgBackgroundMovieFavorito ] = useState();
    const [ idMovieFavorito, setIdMovieFavorito ] = useState();
    const [ imdbIdMovieFavorito, setImdbIdMovieFavorito ] = useState();
    const [ tipoMovieFavorito, setTipoMovieFavorito ] = useState();
    const [ yearMovieFavorito, setYearMovieFavorito ] = useState();
    const [ runTimeMovieFavorito, setRunTimeMovieFavorito ] = useState();
    const [ voteAverageMovieFavorito, setVoteAverageMovieFavorito ] = useState();
    const [ favoritos, setFavoritos ] = useState();

    
    const image_path = 'https://image.tmdb.org/t/p/w500';
    
    useEffect(() => {
        
        if(props.idMovie && props.idMovie != 0) {

            fetch(`https://api.themoviedb.org/3/${props.filmeSerie}/${props.idMovie}?api_key=${APIKey}&language=pt-BR`)
            .then(Response => Response.json())
            .then(data => {
                setDescriptionMovieFavorito(data.overview)
                setImgMovieFavorito(`${image_path}${data.poster_path}`)
                setImgBackgroundMovieFavorito(`${image_path}${data.backdrop_path}`)
                setIdMovieFavorito(data.id)
                setTipoMovieFavorito(props.filmeSerie)
                setVoteAverageMovieFavorito(data.vote_average)

                setTimeout(()=>{
                    if (props.filmeSerie == 'movie') {
                        setNomeMovieFavorito(data.title)
                        setYearMovieFavorito(data.release_date.slice(0,4))
                        setRunTimeMovieFavorito(data.runtime)

                    } else if (props.filmeSerie == 'tv') {
                        setNomeMovieFavorito(data.name)
                        setYearMovieFavorito(data.first_air_date.slice(0,4))
                        setRunTimeMovieFavorito(data.episode_run_time[0])
                    }
                }, 1000)
                
            });
        }
        
        const favoritosLocalStorage = JSON.parse(localStorage.getItem('favoritos') || "[]");
        setFavoritos(favoritosLocalStorage);
        props.setFavoritoIsTrue(false)
        
        setTimeout(()=>{
            if(props.idMovie) {
                favoritos.map(favorito => {
                    if ((favorito.id == props.idMovie) && (favorito.tipo == props.tipoMovie)) {
                        props.setFavoritoIsTrue(true)
                    }
                })
            }
        }, 10)

        
    //functions favoritos
    if (props.salvarFavorito) {
        let favoritos = JSON.parse(localStorage.getItem('favoritos') || "[]")
        props.setFavoritoIsTrue(true)
      
        let favorito = {
          name: nomeMovieFavorito,
          description: descriptionMovieFavorito,
          img: imgMovieFavorito,
          imgBackground: imgBackgroundMovieFavorito,
          type: tipoMovieFavorito,
          year: yearMovieFavorito,
          runtime: runTimeMovieFavorito,
          vote_average: voteAverageMovieFavorito,
          id: idMovieFavorito,
          imdbId: imdbIdMovieFavorito,
        }
    
        favoritos.push(favorito)
        localStorage.setItem('favoritos', JSON.stringify(favoritos))

        props.setSalvarFavorito(false);
        props.setIdMovie(0);
    }
    
    else if (props.removerFavorito) {
      let favoritos = JSON.parse(localStorage.getItem('favoritos'))
      
      if (favoritos) {
        let e = favoritos.findIndex( (element) => element.id == props.idMovie)

        props.setFavoritoIsTrue(false)
        favoritos.splice(e,1)
        localStorage.setItem('favoritos', JSON.stringify(favoritos))
      }

      /*setTimeout(()=>{
        window.location.reload()
      })*/
      props.setRemoverFavorito(false);
      props.setIdMovie(0);
    }
        
    }, [props.idMovie, props.salvarFavorito, props.removerFavorito, props.filmeSerie])

    
    // id imdb filme e série
    useEffect(() => {
        
        if(props.idMovie && props.idMovie != 0) {
            fetch(`https://api.themoviedb.org/3/${props.filmeSerie}/${props.idMovie}/external_ids?api_key=${APIKey}&language=pt-BR`)
            .then(Response => Response.json())
            .then(data => {
                setImdbIdMovieFavorito(data.imdb_id);
            });
        }
    }, []);

    return(
        <></>
    )

}