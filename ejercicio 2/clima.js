const inputCiudad = document.querySelector(".input-ciudad");
const btnBuscar = document.querySelector(".btn-buscar");
const resultadoDiv = document.querySelector(".resultado");
const traductorPaises = new Intl.DisplayNames(['es'], { type: 'region' });

async function mostrarClima(ciudad) {
    const apiKey = "2e7d0b502ab90feb9a8565ab92f81c88";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;

    try {
        const response = await fetch(apiUrl);

        const data = await response.json();
        console.log(data);

    resultadoDiv.innerHTML = `
        <h2>${data.name}</h2>
        <p>Temperatura: ${Math.round(data.main.temp)}°C</p>
        <p>Humedad: ${data.main.humidity}%</p>
        <p>Descripción: ${data.weather[0].description}</p>
        <p>Pais: ${traductorPaises.of(data.sys.country)}</p>
    `;
} catch (error) {
        resultadoDiv.innerHTML = "<p>No se encontró la ciudad.</p>";
        console.log(error);
    }
}

btnBuscar.addEventListener("click", () => {
    mostrarClima(inputCiudad.value);
});

inputCiudad.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        mostrarClima(inputCiudad.value);
    }
});