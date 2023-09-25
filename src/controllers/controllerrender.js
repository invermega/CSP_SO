module.exports = {
    //render de Bienvenida
    async getIniciarSesion(req, res) {
        res.render('auth/iniciarsesion', { layout: false });
    },
    //inicio
    async getbienvenida(req, res) {
        res.render('inicio');
    },
    //render de configuracion
    async getconfiguracion(req, res) {
        res.render('configuracion/usuario');
    },
};