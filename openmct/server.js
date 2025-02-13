const express = require('express');
const path = require('path');

const app = express();

// 1) Serve node_modules so /node_modules/openmct/dist/openmct.js is accessible
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// 2) Serve your plugin scripts if they are in the same folder
app.use(express.static(__dirname)); 
// or app.use('/', express.static(path.join(__dirname, 'public')));

// 3) If you have an index.html in this same directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`OpenMCT server running at http://localhost:${PORT}`);
});
