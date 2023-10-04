$(document).ready(function () {
    filtrosMostrarOcultar("btnfiltros", "filtros");

    document.getElementById("limpiarempleado").addEventListener("click", function () {
        var dniempleado = document.getElementById("dniempleado");
        dniempleado.value = "";
        dniempleado.disabled = false;

        var nomempleado = document.getElementById("nomempleado");
        nomempleado.value = "";
    });

    const inputArchivos = document.getElementById("archivos");
    inputArchivos.addEventListener("change", mostrarMiniaturas);
    const fileInput = document.getElementById('archivos');
    fileInput.addEventListener('change', (event) => {
        const selectedFiles = event.target.files;

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const allowedExtensions = ['.pdf'];
            const fileExtension = file.name.split('.').pop().toLowerCase();

            if (!allowedExtensions.includes('.' + fileExtension)) {
                mensaje('error', 'El archivo ' + file.name + ' no es un PDF.', 2000);
                // Limpiar el input de archivo para eliminar los archivos no deseados
                fileInput.value = '';
                const miniaturasDiv = document.getElementById("miniaturas");
                miniaturasDiv.innerHTML = "";
                return;
            }
        }
    });
});

function mostrarMiniaturas() {
    const miniaturasDict = {};
    const input = document.getElementById("archivos");
    const miniaturasDiv = document.getElementById("miniaturas");

    miniaturasDiv.innerHTML = "";

    for (let i = 0; i < input.files.length; i++) {
        const archivo = input.files[i];
        const tipoArchivo = archivo.type;

        const miniaturaDiv = document.createElement("div");
        miniaturaDiv.className = "archivo-item";

        if (tipoArchivo === "application/pdf") {
            const pdfIcon = document.createElement("a");
            pdfIcon.href = URL.createObjectURL(archivo);
            pdfIcon.target = "_blank"; // Open link in a new tab
            pdfIcon.innerHTML = `<img src="../img/pdficono.webp" width="90" height="90">`;
            miniaturaDiv.appendChild(pdfIcon);
            miniaturasDict[archivo.name] = pdfIcon;
        }

        const nombreArchivoParrafo = document.createElement("p");
        nombreArchivoParrafo.textContent = archivo.name;
        miniaturaDiv.appendChild(nombreArchivoParrafo);

        miniaturasDiv.appendChild(miniaturaDiv);
    }
}

