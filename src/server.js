'use strict';

const express = require('express');
const morgan = require('morgan');

// Define a custom middleware for logging the request body.
const logRequestBody = (req, res, next) => {
    // Logs the request body
    console.log('Request Body:', req.body);

    // Calls the next middleware
    next();
};

// Constants
const PORT = 80;
const HOST = '0.0.0.0';

// Create an instance of the Express application.
const app = express();

// Define a custom middleware to exclude Kubernetes probes from logging.
const skipKubernetesProbe = (req, res) => {
    return req.headers['user-agent'].startsWith('kube-probe');
};

// Parse JSON request body
app.use(express.json());

// Configure Morgan with the custom middleware.
app.use(morgan('combined', { skip: skipKubernetesProbe }));

app.use(logRequestBody);

app.post('/api/users', (req, res) => {
    // Access request body data
    const { name, email } = req.body;

    // Perform any necessary operations with the data
    // For example, save the user to a database

    // Send a response
    res.send(`User ${name} with email ${email} created successfully.\n`);
});

// Start the server.
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Listen for incoming requests on the specified PORT and HOST.
app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});