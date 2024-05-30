// get the Pokemon ID from the URL  
const urlParams = new URLSearchParams(window.location.search);
const pokemonId = urlParams.get('id');

// function to fetch Pokemon details
const fetchPokemonDetails = async (pokemonId) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch Pokemon details');
        }
        const pokemonData = await response.json();
        displayPokemonDetails(pokemonData);
    } catch (error) {
        console.error('Error fetching Pokemon details:', error);
    }
};

// function to display Pokemon details
const displayPokemonDetails = (pokemon) => {
    const pokemonNameElement = document.getElementById('pokemon-name'); //name
    const pokemonImageElement = document.getElementById('pokemon-image'); //image
    const pokemonDescriptionElement = document.getElementById('pokemon-description'); //descp
    const pokemonWeightElement = document.getElementById('pokemon-weight'); //weight
    const pokemonHeightElement = document.getElementById('pokemon-height'); //height
    const statsListElement = document.getElementById('stats-list'); //stats list
    const abilitiesListElement = document.getElementById('abilities-list'); //abilities list

    if (pokemonNameElement && pokemonImageElement && statsListElement && abilitiesListElement) {
        pokemonNameElement.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1); //uppcase first char of pkmn name
        const pokemonImage = document.createElement('img');
        pokemonImage.src = pokemon.sprites.front_default;
        pokemonImageElement.innerHTML = '';
        pokemonImageElement.appendChild(pokemonImage);

        pokemonDescriptionElement.textContent = "Species: " + pokemon.species.name; 
        pokemonWeightElement.textContent = "Weight: " + (pokemon.weight / 10) + " kg";
        pokemonHeightElement.textContent = "Height: " + (pokemon.height / 10) + " m";


        //for each stat make stat item and assign value
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

        //pokemon ability
        abilitiesListElement.innerHTML = '';
        pokemon.abilities.forEach(ability => {
            const abilityItem = document.createElement('li');
            abilityItem.textContent = ability.ability.name;
            abilitiesListElement.appendChild(abilityItem);
        });
    } else {
        console.error('Failed to find HTML elements for displaying Pokemon details');
    }
};

//Color stat bar based on stat
const getStatColor = (stat) => {
    if (stat <= 50) return 'red';
    if (stat <= 70) return 'orange';
    if (stat <= 90) return 'yellow';
    return 'green';
};

//Back button go back
function redirectPokedex() {
    const url = `index.html?`;
    window.location.href = url;
    
}

// Fetch and display Pokemon details
fetchPokemonDetails(pokemonId);
