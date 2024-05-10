const functions = require('firebase-functions');
const express = require('express');
const actions = require('../methods/actions');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/404', (req, res) => {
    res.send('Dashboard');
});

app.post('/adduser', actions.addNew);
app.post('/authenticate', actions.authenticate);
app.get('/getinfo', actions.getinfo);

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);
