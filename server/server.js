const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require("cors");

const app = express();

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const chessPuzzlesRouter = require('./routes/chessPuzzles.router');

/* Routes */
app.use('/api/chessPuzzles', chessPuzzlesRouter);

// Serve static files
// app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});