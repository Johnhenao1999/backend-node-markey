const express = require('express');
const routes = express.Router();


/*------------------  GUARDAR CLIENTE EN LA BASE DE DATOS ---------------- */
routes.post('/registro-clientes', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('INSERT INTO  clientes set ?', [req.body], (err, rows) => {
            if (err) return res.send(err)
            res.json('Guardado correctamente en la base de datos');
        });
    });
});

/* ------------------ MOSTRAR INFORMACION DE TODOS LOS CLIENTES ------------------ */
routes.get('/clientes', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('SELECT *  FROM clientes', (err, rows) => {
            if (err) return res.send(err)
            res.json(rows);
        })
    })
});

/*------------------  ELIMINAR CLIENTE EN LA BASE DE DATOS ---------------- */
routes.delete('/clientes/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('DELETE FROM clientes WHERE idcliente = ?', [req.params.id], (err, rows) => {
            if (err) return res.send(err)
            res.json('Eliminado correctamente en la base de datos');
        });
    });
});


module.exports = routes;