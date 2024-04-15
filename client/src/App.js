import React, { useState, useEffect } from 'react';
import './App.css';

function MovieInfoPanel({ movie, onToggleWatched }) {
  const [movieInfo, setMovieInfo] = useState(null);

  useEffect(() => {
    // Fetch movie information from The Movie Database API when the component mounts
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=4c960f28fbd285c99ccfccd145a0c70b&query=${encodeURIComponent(movie.title)}`)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          setMovieInfo(data.results[0]);
        }
      })
      .catch(error => console.error("Error fetching movie information:", error));
  }, [movie]);

  return (
    <div>
      {movieInfo ? (
        <div>
          <h3>{movieInfo.title}</h3>
          <p>{movieInfo.overview}</p>
          <button onClick={onToggleWatched}>{movie.watched ? 'Unwatch' : 'Watch'}</button>
        </div>
      ) : (
        <p>Loading movie information...</p>
      )}
    </div>
  );
}

function App() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const unwatchedMovies = movies.filter(movie => !movie.watched);

  useEffect(() => {
    fetch('http://localhost:8080/movies')
      .then(result => result.json())
      .then(data => {
        setMovies(data);
        setSearchResults(data);
      })
      .catch(error => console.error("Error fetching movies:", error));
  }, []);

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterMovies(query);
  };

  useEffect(() => {
    setWatchedMovies(movies.filter(movie => movie.watched));
  }, [movies]);

  const filterMovies = (query) => {
    const filteredMovies = movies.filter(movie =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredMovies);
  };

  const handleAddMovie = () => {
    const newMovieTitle = prompt("Enter movie title:");
    if (newMovieTitle) {
      fetch('http://localhost:8080/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newMovieTitle }),
      })
        .then(response => response.json())
        .then(data => {
          setMovies([...movies, data]);
          setSearchResults([...searchResults, data]);
        })
        .catch(error => console.error("Error adding movie:", error));
    }
  };

  const handleDeleteMovie = (id) => {
    fetch(`http://localhost:8080/movies/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setMovies(movies.filter(movie => movie.id !== id));
        setSearchResults(searchResults.filter(movie => movie.id !== id));
      })
      .catch(error => console.error("Error deleting movie:", error));
  };

  const handleToggleWatched = (id) => {
    const movieToUpdate = movies.find(movie => movie.id === id);

    const updatedMovies = movies.map(movie =>
      movie.id === id ? { ...movie, watched: !movie.watched } : movie
    );
    setMovies(updatedMovies);
    setSearchResults(updatedMovies);

    fetch(`http://localhost:8080/movies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...movieToUpdate, watched: !movieToUpdate.watched }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update movie watched status');
        }
      })
      .catch(error => console.error("Error updating movie watched status:", error));
  };


  return (
    <>
      <nav>
        <div>
          <h1>List of Movies</h1>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
      </nav>
      <div>
        <button onClick={handleAddMovie}>Click To Add Movie</button>
        <ul>
          {searchResults.map((movie, index) => (
            <li key={index} onClick={() => setSelectedMovie(movie)}>
              {movie.title}
              <button onClick={() => handleDeleteMovie(movie.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      {selectedMovie && (
        <div className="movie-info-panel">
          <MovieInfoPanel
            movie={selectedMovie}
            onToggleWatched={() => handleToggleWatched(selectedMovie.id)}
          />
        </div>
      )}
       <div>
          <h2>Watched Movies</h2>
          <ul>
            {watchedMovies.map((movie, index) => (
              <li key={index}>
                {movie.title}
                <button onClick={() => handleToggleWatched(movie.id)}>
                  {movie.watched ? 'Unwatch' : 'Watch'}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
        <h2>Unwatched Movies</h2>
        <ul>
          {unwatchedMovies.map((movie, index) => (
            <li key={index}>
              {movie.title}
              <button onClick={() => handleToggleWatched(movie.id)}>
                {movie.watched ? 'Unwatch' : 'Watch'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
