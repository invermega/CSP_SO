module.exports = {
    //render de Bienvenida
    async renderIniciarSesion(req, res) {
        res.render('auth/iniciarsesion', { layout: false });
    },
    async renderbienvenida(req, res) {
        res.render('inicio');
    },
    //render de configuracion
    async getconfiguracion(req, res) {
        res.render('configuracion/usuario');
    },
    //configuracion
    async renderroles(req, res) {
        res.render('configuracion/permisos', { layout: false });
    },

};