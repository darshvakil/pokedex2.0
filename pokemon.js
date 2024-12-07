// Get the search query from the URL or input
const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('query')?.toLowerCase(); // Use 'query' parameter for name search

// Function to fetch the list of Pokémon and filter by the search query
const fetchPokemonByName = async (query) => {
    try {
        if (!query) {
            throw new Error('No search query provided');
        }

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
        if (!response.ok) {
            throw new Error('Failed to fetch Pokémon list');
        }

        const pokemonList = await response.json();
        const matchingPokemon = pokemonList.results.filter(pokemon =>
            pokemon.name.toLowerCase().startsWith(query.toLowerCase()) // Ensure strict match
        );

        if (!matchingPokemon) {
            throw new Error(`No Pokémon found starting with "${query}"`);
        }

        // Fetch and display details of the first matching Pokémon
        fetchPokemonDetails(matchingPokemon.url);
    } catch (error) {
        console.error('Error fetching Pokémon by name:', error);
        displayErrorMessage(error.message);
    }
};

// Function to fetch and display details of a specific Pokémon
const fetchPokemonDetails = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch Pokémon details');
        }
        const pokemonData = await response.json();
        displayPokemonDetails(pokemonData);
    } catch (error) {
        console.error('Error fetching Pokémon details:', error);
    }
};

// Function to display error messages
const displayErrorMessage = (message) => {
    const container = document.getElementById('pokemon-container');
    if (container) {
        container.innerHTML = `<div class="error-message">${message}</div>`;
    }
};

// Function to display Pokémon details
const displayPokemonDetails = (pokemon) => {
    const pokemonNameElement = document.getElementById('pokemon-name'); // Name
    const pokemonImageElement = document.getElementById('pokemon-image'); // Image
    const pokemonDescriptionElement = document.getElementById('pokemon-description'); // Description
    const pokemonWeightElement = document.getElementById('pokemon-weight'); // Weight
    const pokemonHeightElement = document.getElementById('pokemon-height'); // Height
    const statsListElement = document.getElementById('stats-list'); // Stats list
    const abilitiesListElement = document.getElementById('abilities-list'); // Abilities list

    if (pokemonNameElement && pokemonImageElement && statsListElement && abilitiesListElement) {
        pokemonNameElement.textContent =
            pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1); // Capitalize the name

        const pokemonImage = document.createElement('img');
        pokemonImage.src = pokemon.sprites.front_default || 'fallback-image.png'; // Add fallback image
        pokemonImage.alt = pokemon.name;
        pokemonImageElement.innerHTML = '';
        pokemonImageElement.appendChild(pokemonImage);

        pokemonDescriptionElement.textContent = 'Species: ' + pokemon.species.name;
        pokemonWeightElement.textContent = 'Weight: ' + (pokemon.weight / 10) + ' kg';
        pokemonHeightElement.textContent = 'Height: ' + (pokemon.height / 10) + ' m';

        // Display stats
        statsListElement.innerHTML = '';
        pokemon.stats.forEach(stat => {
            const statItem = document.createElement('div');
            statItem.classList.add('stat-item');

            const statName = document.createElement('div');
            statName.classList.add('stat-name');
            statName.textContent = stat.stat.name.replace('special-', 'Sp. ').replace('-', ' ');

            const statBar = document.createElement('div');
            statBar.classList.add('stat-bar');

            const statBarFill = document.createElement('div');
            statBarFill.classList.add('stat-bar-fill');
            statBarFill.style.width = `${stat.base_stat / 1.5}%`; // Adjust the width calculation as needed
            statBarFill.style.backgroundColor = getStatColor(stat.base_stat);

            statBar.appendChild(statBarFill);

            const statValue = document.createElement('div');
            statValue.classList.add('stat-value');
            statValue.textContent = stat.base_stat;

            statItem.appendChild(statName);
            statItem.appendChild(statBar);
            statItem.appendChild(statValue);
            statsListElement.appendChild(statItem);
        });

        // Display abilities
        abilitiesListElement.innerHTML = '';
        pokemon.abilities.forEach(ability => {
            const abilityItem = document.createElement('li');
            abilityItem.textContent = ability.ability.name;
            abilitiesListElement.appendChild(abilityItem);
        });
    } else {
        console.error('Failed to find HTML elements for displaying Pokémon details');
    }
};

// Color stat bar based on stat
const getStatColor = (stat) => {
    if (stat <= 50) return 'red';
    if (stat <= 70) return 'orange';
    if (stat <= 90) return 'yellow';
    return 'green';
};

// Redirect to Pokédex
function redirectPokedex() {
    history.back();
}

// Fetch and display Pokémon details based on search query
fetchPokemonByName(searchQuery);
