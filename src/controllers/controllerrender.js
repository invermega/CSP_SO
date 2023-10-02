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
        res.render('configuracion/usuario', { layout: false });
    },
    async renderroles(req, res) {
        res.render('configuracion/permisos', { layout: false });
    },
    //historiaclinica
    async renderpacientes(req, res) {
        res.render('historiaclinica/paciente', { layout: false });
    },
    //entidades
    async renderprotocolo(req, res) {
        res.render('entidades/protocolo', { layout: false });
    },
    
    
};