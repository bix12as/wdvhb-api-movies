const express = require('express');
const axios = require('axios');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;

const TMDB_API_KEY = '7f1173b293f68db2849094212b8f017b';

app.use(express.static(path.join(__dirname, 'public')));

// Route for movie search by name
app.get('/search-movie', async (req, res) => {
  const movieName = req.query.name;

  if (!movieName) {
    return res.status(400).json({ message: 'Movie name is required' });
  }

  try {
    const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query: movieName
      }
    });

    const tmdbData = tmdbResponse.data;

    if (tmdbData.results && tmdbData.results.length > 0) {
      const movie = tmdbData.results[0];
      const tmdbMovieId = movie.id;
      const embedUrl = `https://www.2embed.cc/embed/${tmdbMovieId}`;

      res.json({
        title: movie.title,
        embed_url: embedUrl
      });
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movie data', error: error.message });
  }
});

// Route for popular movies
app.get('/popular-movies', async (req, res) => {
  try {
    const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
      }
    });

    const tmdbData = tmdbResponse.data;

    if (tmdbData.results && tmdbData.results.length > 0) {
      const movies = tmdbData.results.map(movie => ({
        title: movie.title,
        embed_url: `https://www.2embed.cc/embed/${movie.id}`
      }));
      res.json(movies);
    } else {
      res.status(404).json({ message: 'No popular movies found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching popular movies', error: error.message });
  }
});

// Route for upcoming movies
app.get('/upcoming-movies', async (req, res) => {
  try {
    const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/movie/upcoming`, {
      params: {
        api_key: TMDB_API_KEY,
      }
    });

    const tmdbData = tmdbResponse.data;

    if (tmdbData.results && tmdbData.results.length > 0) {
      const movies = tmdbData.results.map(movie => ({
        title: movie.title,
        embed_url: `https://www.2embed.cc/embed/${movie.id}`
      }));
      res.json(movies);
    } else {
      res.status(404).json({ message: 'No upcoming movies found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming movies', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});





