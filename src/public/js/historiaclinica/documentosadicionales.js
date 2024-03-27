(function validardocuements() {
    const btnSubir = document.getElementById('btnSubir');
    const fileInput = document.getElementById('archivos');
    const btnEliminar = document.getElementById('btnEliminar');
    fileInput.addEventListener('change', (event) => {
        const selectedFiles = event.target.files;

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes('.' + fileExtension)) {
                mensaje('error', 'El archivo ' + file.name + ' no es un tipo de archivo permitido.', 2000);
                fileInput.value = '';
                const miniaturasDiv = document.getElementById("miniaturas");
                miniaturasDiv.innerHTML = "";
                return;
            } else {
                mostrarMiniaturas();
                btnSubir.disabled = false;
                btnEliminar.disabled = true;
            }

        }
    });
})();

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
            pdfIcon.innerHTML = `<img src="/img/pdficono.webp" width="90" height="90">`;
            miniaturaDiv.appendChild(pdfIcon);
            miniaturasDict[archivo.name] = pdfIcon;
        } else {
            const imgIcon = document.createElement("a");
            imgIcon.href = URL.createObjectURL(archivo);
            imgIcon.target = "_blank";
            imgIcon.innerHTML = `<img src="/img/imgicono.webp" width="90" height="90">`;
            miniaturaDiv.appendChild(imgIcon);
            miniaturasDict[archivo.name] = imgIcon;
        }

        const nombreArchivoParrafo = document.createElement("p");
        nombreArchivoParrafo.textContent = archivo.name;
        miniaturaDiv.appendChild(nombreArchivoParrafo);

        miniaturasDiv.appendChild(miniaturaDiv);
    }
}

function SubirDocumento() {
    const btnSubir = document.getElementById('btnSubir');
    const btnEliminar = document.getElementById('btnEliminar');
    const fileInput = document.getElementById('archivos');
    btnSubir.disabled = true;
    btnSubir.innerHTML = `
        <lottie-player src="/img/jsonimg/btnloading.json" background="transparent"
            speed="1" style="height: 35px;" loop autoplay>
        </lottie-player>`;

    // Obtener el div con el id "miniaturas"
    const miniaturasDiv = document.getElementById("miniaturas");
    // Obtener todos los elementos con la clase "archivo-item" dentro del div
    const archivoItems = miniaturasDiv.getElementsByClassName("archivo-item");
    // Función para convertir una URL de archivo a Base64
    async function urlToBase64(url) {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    // Almacenar los archivos en un objeto
    const archivosBase64 = {};
    let cita_id = document.getElementById('id').value;
    let soexa = document.getElementById('soexa').value;
    let codpru_id = document.getElementById('codpru_id').value;

    let tipoExtension = '';
    const nombreArchivo = fileInput.files[0].name;
    const extension = nombreArchivo.split('.').pop();
    tipoExtension = extension.toLowerCase();

    // Función para convertir una imagen a PDF
    async function imagenAPDF(url) {
        const pdfDoc = await PDFLib.PDFDocument.create();
        const img = await pdfDoc.embedJpg(url);
        const page = pdfDoc.addPage([img.width, img.height]);
        page.drawImage(img, {
            x: 0,
            y: 0,
            width: img.width,
            height: img.height,
        });
        return await pdfDoc.save();
    }

    (async () => {
        for (const archivoItem of archivoItems) {
            const enlace = archivoItem.querySelector("a");
            const url = enlace.getAttribute("href");
            const nombreArchivo = archivoItem.querySelector("p").textContent;

            try {
                let base64Data;
                // Si la extensión es de imagen, conviértela a PDF
                if (['jpg', 'jpeg', 'png', 'gif'].includes(tipoExtension)) {
                    base64Data = await imagenAPDF(url);
                } else {
                    base64Data = await urlToBase64(url);
                }
                archivosBase64[nombreArchivo] = base64Data;
            } catch (error) {
                console.error(`Error al convertir ${nombreArchivo} a Base64:`, error);
            }
        }

        const datosAEnviar = {
            cita_id: cita_id,
            soexa: soexa,
            codpru_id: codpru_id,
            archivosBase64: archivosBase64,
            tipoExtension: tipoExtension
        };
        $.ajax({
            url: '/subirdocumento', // Asegúrate de que la URL sea la correcta
            method: "POST",
            data: JSON.stringify(datosAEnviar),
            contentType: 'application/json',
            success: function (lista) {
                let doc_adic_id = document.getElementById('doc_adic_id');
                doc_adic_id.value = lista[0].doc_adic_id;
                if (lista[0].icono === 'success') {
                    miniaturasDiv.style.display = "";
                    fileInput.disabled = true;
                    btnEliminar.disabled = false;
                }
                mensaje(lista[0].icono, lista[0].mensaje, 1500);
            },
            error: function () {
                alert('Error al subir los archivos');
                fileInput.disabled = false;
            },
            complete: function () {
                btnSubir.innerHTML = '<i class="fa-solid fa-upload" style="margin: 8px 12px;">';
            }
        });
    })();
}


function EliminarDocumento() {
    let doc_adic_id = document.getElementById('doc_adic_id');
    const miniaturasDiv = document.getElementById("miniaturas");
    const fileInput = document.getElementById('archivos');
    const btnEliminar = document.getElementById('btnEliminar');
    let cita_id = document.getElementById('id').value;
    let soexa = document.getElementById('soexa').value;
    let codpru_id = document.getElementById('codpru_id').value;
    btnEliminar.innerHTML = `
        <lottie-player src="/img/jsonimg/btnloading.json" background="transparent"
            speed="1" style="height: 35px;" loop autoplay>
        </lottie-player>`;
    $.ajax({
        url: '/eliminardocumento', // Asegúrate de que la URL sea la correcta
        method: "DELETE",
        data: {
            cita_id: cita_id,
            soexa: soexa,
            codpru_id: codpru_id,
            doc_adic_id: doc_adic_id.value
        },
        success: function (lista) {
            if (lista[0].icono === 'success') {
                miniaturasDiv.style.display = "none";
                fileInput.disabled = false;
                btnEliminar.disabled = true;
                doc_adic_id.value = 0;
            }
            mensaje(lista[0].icono, lista[0].mensaje, 1500);
        },
        error: function () {
            mensaje('error', 'error al eliminar archivo', 1500);
        },
        complete: function () {
            btnEliminar.innerHTML = '<i class="fa-solid fa-eraser" style="margin: 8px 12px;"></i>';
        }
    });
}


