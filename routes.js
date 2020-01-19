const { Router } = require('express');
const axios = require('axios');

const router = new Router();

const baseUrl = 'https://swapi.co/api/films';

router.get('/allFilms', async (req, res) => {
  try {
    let allFilms = [];
    const response = await axios.get(`${baseUrl}`);
    const data = response.data.results;

    data.map(film => {
      allFilms.push({
        id: film.url.slice(-2, -1),
        title: film.title,
        episode: film.episode_id
      });
    });

    allFilms.sort(function(a, b) {
      return a.id - b.id;
    });

    res.status(200).send(allFilms);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

function sortByHeight(charactersArray, order) {
  if (order.toLowerCase() === 'asc') {
    charactersArray.sort(function(a, b) {
      return a.height - b.height;
    });
  } else if (order.toLowerCase() === 'desc') {
    charactersArray.sort(function(a, b) {
      return b.height - a.height;
    });
  }
}

async function getFilmCharacters(data, order, res) {
  let filmTitle;
  let charactersArray = [];
  const movieInfo = {
    release_date: data.release_date.slice(0, 4),
    title: data.title,
    characters: data.characters
  };

  filmTitle = movieInfo.title;

  const movieCharacters = movieInfo.characters.map(link => axios.get(link));

  await Promise.all(movieCharacters).then(responses =>
    responses.map(response =>
      charactersArray.push({ name: response.data.name, height: response.data.height })
    )
  );

  if (order && (order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc')) {
    sortByHeight(charactersArray, order);
    res.status(200).send({
      filmTitle: filmTitle,
      release_date: movieInfo.release_date,
      characters: charactersArray,
      heightOrder: order
    });
  } else {
    sortByHeight(charactersArray, 'desc');
    res.status(200).send({
      filmTitle: filmTitle,
      release_date: movieInfo.release_date,
      characters: charactersArray,
      heightOrder: 'desc'
    });
  }
}

router.get('/search/:term?/:order?', async (req, res) => {
  const { term, order } = req.params;
  try {
    if (!term || term > 7) {
      res.status(400).send({
        message: `You can search by film ID....but only from 1-7.`
      });
    } else {
      let searchTerm;

      if (!isNaN(term) && 0 < term && term < 8 && Number.isInteger(parseInt(term))) {
        searchTerm = term;

        const response = await axios.get(`${baseUrl}/${searchTerm}`);
        const data = response.data;

        getFilmCharacters(data, order, res);
      } else {
        searchTerm = `?search=${term}`;

        const response = await axios.get(`${baseUrl}/${searchTerm}`);

        let data;

        if (response.data.count === 1) {
          data = response.data.results[0];
        } else if (response.data.count === 0) {
          return res.status(400).send({ message: '0 results found' });
        } else {
          return res.status(400).send({ message: 'Too many results. Please be more specific.' });
        }

        getFilmCharacters(data, order, res);
      }
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
