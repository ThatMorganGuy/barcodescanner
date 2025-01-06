const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3001;

// Serve static files from the public directory
app.use(express.static('public'));
app.use(express.static('.')); // This allows serving files from root as well

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 