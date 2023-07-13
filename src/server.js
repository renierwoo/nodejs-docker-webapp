'use strict';

const express = require('express');
const morgan = require('morgan');

// Constants
const PORT = 80;
const HOST = '0.0.0.0';

// App
const app = express();

// Parse JSON request body
app.use(express.json());

app.use(morgan('combined'));

app.post('/api/users', (req, res) => {
    // Access request body data
    const { name, email } = req.body;

    // Perform any necessary operations with the data
    // For example, save the user to a database

    // Send a response
    res.send(`User ${name} with email ${email} created successfully.`);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});