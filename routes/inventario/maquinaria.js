const express = require('express');
const routes = express.Router()

// Metodo para guardar una maquina en la base de datos

routes.post('/insertar_maquinas', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('INSERT INTO  gestion_inventario set ?', [req.body], (err, rows) => {
            if (err) return res.send(err)
            res.json('Guardado correctamente en la base de datos');
        });
    });
});

// Mostrar todos los atributos del inventario
routes.get('/maquinas', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('SELECT *  FROM gestion_inventario', (err, rows) => {
            if (err) return res.send(err)
            res.json(rows);
        })
    })
})

module.exports = routes;
 