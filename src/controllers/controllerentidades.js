const { getConnection } = require('../database/conexionsql');
const helpers = require('../lib/helpers');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

module.exports = {

    /************Paciente*******/
    async getPacienteCombos(req, res) {//llenar los combos de formulario       
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const response = await pool.query(`sp_selCombosPaciente '${codrolUser}'`);
        res.json(response.recordset);
    },
    async getDistrito(req, res) {//Modal de busqueda de Distrito
        const { parametro } = req.query;
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const response = await pool.query(`sp_selDistrito '${codrolUser}','${parametro}'`);
        res.json(response.recordset);
    },
    async getPais(req, res) {//Modal de busqueda de Pais
        const { parametro } = req.query;
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const response = await pool.query(`sp_selPais '${codrolUser}','${parametro}'`);
        res.json(response.recordset);
    },


    async postpaciente(req, res) {//agregar usuario
        const { usuario, contrasena, celular, app, apm, Nombres, fecnac, DNI, correo, direccion, sexo, codrol, iduser, opc, picuser } = req.body;
        //console.log(req.body);
        const passencrypt = await helpers.EncriptarPass(contrasena);
        const usenam = '';
        const hostname = '';
        const codrolUser = 1;
        const imagenBase64 = picuser;
        const rutaSalida = path.join(__dirname, '..', 'public', 'img', 'usuario', DNI + '.webp');
        if (fs.existsSync(rutaSalida)) {
            fs.unlinkSync(rutaSalida);
        }
        const imagenBase64SinPrefijo = imagenBase64.replace(/^data:image\/png;base64,/, '');
        const imagenBinaria = Buffer.from(imagenBase64SinPrefijo, 'base64');
        await sharp(imagenBinaria)
            .toFormat('webp')
            .toFile(rutaSalida);
        const pool = await getConnection();
        const response = await pool.query(`sp_insUsuario '${usuario.toUpperCase()}','${passencrypt}',${celular},'${app.toUpperCase()}','${apm.toUpperCase()}','${Nombres.toUpperCase()}','${DNI}','${fecnac}','${correo.toUpperCase()}','${direccion.toUpperCase()}','${codrol}', '${sexo.toUpperCase()}','${usenam}','${hostname}','${codrolUser}','${iduser}','${opc}'`);
        console.log(response.recordset);
        res.json(response.recordset);
    },
    async getusuarios(req, res) {//listar usuario para edicion
        const { parametro } = req.query;
        const codrolUser = 1;
        const pool = await getConnection();
        const response = await pool.query(`sp_selusuarios '${codrolUser}','${parametro}'`);

        res.json(response.recordset);
    },
    async deleteusuarios(req, res) {//eliminar usuario
        const { iduser } = req.body;
        const codrolUser = 1;
        const pool = await getConnection();
        const response = await pool.query(`sp_delUsuario '${codrolUser}','${iduser}'`);

        res.json(response.recordset);
    },
    async resetpass(req, res) {//resetear contraseña
        const { iduser } = req.body;        
        const codrolUser = 1;
        const pool = await getConnection();
        const user = req.user.usuario;
        const passencrypt = await helpers.EncriptarPass(user);
        const response = await pool.query(`sp_editPassUser '${codrolUser}','${iduser}','${passencrypt}'`);

        res.json(response.recordset);
    },
    /*************************/
}