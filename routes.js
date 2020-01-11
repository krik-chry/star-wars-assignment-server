const { Router } = require('express');
const axios = require('axios');

const router = new Router();

function heightDesc(charactersArray) {
  charactersArray.sort(function(a, b) {
    return b.height - a.height;
  });
}

function heightAsc(charactersArray) {
  charactersArray.sort(function(a, b) {
    return a.height - b.height;
  });
}

router.get('/films/:searchTerm?/:order?', async (req, res) => {
  let order;
  let searchTerm;
  let movieTitle;
  let charactersArray = [];

  if (!req.params.order) {
    order = 'DESC';
  } else {
    order = req.params.order;
  }
  if (!req.params.searchTerm) {
    res.send({
      Message: 'Please enter a search term.'
    });
  } else {
    searchTerm = req.params.searchTerm;
  }
  await axios.get(`https://swapi.co/api/films/?search=${searchTerm}`).then(result => {
    if (result.data.count === 0) {
      res.send({
        Message: '0 results found'
      });
    } else if (result.data.count > 1) {
      res.send({
        Message: 'Please be more specific.'
      });
    } else {
      const movieInfo = result.data.results;
      const movieCharacters = movieInfo[0].characters.map(link => axios.get(link));
      movieTitle = movieInfo[0].title;
      return Promise.all(movieCharacters).then(responses =>
        responses.map(response =>
          charactersArray.push({ name: response.data.name, height: response.data.height })
        )
      );
    }
  });

  if (order === 'asc') {
    heightAsc(charactersArray);
    res.send({ title: movieTitle, characters: charactersArray });
  } else {
    heightDesc(charactersArray);
    res.send({ title: movieTitle, characters: charactersArray });
  }
});

module.exports = router;
