# STAR WARS Height-o-Meter Backend

### This is the backend for STAR WARS characters height comparison website.

<img src='./sw-height-img.jpg'>

## Table of contents

- Requirements
- Installation
- Framework/technologies
- Usage
- APIs/Packages references

## Requirements

- Node.js
- npm

## Installation

- Step 1 : Clone this repository
- Step 2 : Go to the project directory and install dependencies

```javascript
$ cd projectFolder

$ npm install
```

- Step 3 : Start the server

```javascript
$ node .
```

## Framework and technologies used

### Backend

- Framework used : [Express](https://expressjs.com/)
- Technologies : [cors](https://www.npmjs.com/package/cors) , [axios](https://www.npmjs.com/package/axios)

### Frontend

For details visit the [Frontend repository](https://github.com/krik-chry/star-wars-assignment-client)

## Usage

Current methods are:

### 1. GET /allFilms - Getting all movies of STAR WARS API with a request at swapi.co/api/films

Each film's title, episode id and release year are send as a response that looks like this :

```javascript
[
  {
    episode: 4,
    id: '1',
    releaseYear: '1977',
    title: 'A New Hope'
  },
  {
    episode: 5,
    id: '2',
    releaseYear: '1980',
    title: 'The Empire Strikes Back'
  },
  {
    episode: 6,
    id: '3',
    releaseYear: '1983',
    title: 'Return of the Jedi'
  },
  {
    episode: 1,
    id: '4',
    releaseYear: '1999',
    title: 'The Phantom Menace'
  },
  {
    episode: 2,
    id: '5',
    releaseYear: '2002',
    title: 'Attack of the Clones'
  },
  {
    episode: 3,
    id: '6',
    releaseYear: '2005',
    title: 'Revenge of the Sith'
  },
  {
    episode: 7,
    id: '7',
    releaseYear: '2015',
    title: 'The Force Awakens'
  }
];
```

### 2. GET /search/:term?/:order: - Getting all characters of a film and sorts them by height

\***\* I decided to display one movie at a time, so a if we have more than one search results it will return a bad request message. \*\***

- Each movie has an array of character's SWAPI URLs
- When we have a search term parameter (either title term or film ID), we get the film's data, map over characters array and fetch the data for each character.
- The order parameter defines the sort of the characters by height.
  Default is descending, but it can be ascending (eg. GET/search/empire+strikes/asc)
- Then we get each character's name and height and send them as a response that looks like this :

```javascript
{
    "characters": [
        {
            "height": "228",
            "name": "Chewbacca"
        },
        {
            "height": "202",
            "name": "Darth Vader"
        },
        {
            "height": "188",
            "name": "Raymus Antilles"
        },
        {
            "height": "183",
            "name": "Biggs Darklighter"
        },
        {
            "height": "182",
            "name": "Obi-Wan Kenobi"
        },
        {
            "height": "180",
            "name": "Jek Tono Porkins"
        },
        {
            "height": "180",
            "name": "Wilhuff Tarkin"
        },
        {
            "height": "180",
            "name": "Han Solo"
        },
        {
            "height": "178",
            "name": "Owen Lars"
        },
        {
            "height": "175",
            "name": "Jabba Desilijic Tiure"
        },
        {
            "height": "173",
            "name": "Greedo"
        },
        {
            "height": "172",
            "name": "Luke Skywalker"
        },
        {
            "height": "170",
            "name": "Wedge Antilles"
        },
        {
            "height": "167",
            "name": "C-3PO"
        },
        {
            "height": "165",
            "name": "Beru Whitesun lars"
        },
        {
            "height": "150",
            "name": "Leia Organa"
        },
        {
            "height": "97",
            "name": "R5-D4"
        },
        {
            "height": "96",
            "name": "R2-D2"
        }
    ],
    "filmTitle": "A New Hope",
    "heightOrder": "desc"
}
```

## APIs references

The API used for this project is [SWAPI](https://swapi.co/) API

For more information, feel free to contact me.
