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

/* ------------------ ENDPOINT QUE REQUIERE AUTENTICACIÓN ------------------ */
routes.get('/protected', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, 'x^D8$X!5yG@5rYv2c#W1eA%Zf&3qB*p', (err, decoded) => { // Se verifica la validez del token
        if (err) {
            return res.status(403).send({ error: 'Invalid token' });
        }

        res.send({ message: 'Access granted' });
    });
});

module.exports = routes;