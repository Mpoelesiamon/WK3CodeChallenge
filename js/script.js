// script.js
document.addEventListener('DOMContentLoaded', () => {
    const moviePoster = document.getElementById('movie-poster');
    const movieTitle = document.getElementById('movie-title');
    const movieRuntime = document.getElementById('movie-runtime');
    const movieShowtime = document.getElementById('movie-showtime');
    const availableTickets = document.getElementById('available-tickets');
    const buyTicketButton = document.getElementById('buy-ticket');
    const filmsList = document.getElementById('films');

    let currentMovie;

    // Function to display movie details
    function displayMovieDetails(movie) {
        moviePoster.src = movie.poster;
        movieTitle.textContent = movie.title;
        movieRuntime.textContent = movie.runtime;
        movieShowtime.textContent = movie.showtime;
        const available = movie.capacity - movie.tickets_sold;
        availableTickets.textContent = available;
        currentMovie = movie;
        if (available === 0) {
            buyTicketButton.textContent = 'Sold Out';
            buyTicketButton.disabled = true;
        } else {
            buyTicketButton.textContent = 'Buy Ticket';
            buyTicketButton.disabled = false;
        }
    }

    // Function to fetch movie details
    function fetchMovieDetails(movieId) {
        fetch(`/films/${movieId}`)
            .then((response) => response.json())
            .then((data) => displayMovieDetails(data))
            .catch((error) => console.error(error));
    } 

    // Function to fetch and display movies in the menu
    function fetchAndDisplayMovies() {
        fetch('/films')
            .then((response) => response.json())
            .then((data) => {
                filmsList.innerHTML = '';
                data.forEach((movie) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = movie.title;
                    listItem.classList.add('film-item');
                    listItem.addEventListener('click', () => {
                        fetchMovieDetails(movie.id);
                    });
                    if (movie.capacity - movie.tickets_sold === 0) {
                        listItem.classList.add('sold-out');
                    }
                    filmsList.appendChild(listItem);
                });
                if (data.length > 0) {
                    fetchMovieDetails(data[0].id);
                }
            })
            .catch((error) => console.error(error));
    }

    // Event listener for Buy Ticket button
    buyTicketButton.addEventListener('click', () => {
        if (currentMovie && currentMovie.capacity - currentMovie.tickets_sold > 0) {
            currentMovie.tickets_sold += 1;
            displayMovieDetails(currentMovie);
        }
    });

    // Initialize the movie menu and details
    fetchAndDisplayMovies();
});