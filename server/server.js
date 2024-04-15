const express = require('express');
const app = express();
const cors = require('cors');
const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig.development);
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());


app.get('/movies', async (req, res) => {
    try {
        const movies = await knex('movies').select('*');
        res.json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).send('Error fetching movies');
    }
});


app.post('/movies', async (req, res) => {
    const { title } = req.body;
    try {
        const newMovie = await knex('movies').insert({ title }).returning('*');
        res.json(newMovie[0]);
    } catch (error) {
        console.error('Error adding movie:', error);
        res.status(500).send('Error adding movie');
    }
});

app.put('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const { watched } = req.body;
  try {
      await knex('movies').where({ id }).update({ watched });

      const updatedMovie = await knex('movies').where({ id }).first();

      if (updatedMovie) {
          res.json(updatedMovie);
      } else {
          res.status(404).json({ error: 'Movie not found' });
      }
  } catch (error) {
      console.error('Error updating movie watched status:', error);
      res.status(500).send('Error updating movie watched status');
  }
});


app.delete('/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await knex('movies').where({ id }).del();
        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).send('Error deleting movie');
    }
});

app.get('/', (req, res) => {
    res.send('Working');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
