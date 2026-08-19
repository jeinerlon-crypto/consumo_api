
const divContenedor = document.querySelector(".galeria");
const btnCargar = document.querySelector(".btn-cargar");

btnCargar.addEventListener("click", async () => {
    try {
        const respuesta = await fetch("https://picsum.photos/v2/list?limit=24");

        const datos = await respuesta.json();

        divContenedor.innerHTML = "";

        datos.forEach((foto) => {
            divContenedor.innerHTML += `
                <div class="img-card">
                    <img src="${foto.download_url}" alt="Imagen de Picsum">
                    <h3>Imagen ${foto.id}</h3>
                </div>
            `;
        });
    } catch (error) {
        console.log("Error:", error);
    }
});