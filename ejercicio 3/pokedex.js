const searchForm = document.getElementById('search-form');
const pokemonInput = document.getElementById('pokemon-input');
const suggestionsDatalist = document.getElementById('pokemon-suggestions');
const cardContainer = document.getElementById('pokemon-card-container');
const tiposEspanol = { normal: 'Normal',
    fire: 'Fuego',
    water: 'Agua',
    grass: 'Planta',
    electric: 'Eléctrico',
    ice: 'Hielo',
    fighting: 'Lucha',
    poison: 'Veneno',
    ground: 'Tierra',
    flying: 'Volador',
    psychic: 'Psíquico',
    bug: 'Bicho',
    rock: 'Roca',
    ghost: 'Fantasma',
    dragon: 'Dragón',
    steel: 'Acero',
    fairy: 'Hada',
    dark: 'Siniestro'
};

// 1. Cargar las 151 sugerencias en el datalist
async function cargarSugerencias() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        
        suggestionsDatalist.innerHTML = '';
        data.results.forEach(pokemon => {
            const option = document.createElement('option');
            option.value = pokemon.name;
            suggestionsDatalist.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar sugerencias:', error);
    }
}

// 2. Obtener los datos del Pokémon y construir la tarjeta
async function buscarYMostrarPokemon(pokemonName) {
    if (!pokemonName) return;
    const cleanQuery = pokemonName.trim().toLowerCase();
    cardContainer.innerHTML = '<p class="placeholder-text">Cargando...</p>';

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${cleanQuery}`);
        
        if (!response.ok) {
            throw new Error('Pokémon no encontrado');
        }
        
        const pokemon = await response.json();

        // Extraer datos
        const habilidades = await obtenerHabilidadesEnEspanol(pokemon.abilities);
        const tipos = pokemon.types.map(t => `<span class="type-badge">${tiposEspanol[t.type.name] || t.type.name}</span>`).join(' ');
        const salud = pokemon.stats.find(s => s.stat.name === 'hp').base_stat;
        const ataque = pokemon.stats.find(s => s.stat.name === 'attack').base_stat;
        const defensa = pokemon.stats.find(s => s.stat.name === 'defense').base_stat;

        // Renderizar tarjeta
        cardContainer.innerHTML = `
            <div class="pokemon-card">
              <img src="${pokemon.sprites.front_default || pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}"/>
              <h2 class="pokemon-name">#${pokemon.id} ${pokemon.name}</h2>
              <div class="badge-container">${tipos}</div>

              <ul class="stats-list">
                <li><strong>Habilidades:</strong> ${habilidades}</li>
                <li><strong>Tipos:</strong> ${tipos}</li>
                <li><strong>Salud (HP):</strong> ${salud}</li>
                <li><strong>Ataque:</strong> ${ataque}</li>
                <li><strong>Defensa:</strong> ${defensa}</li>
                <li><strong>Peso:</strong> ${pokemon.weight / 10} kg</li>
              </ul>
            </div>
        `;
    } catch (error) {
        console.error('Error al obtener Pokémon:', error);
        cardContainer.innerHTML = '<p class="error-text">❌ Pokémon no encontrado. Intenta con otro nombre o número.</p>';
    }
}

// Función para consultar la traducción al español de cada habilidad
async function obtenerHabilidadesEnEspanol(abilitiesList) {
    const promesas = abilitiesList.map(async (item) => {
        try {
            const response = await fetch(item.ability.url);
            const data = await response.json();
            // Buscamos el objeto cuya lengua sea español ('es')
            const traduccion = data.names.find(n => n.language.name === 'es');
            return traduccion ? traduccion.name : item.ability.name;
        } catch {
            return item.ability.name; // Respaldo en inglés si falla la petición
        }
    });

    const habilidadesEspanol = await Promise.all(promesas);
    return habilidadesEspanol.join(', ');
}

// Escuchar el evento de envío del formulario
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (pokemonInput.value) {
        buscarYMostrarPokemon(pokemonInput.value);
    }
});

// Inicializar unicamente la lista de sugerencias al cargar
cargarSugerencias();