
const { getConnection } = require('../database/conexionsql');
const sql = require('mssql');
const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const mustache = require('mustache');
const { PDFDocument } = require('pdf-lib');
const archiver = require('archiver');
const { Readable } = require('stream');

module.exports = {
    async getexportarinformeconsolidado(req, res) {
        try {
            const examenes = req.query.examenes;
            const citas_id = req.query.citas_id;
    
            // Verificar si citas_id es un array y está definido
            if (Array.isArray(citas_id) && citas_id.length > 0) {
                // Configurar Puppeteer con el nuevo modo Headless
                const browser = await puppeteer.launch({ headless: "new" });
    
                res.setHeader('Content-Type', 'application/zip');
                res.setHeader('Content-Disposition', 'attachment; filename=archived_output.zip');
    
                // Crear un objeto Archiver
                const archive = archiver('zip', {
                    zlib: { level: 9 } // Configuración de compresión máxima
                });
    
                // Pipe el archivo ZIP directamente a la respuesta
                archive.pipe(res);
    
                // Iterar sobre cada ID en el array
                for (const id of citas_id) {
                    // Crear un PDF combinado para cada ID
                    const pdfBuffers = [];
    
                    // Iterar sobre cada código de examen
                    for (const codigo of examenes) {
                        const htmlPath = `src/templates/${codigo}.html`;
                        const htmlTemplate = await fs.readFile(htmlPath, 'utf-8');
    
                        const data = {
                            codigo: codigo,
                            fecha: '2023-11-30',
                            // Otros datos...
                        };
    
                        const renderedHtml = mustache.render(htmlTemplate, data);
    
                        const page = await browser.newPage();
                        await page.setContent(renderedHtml);
                        const pdfBuffer = await page.pdf({ format: 'A4',printBackground: true, });
    
                        // Agregar el buffer del PDF al array
                        pdfBuffers.push(pdfBuffer);
                    }
    
                    // Combinar los buffers de PDF en uno solo
                    const combinedPdfBuffer = await mergePDFs(pdfBuffers);
    
                    // Convertir el PDF combinado a Buffer antes de añadirlo al ZIP
                    const combinedPdfBufferStream = new Readable();
                    combinedPdfBufferStream.push(combinedPdfBuffer);
                    combinedPdfBufferStream.push(null);
    
                    // Añadir el PDF combinado al ZIP con el nombre del ID
                    archive.append(combinedPdfBufferStream, { name: `${id}.pdf` });
                }
    
                // Cerrar la instancia de Puppeteer
                await browser.close();
    
                // Finalizar y cerrar el archivo ZIP
                archive.finalize();
            } else {
                res.status(400).send('Error: El parámetro citas_id no es un array válido o está vacío.');
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Error al generar el ZIP');
        }
    },

    async getexportarinformedetalle(req, res) {
        try {
            const examenes = req.query.examenes;
            const citas_id = req.query.citas_id;
    
            // Verificar si citas_id es un array y está definido
            if (Array.isArray(citas_id) && citas_id.length > 0) {
                // Crear un objeto Archiver
                const archive = archiver('zip', {
                    zlib: { level: 9 } // Configuración de compresión máxima
                });
    
                // Configurar Puppeteer con el nuevo modo Headless
                const browser = await puppeteer.launch({ headless: "new" });
    
                res.setHeader('Content-Type', 'application/zip');
                res.setHeader('Content-Disposition', 'attachment; filename=archived_output.zip');
    
                // Pipe el archivo ZIP directamente a la respuesta
                archive.pipe(res);
    
                // Iterar sobre cada ID en el array
                for (const id of citas_id) {
                    // Crear un subdirectorio para cada ID dentro del ZIP
                    archive.directory(`./${id}`, id);
    
                    // Iterar sobre cada código de examen
                    for (const codigo of examenes) {
                        const htmlPath = `src/templates/${codigo}.html`;
                        const htmlTemplate = await fs.readFile(htmlPath, 'utf-8');
    
                        const data = {
                            codigo: codigo,
                            fecha: '2023-11-30',
                            // Otros datos...
                        };
    
                        const renderedHtml = mustache.render(htmlTemplate, data);
    
                        const page = await browser.newPage();
                        await page.setContent(renderedHtml);
                        const pdfBuffer = await page.pdf({ format: 'A4',printBackground: true, });
    
                        // Añadir el PDF al subdirectorio del ID
                        archive.append(pdfBuffer, { name: `${id}/${codigo}.pdf` });
                    }
                }
    
                // Cerrar la instancia de Puppeteer
                await browser.close();
    
                // Finalizar y cerrar el archivo ZIP
                archive.finalize();
            } else {
                res.status(400).send('Error: El parámetro citas_id no es un array válido o está vacío.');
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Error al generar el ZIP');
        }
    },

    async getdescargapruebas(req, res) {
        const { id } = req.params;
        console.log(id);
        const pool = await getConnection();
        const pruebas = await pool.query(`pa_SelDescargaExamenes '${id}'`);
        res.json(pruebas.recordset);
    },
};

// Función para combinar varios PDFs en uno solo
async function mergePDFs(pdfBuffers) {
    const combinedPdfDoc = await PDFDocument.create();
    
    for (const pdfBuffer of pdfBuffers) {
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const copiedPages = await combinedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => combinedPdfDoc.addPage(page));
    }
    return combinedPdfDoc.save();
};




