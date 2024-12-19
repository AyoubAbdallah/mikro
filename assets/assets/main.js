import express from 'express';
import path from 'path';
import fs from 'fs';
import open from 'open';

const app = express();

// Serve static files like images, CSS, JS, etc.
app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
app.use('/includes', express.static(path.join(process.cwd(), 'includes')));

// Function to include the header dynamically
function includeHeader(filePath, res) {
  fs.readFile(path.join(process.cwd(), 'includes', 'header.html'), 'utf8', (err, headerContent) => {
    if (err) {
      console.error('Error reading header file:', err);
      res.status(500).send('Error reading header file');
      return;
    }

    fs.readFile(filePath, 'utf8', (err, htmlContent) => {
      if (err) {
        console.error('Error reading HTML file:', err);
        res.status(404).send('HTML file not found');
        return;
      }

      // Inject the header content into the placeholder
      const injectedContent = htmlContent.replace('<header-placeholder></header-placeholder>', headerContent);

      // Send the final HTML with the injected header
      res.send(injectedContent);
    });
  });
}

// Default route to serve the main page (Galeri.html or any other page you want to be the default)
app.get('/', (req, res) => {
  includeHeader(path.join(process.cwd(), 'index.html'), res);
});

// Generic route to serve any .html page with the header injected
app.get('/:page.html', (req, res) => {
  const page = req.params.page + '.html';
  const filePath = path.join(process.cwd(), page);
  includeHeader(filePath, res);
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
  open('http://localhost:3000/');
});
