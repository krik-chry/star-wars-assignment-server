// Dependencies imports
const express = require('express');
const cors = require('cors');

// Files imports
const router = require('./routes');

// Initialize app and setup cors middleware
const app = express();
const port = process.env.PORT || 4000;
const corsMiddleware = cors();

app.use(corsMiddleware);
app.use(router);

app.listen(port, () => console.log(`App listening to port ${port}`));
