const express = require('express');
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
  
    res.send({ message: 'Login successful' });
  });

  module.exports = routes;