import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import imageSize from 'image-size';
import { exec } from 'child_process';
import logger from './features/support/logger.js';

logger.info('__dirname: ' + __dirname);

const screenshotsDir = path.join(__dirname, 'screenshots');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const outputPdf = path.join(__dirname, `screenshots-report-${timestamp}.pdf`);
const deleteScreenshots = true;

logger.info('Screenshots Directory: ' + screenshotsDir);

// Check if screenshots folder exists
if (!fs.existsSync(screenshotsDir)) {
  logger.error('Screenshots directory does not exist.');
  process.exit(1);
}

const images = fs.readdirSync(screenshotsDir).filter(file => /\.(png|jpe?g)$/i.test(file));
if (images.length === 0) {
  logger.warn('No images found in screenshots directory.');
  process.exit(1);
}

const doc = new PDFDocument({ autoFirstPage: false });
const writeStream = fs.createWriteStream(outputPdf);
doc.pipe(writeStream);

images.forEach(image => {
  const imagePath = path.join(screenshotsDir, image);
  try {
    const buffer = fs.readFileSync(imagePath);
    const dimensions = imageSize(buffer);

    doc.addPage({
      size: [dimensions.width, dimensions.height]
    }).image(imagePath, 0, 0);
    logger.info(`Added image to PDF: ${image}`);
  } catch (err) {
    logger.error(`Error processing ${image}: ${err.message}`);
  }
});

doc.end();

writeStream.on('finish', () => {
  logger.info(`PDF created: ${outputPdf}`);

  if (deleteScreenshots) {
    images.forEach(img => {
      fs.unlinkSync(path.join(screenshotsDir, img));
      logger.info(`Deleted screenshot: ${img}`);
    });
    logger.info('All screenshots deleted after PDF generation.');
  }

  const openCommand = process.platform === 'win32' ? `start "" "${outputPdf}"` : process.platform === 'darwin' ? `open "${outputPdf}"` : `xdg-open "${outputPdf}"`;
  exec(openCommand, (err) => {
    if (err) {
      logger.error(`Failed to open PDF: ${err.message}`);
    } else {
      logger.info('PDF opened successfully.');
    }
  });
});

writeStream.on('error', (err) => {
  logger.error(`Error writing PDF: ${err.message}`);
});