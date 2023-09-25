const { getConnection } = require('../database/conexionsql');
const passport = require('passport');

module.exports = {
    async postiniciarSesion(req, res, next) {
        passport.authenticate('local.iniciarsesion', (err, user, info) => {
            if (err) {
                // Ocurrió un error durante la autenticación
                return next(err);
            }
            if (!user) {
                // La autenticación falló, envía un JSON al frontend
                return res.json('error');
            }
            // Autenticación exitosa, inicia sesión en el objeto de solicitud
            req.login(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            });
        })(req, res, next);
    },

    async CerrarSesion(req, res) {
        req.logOut();
        res.redirect('/iniciarsesion');
    },

    async postgrupousuario(req, res) {
        const { nomrol } = req.body;
        const usenam = '';
        const hostname = '';
        const pool = await getConnection();
        await pool.query(`sp_insRolsistema '${nomrol.toUpperCase()}','${usenam}','${hostname}'`);
        res.json('completado');
    },

};