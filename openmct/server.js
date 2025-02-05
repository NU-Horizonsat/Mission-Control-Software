const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public'))); // Where OpenMCT build might live

// If you want to serve index.html directly:
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`OpenMCT server running at http://localhost:${PORT}`);
});
