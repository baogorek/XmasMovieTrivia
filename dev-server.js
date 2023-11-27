const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use('/hellow_pwa', express.static(path.join(__dirname, '.')));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/hellow_pwa`);
});
