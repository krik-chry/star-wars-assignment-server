const express = require('express');
const cors = require('cors');

const router = require('./routes');

const app = express();
const port = 4000;
const corsMiddleware = cors();

app.use(corsMiddleware);
app.use(router);

app.listen(port, () => console.log(`App listening to port ${port}`));
