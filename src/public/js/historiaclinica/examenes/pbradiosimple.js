function Grabar(){
    const btnGrabar = document.getElementById("btnGrabar");
    btnGrabar.disabled =  true;
    btnGrabar.innerHTML = `<lottie-player src="/img/jsonimg/btnloading.json" background="transparent"
    speed="1" style="width: 38px; height: 35px;" loop
    autoplay></lottie-player>` 
    let incluirIds = 'inprs';
    validarFormulario2(incluirIds);
    let inprs = document.getElementById("inprs").value;
    let inprs1 = $('#inprs').val();
    if (!inprs) {
        btnGrabar.disabled = false;
        mensaje('error', 'Por favor, complete todos los campos antes de continuar.', 1500);
        btnGrabar.innerHTML = `<i class="fa-regular fa-floppy-disk" style="margin: 8px 12px;">`
        return;
    } else {
        console.log("grabando");
        console.log(inprs,inprs1);
    }  
}