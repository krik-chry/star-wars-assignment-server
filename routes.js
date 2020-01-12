const { Router } = require('express');
const axios = require('axios');

const router = new Router();

const baseUrl = 'https://swapi.co/api/films';

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

// Endpoint for searching film by ID and listing all the characters
// If order is specified, characters are sorted by height
router.get('/:filmID(\\d+)?/:order?', async (req, res) => {
  const { filmID, order } = req.params;

  let filmTitle;
  let charactersArray = [];

  // Check film ID, if OK -> proceed with the API call
  if (!filmID || filmID > 7) {
    res.status(400).send({
      Error: `Please enter the film ID. 1) A New Hope, 2) The Empire Strikes Back, 3) Return of the Jedi, 4) The Phantom Menace, 5) Attack of the Clones, 6) Revenge of the Sith, 7) The Force Awakens`
    });
  } else {
    await axios
      .get(`${baseUrl}/${filmID}`)
      .then(result => result.data)
      .then(data => {
        const movieInfo = {
          title: data.title,
          characters: data.characters
        };
        return movieInfo;
      })
      .then(movieInfo => {
        filmTitle = movieInfo.title; // Set movie title
        const movieCharacters = movieInfo.characters.map(link => axios.get(link)); // API request for each character URL

        // When we get all the responses, push all character's info to the characters array
        return Promise.all(movieCharacters).then(responses =>
          responses.map(response =>
            charactersArray.push({ name: response.data.name, height: response.data.height })
          )
        );
      });

    // Check if order (desc/asc) has been specified and sort the characters array
    // Then send the response, including film title and characters list
    if (order && (order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc')) {
      sortByHeight(charactersArray, order);

      res.status(200).send({ Film: filmTitle, Characters: charactersArray });
    } else {
      // If no order is specified or there is a typo, default order is Desc
      sortByHeight(charactersArray, 'desc');
      res.status(200).send({ Film: filmTitle, Characters: charactersArray });
    }
  }
});

module.exports = router;
