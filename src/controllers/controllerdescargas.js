//src/templates/
const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const mustache = require('mustache');
const { PDFDocument } = require('pdf-lib');

module.exports = {
    async getexportarinforme(req, res) {
        try {
            const examenes = req.query.examenes;

            // Crear un array para almacenar los buffers de PDFs generados
            const pdfBuffers = [];

            // Configurar Puppeteer con el nuevo modo Headless
            const browser = await puppeteer.launch({ headless: "new" });

            // Iterar sobre los códigos de examen y cargar la plantilla HTML correspondiente
            for (const codigo of examenes) {
                const htmlPath = `src/templates/${codigo}.html`; // Asume que tienes archivos HTML con nombres como '001.html', '003.html', etc.
                const htmlTemplate = await fs.readFile(htmlPath, 'utf-8');

                // Datos específicos para la plantilla
                const data = {
                    codigo: codigo,
                    fecha: '2023-11-30', // Puedes proporcionar la fecha actual u otra fecha específica
                    // Otros datos...
                };

                // Reemplazar las variables en la plantilla con los datos específicos
                const renderedHtml = mustache.render(htmlTemplate, data);

                // Crear un PDF desde la plantilla HTML
                const page = await browser.newPage();
                await page.setContent(renderedHtml);
                const pdfBuffer = await page.pdf({ format: 'A4' });

                // Agregar el buffer del PDF al array
                pdfBuffers.push(pdfBuffer);
            }

            // Cerrar la instancia de Puppeteer
            await browser.close();

            // Combinar los buffers de PDF en uno solo
            const combinedPdfBuffer = await mergePDFs(pdfBuffers);

            // Devolver el PDF combinado al navegador como descarga
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=combined_output.pdf');
            res.end(combinedPdfBuffer);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Error al generar el PDF');
        }
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
}


