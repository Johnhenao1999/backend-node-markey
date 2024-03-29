const express = require('express');
const routes = express.Router()

// Metodo para guardar una maquina en la base de datos

routes.post('/registrar-maquinaria', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('INSERT INTO gestion_maquinaria set ?', [req.body], (err, rows) => {
            if (err) return res.send(err)
            res.json('Guardado correctamente en la base de datos');
        });
    });
});

// Mostrar todos los atributos del inventario
routes.get('/maquinas', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('SELECT *  FROM gestion_maquinaria', (err, rows) => {
            if (err) return res.send(err)
            res.json(rows);
        });
    });
});

/* ------------------ METODO PARA CONSULTAR UNA MAQUINA POR ID ------------------ */
routes.get('/maquinas/:id', (req, res) => {
    req.getConnection((err, conn) => {
        const id = req.params.id
        if (err) return res.send(err)
        conn.query("SELECT * FROM gestion_maquinaria WHERE id_maquina=' " + id + "'", (err, rows) => {
            if (err) return res.send(err)
            res.json(rows);
        })
    })
})

//Metodo para actualizar una maquina de la base de datos
routes.put('/maquinas/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('UPDATE gestion_maquinaria set ? WHERE id_maquina = ?', [req.body, req.params.id], (err, rows) => {
            if (err) return res.send(err)
            res.json('Actualizado correctamente en la base de datos');
        });
    });
});

//Metodo para eliminar una maquina de la base de datos
routes.delete('/maquinas/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('DELETE FROM gestion_maquinaria WHERE id_maquina = ?', [req.params.id], (err, rows) => {
            if (err) return res.send(err)
            res.json('Registro eliminado correctamente de la base de datos');
        });
    });
});
module.exports = routes;
 