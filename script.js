const contenedorMotos = document.getElementById('contenedor-motos');
const filtroTipo = document.getElementById('tipo-filtro');
const formCotizacion = document.getElementById('form-cotizacion');


// 1. Obtener las motos desde la Base de Datos usando FETCH
async function cargarMotosDesdeBD() {
    try {
        const respuesta = await fetch(`${API_URL}/motos`);
        todasLasMotos = await respuesta.json();
        renderizarMotos(todasLasMotos);
    } catch (error) {
        console.error("Error al conectar con la API:", error);
        contenedorMotos.innerHTML = "<p>Error al cargar el catálogo desde la base de datos. Asegúrate de encender el servidor.</p>";
    }
}

// 2. Pintar las tarjetas en el HTML
function renderizarMotos(motosFiltradas) {
    contenedorMotos.innerHTML = "";
    if (motosFiltradas.length === 0) {
        contenedorMotos.innerHTML = "<p>No hay motocicletas en esta categoría.</p>";
        return;
    }

    motosFiltradas.forEach(moto => {
        const tarjeta = document.createElement('article');
        tarjeta.classList.add('tarjeta-moto');
        tarjeta.innerHTML = `
            <img src="${moto.imagen}" alt="${moto.nombre}">
            <div class="info-moto">
                <h3>${moto.nombre}</h3>
                <p>${moto.descripcion}</p>
                <p class="precio">${moto.precio}</p>
                <button class="btn-cotizar" onclick="seleccionarParaCotizar('${moto.nombre}')">Cotizar Ahora</button>
            </div>
        `;
        contenedorMotos.appendChild(tarjeta);
    });
}

// 3. Lógica del Filtro de Categorías
filtroTipo.addEventListener('change', (e) => {
    const categoria = e.target.value;
    if (categoria === "todos") {
        renderizarMotos(todasLasMotos);
    } else {
        const filtradas = todasLasMotos.filter(moto => moto.tipo === categoria);
        renderizarMotos(filtradas);
    }
});

// 4. Autocompletar formulario
function seleccionarParaCotizar(nombreMoto) {
    document.getElementById('moto-interes').value = nombreMoto;
    document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
}

// 5. Enviar la cotización e INSERTARLA en la base de datos
formCotizacion.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const datosEnvio = {
        nombre_cliente: document.getElementById('nombre').value,
        moto_interes: document.getElementById('moto-interes').value,
        celular: document.getElementById('whatsapp').value
    };

    try {
        const respuesta = await fetch(`${API_URL}/cotizaciones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosEnvio)
        });
        
        const resultado = await respuesta.json();
        alert(resultado.mensaje);
        formCotizacion.reset();
    } catch (error) {
        console.error("Error al guardar la cotización:", error);
        alert("No se pudo conectar con el servidor para guardar la cotización.");
    }
});

// Inicializar la carga al abrir la app
document.addEventListener('DOMContentLoaded', cargarMotosDesdeBD);