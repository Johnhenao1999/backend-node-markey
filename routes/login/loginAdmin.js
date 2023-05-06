const express = require('express');
const jwt = require('jsonwebtoken');
const routes = express.Router();

/* ------------------ SE REALIZA ENDPOINT PARA EL INCIO DE SESION ------------------ */
const users = [
    { username: 'admin', password: 'admin' },
];

routes.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        return res.status(401).send({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ username }, 'x^D8$X!5yG@5rYv2c#W1eA%Zf&3qB*p'); // Se genera el token JWT
    res.send({ message: 'Login successful', token });
});


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