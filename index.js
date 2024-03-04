// Setup application configuration before starting the server
require('./src/config/setup').setup();

// Load required modules
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

// Load route handlers
const toppingRoutes = require('./src/routes/toppingRoutes');
const recipeRoutes = require('./src/routes/recipeRoutes');

// Initialize Express app
const app = express();

// Use environment variable for port or default to 5500
const port = process.env.PORT || 5500;

// Configure view engine and views directory for server-side templating
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Use bodyParser middleware to parse request bodies to JSON
app.use(bodyParser.json());

// Define routes for specific paths
app.use('/owner/toppings', toppingRoutes);
app.use('/chef/recipes', recipeRoutes);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Start server on specified port
app.listen(port, () => console.log(`Server running on port: ${port}`));
