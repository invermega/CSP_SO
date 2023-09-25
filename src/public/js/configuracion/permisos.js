function guardarrol() {
    let newrol = $('#newrol');
    $.ajax({
      url: '/grupousuario',
      method: "POST",
      data: {
        nomrol: newrol.val()
      },
      success: function (lista) {
        mensaje('success', 'Guardado correctamente', 1000);
        //getpermisos();
        $('input[type="text"]').val("");
        var btncerrar = document.getElementById('cerrar');
        btncerrar.click();
      },
      error: function () {
        alert('error');
      }
    });
  }