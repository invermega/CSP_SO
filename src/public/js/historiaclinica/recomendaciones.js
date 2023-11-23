function obtenerDataInsRec() {
    var table = document.getElementById('tablerecoemndaciones');
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var datainsrec = [];

    for (var i = 0; i < rows.length; i++) {
        var input = rows[i].getElementsByTagName('input');

        if (input.length >= 2 && input[1].value.trim() !== '') {
            var inputord_item = input[0].value;
            var inputrecomendacion = input[1].value;
            var inputcontrol = input[2].value;
            var rowDatarec = {
                ord_item: inputord_item,
                recomen: inputrecomendacion,
                controlrec: inputcontrol
            };
            datainsrec.push(rowDatarec);
        }
    }

    return datainsrec;
}
