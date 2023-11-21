(function getarbolpruebas() {
    const id = document.getElementById('id').value;
    const soexa = document.getElementById('soexa').value;
    $.ajax({
        url: '/arbolpruebas/' + id + '/' + soexa,
        method: "GET",
        success: function (pruebas) {
            let menuexamenes = $('#menuexamenes');
            menuexamenes.html('');

            // Crear un objeto para agrupar las opciones
            const groupedOptions = {};
            // Iterar sobre el JSON y agrupar por 'desexa'
            pruebas.forEach((item, index) => {
                const desexa = item.desexa;
                const desexadet = item.desexadet;

                // Si la opción no existe en el objeto agrupado, crea un array vacío
                if (!groupedOptions[desexa]) {
                    groupedOptions[desexa] = [];
                }
                // Agrega la subopción al array correspondiente
                groupedOptions[desexa].push(desexadet);
            });

            // Iterar sobre el objeto agrupado y crear la navegación con el formato deseado
            for (const desexa in groupedOptions) {
                const opcionId = desexa.toLowerCase().replace(/ /g, '-'); // Crea un ID a partir de desexa
                const subopciones = groupedOptions[desexa].map(subopcion => {
                    const ruta = pruebas.find(prueba => prueba.desexadet === subopcion);
                    return `
                        <a class="nav-link opcionprueba collapsed" href="${ruta.ruta}" data-bs-target="#${opcionId}Collapse"
                            aria-expanded="false" aria-controls="${opcionId}Collapse" >
                            ${subopcion}
                            <div class="sb-sidenav-collapse-arrow"></div>
                        </a>`;
                }).join('');

                const opcionHtml = `
                    <a class="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#${opcionId}"
                        aria-expanded="false" aria-controls="${opcionId}" style="transition: background-color 0.3s;">
                        <div class="sb-nav-link-icon"><i style="color: #FFCB3D;" class="fa-solid fa-folder-plus"></i></div>
                        ${desexa}
                        <div class="sb-sidenav-collapse-arrow"><i style="color: black;" class="fas fa-angle-down"></i></div>
                    </a>
                    <div class="collapse" id="${opcionId}" data-bs-parent="#sidenavAccordion">
                        <nav class="sb-sidenav-menu-nested nav accordion" id="${opcionId}Collapse">
                            ${subopciones}
                        </nav>
                    </div>`;

                menuexamenes.append(opcionHtml);
            }
            renderprueba();
        },
        error: function () {
            $('#error-message').text('Se produjo un error al cargar los protocolos.');
        }
    });

})()



$(document).ready(function () {
    asignarimagen();
});

function asignarimagen() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    let originalImageSrc = '/img/usuario/default.webp';
    const originalImage = new Image();
    originalImage.onload = function () {
        drawImageOnCanvas(originalImage);
    };
    originalImage.src = originalImageSrc;

    function drawImageOnCanvas(image) {
        const size = 300; // Tamaño fijo para el canvas
        context.clearRect(0, 0, size, size);
        context.save();
        context.beginPath();
        context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        context.closePath();
        context.clip();
        context.drawImage(image, 0, 0, size, size);
        context.restore();
    }
}


