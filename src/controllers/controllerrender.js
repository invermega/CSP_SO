const { getConnection } = require('../database/conexionsql');

function permisos(parametro) {
    return true;
}

module.exports = {
    //render de Bienvenida   
    async renderIniciarSesion(req, res) {
        res.render('auth/iniciarsesion', { layout: false });
    },
    async renderbienvenida(req, res) {
        res.render('inicio');
    },
    //configuracion
    async renderroles(req, res) {
        res.render('configuracion/permisos', { layout: false });
    },
    //historiaclinica
    async renderpacientes(req, res) {
        res.render('historiaclinica/paciente', { layout: false });
    },
    //entidades
    renderprotocolo(req, res) {
        const parametro = "US";
        if (permisos(parametro)) { 
            res.render('entidades/protocolo', { layout: false });
        } else {
            res.render('configuracion/401', { layout: false });
        }
    },
};


