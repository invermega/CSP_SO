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
    //render de configuracion
    async renderusuario(req, res) {
        const parametro="US";
        permisos(parametro, 'configuracion/usuario',req,res)

    },
    async renderroles(req, res) {
        const parametro="PE"
        permisos(parametro,'configuracion/permisos',req,res);
    },
    //historiaclinica
    async renderpacientes(req, res) {
        const parametro ="PC" ;
        permisos(parametro,'historiaclinica/paciente', req,res)

    },
    //entidades
    renderprotocolo(req, res) {
        const parametro = "PT";
        permisos(parametro, 'entidades/protocolo', req, res)
    },
};

