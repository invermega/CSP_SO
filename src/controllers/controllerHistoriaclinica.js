const { getConnection } = require('../database/conexionsql');

module.exports = {
    /*****************Pacientes citados*****************/
    async getcmbexamen(req, res) {
        const pool = await getConnection();
        const examenes = await pool.query(`pa_SelCmbExamenes`);
        res.json(examenes.recordset);
    },
    async getpacientescitados(req, res) {
        let { fechainicio, fechafin, paciente, estado, examen } = req.query;
        if (paciente === '') {
            paciente = '%';
        }
        const pool = await getConnection();
        const pacientescitados = await pool.query(`pa_SelPacientesCitados '${fechainicio}','${fechafin}','${paciente}','${estado}','${examen}'`);
        if (pacientescitados.recordset === undefined) {
            res.json([]);
        } else {
            res.json(pacientescitados.recordset);
        }
    },

    async getpacienteexamen(req, res) {
        const { id } = req.params;
        const pool = await getConnection();
        const pruebas = await pool.query(`pa_SelPacienteExamen '${id}'`);
        res.json(pruebas.recordset);
    },
    async getarbolpruebas(req, res) {
        const { id, opcion } = req.params;
        const pool = await getConnection();
        const pruebas = await pool.query(`pa_SelMenuExamenes '${id}','${opcion}'`);
        res.json(pruebas.recordset);
    },
    async getcie10(req, res) {
        let { cie10 } = req.query;
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const cie10unique = await pool.query(`pa_Selcie10unique '${cie10}','${codrolUser}'`);
        res.json(cie10unique.recordset);
    },
    async getcie10list(req, res) {
        let { cie10 } = req.query;
        const codrolUser = req.user.codrol;
        const pool = await getConnection();
        const cie10list = await pool.query(`pa_Selcie10list '${cie10}','${codrolUser}'`);
        res.json(cie10list.recordset);
    },
    async postdocumento(req, res) {
        try {
            const { archivosBase64 } = req.body;
            const codrolUser = req.user.codrol;
            const pool = await getConnection();
            const documento = await pool.query(`pa_InsDocumento '${archivosBase64}','${codrolUser}'`);
            res.json(documento.recordset);
        } catch (error) {
            console.error("Error en la función postDocumento:", error);
            res.status(500).json({ error: "Error en el servidor" });
        }
    },
    async deldocumento(req, res) {
        try {
            const doc_adic_id = req.body.doc_adic_id;
            const codrolUser = req.user.codrol;
            console.log(doc_adic_id,codrolUser);
            const pool = await getConnection();
            const documento = await pool.query(`pa_DelDocumento '${doc_adic_id}','${codrolUser}'`);
            res.json(documento.recordset);
        } catch (error) {
            console.error("Error en la función postDocumento:", error);
            res.status(500).json({ error: "Error en el servidor" });
        }
    },




    /***************************************************/

};