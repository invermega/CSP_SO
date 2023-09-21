

module.exports = {
    //render de Bienvenida
    async getIniciarSesion(req, res) {
        res.render('auth/iniciarsesion', { layout: false });
    },
    async getbienvenida(req, res) {
        res.render('inicio');
    },

};