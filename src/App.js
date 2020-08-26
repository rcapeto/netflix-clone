import React, { useState, useEffect } from 'react';
import Tmdb from './Tmdb';

import MovieRow from './Components/MovieRow';
import FeaturedMovie from './Components/FeaturedMovie';
import Header from './Components/Header';

import './App.css';

function App() {
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    async function loadAll() {
      const list = await Tmdb.getHomeList();
      setMovieList(list);

      const originals = list.filter(i => i.slug === 'originals');
      const randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      const chosen = originals[0].items.results[randomChosen];
      const chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
    }

    loadAll();
  }, []);

  useEffect(() => {
    function scrollListener() {
      if(window.scrollY > 60) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, []);

  return (
    <div className="page">

      <Header black={blackHeader}/>

      { featuredData && <FeaturedMovie item={featuredData}/>}

      <section className="lists">
        { movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items}/>
        )) }
      </section>

      <footer>
          Feito com <span role="img" aria-label="coralção">♥</span> por Raphael Capeto <br/>
          Direitos de imagem para Netflix <br/>
          Dados pegos pelo site Themoviedb.org
      </footer>

      { movieList.length <= 0 && (
        <div className="loading">
          <img 
            src="https://cdn.lowgif.com/full/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif" 
            alt="Carregando..."
          />
        </div>
      )}

    </div>
  );
}

export default App;
