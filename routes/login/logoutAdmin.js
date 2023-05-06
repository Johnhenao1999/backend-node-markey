const express = require('express');
const jwt = require('jsonwebtoken');
const routes = express.Router();

routes.post('/logout', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).send({ error: 'Unauthorized' });
    }

    try {
        jwt.verify(token, 'x^D8$X!5yG@5rYv2c#W1eA%Zf&3qB*p');
    } catch (err) {
        return res.status(401).send({ error: 'Unauthorized' });
    }

    res.send({ message: 'Logout successful' });
});

module.exports = routes;