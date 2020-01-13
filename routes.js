const { Router } = require('express');
const axios = require('axios');

const router = new Router();

const baseUrl = 'https://swapi.co/api/films';

router.get('/allFilms', async (req, res) => {
  let allFilms = [];
  const response = await axios.get(`${baseUrl}`);
  const data = response.data.results;

  await Promise.all(data).then(responses =>
    responses.map(response =>
      allFilms.push({
        id: response.url.slice(-2, -1),
        title: response.title,
        releaseYear: response.release_date.slice(0, 4),
        episode: response.episode_id
      })
    )
  );

  allFilms.sort(function(a, b) {
    return a.id - b.id;
  });

  res.status(200).send(allFilms);
});

// Function to check order (asc/desc) request and sort characters by height
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

// Declared a function with response's data, user's order request characters array and film title variable
// as parameters. When called, it returns an array of characters for a specific Star Wars movie.
// It also sorts characters by height if the user requested it. Then sends a response with the sorted
// by height array of characters, sorting order and film title.

async function getFilmCharacters(data, charactersArray, order, filmTitle, res) {
  // Extract movie info ( title & character's URLs) from response data
  const movieInfo = {
    title: data.title,
    characters: data.characters
  };

  // Assign movie title to variable filmTitle
  filmTitle = movieInfo.title;

  // SWAPI request for each character URL to get a response with the character's info
  const movieCharacters = movieInfo.characters.map(link => axios.get(link));

  // When we get all the responses, push character's name and height to the characters array
  await Promise.all(movieCharacters).then(responses =>
    responses.map(response =>
      charactersArray.push({ name: response.data.name, height: response.data.height })
    )
  );

  // Check if order (desc/asc) has been specified and sort the characters array
  // Then send the response, including film title, characters list and order by height description
  if (order && (order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc')) {
    sortByHeight(charactersArray, order);
    res.status(200).send({ filmTitle: filmTitle, characters: charactersArray, heightOrder: order });
  } else {
    // If no order is specified or there is a typo, default order is Desc
    sortByHeight(charactersArray, 'desc');
    res
      .status(200)
      .send({ filmTitle: filmTitle, characters: charactersArray, heightOrder: 'desc' });
  }
}

// Endpoint for searching film by ID or title term, and listing all the film characters
// names and heights. If order is specified, characters are sorted by height (asc/desc)
router.get('/search/:term?/:order?', async (req, res) => {
  // Get user's input (term and order) from request parameters
  const { term, order } = req.params;

  // Define title and characters array
  let filmTitle;
  let charactersArray = [];

  // Check search term to exist and not be a number > 7. If OK, proceed with the API call, if NOT, send a message with user's options
  if (!term || term > 7) {
    res.status(400).send({
      message: `You can search by ID....but only from 1-7.`
    });
  } else {
    // Define search term, a variable that is changing in each case
    let searchTerm;

    // Case 1: The user is searching by film ID
    // First we check if term is an integer from 0-7
    if (!isNaN(term) && 0 < term && term < 8 && Number.isInteger(parseInt(term))) {
      // Assign film ID the user chose to searchTerm variable
      searchTerm = term;

      // Get the results from SWAPI and assign the response's data to data variable
      const response = await axios.get(`${baseUrl}/${searchTerm}`);
      const data = response.data;

      // After we get the film data from the response, the getFilmCharacters is called with the needed arguments
      getFilmCharacters(data, charactersArray, order, filmTitle, res);
    } else {
      // Case 2: The user is searching by a film title term

      // Assign user's search input to searchTerm variable
      searchTerm = `?search=${term}`;

      // Get the results from SWAPI
      const response = await axios.get(`${baseUrl}/${searchTerm}`);

      // Define film data
      let data;

      // Check the amount of the results. I chose to display one movie at a time
      // so having more than one or 0 results is a BadRequest/404
      if (response.data.count === 1) {
        // Assign the response's data to data variable if 1 film found
        data = response.data.results[0];
      } else if (response.data.count === 0) {
        return res.status(404).send({ message: '0 results found' });
      } else {
        return res.status(400).send({ message: 'Too many results. Please be more specific.' });
      }

      // After we get the film data from the response, the getFilmCharacters is called with the needed arguments
      getFilmCharacters(data, charactersArray, order, filmTitle, res);
    }
  }
});

module.exports = router;
