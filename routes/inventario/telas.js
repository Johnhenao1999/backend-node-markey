const express = require('express');
const routes = express.Router()

/* ------------------ METODO PARA REGISTRAR UN INSUMO ------------------ */
routes.post('/registrar-telas', (req, res) => {
    const fechaActual = new Date().toISOString().slice(0, 10); // obtener la fecha actual y formatearla como YYYY-MM-DD
    const telas = {
        nombre: req.body.nombre,
        color: req.body.color,
        metros: req.body.metros,
        precio: req.body.precio,
        observaciones: req.body.observaciones,
        fecha_registro: fechaActual,
        precio_total: req.body.precio_total
    };
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('INSERT INTO gestion_telas SET ?', telas, (err, result) => {
            if (err) return res.send(err)
            res.json('Guardado correctamente en la base de datos');
        });
    });
});

/* ------------------ METODO PARA VER LOS INSUMOS----------------- */
routes.get('/telas', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('SELECT *  FROM gestion_telas', (err, rows) => {
            if (err) return res.send(err)
            res.json(rows);
        });
    });
});

/* ------------------ METODO PARA CONSULTAR UN INSUMO POR ID ------------------ */
routes.get('/telas/:id', (req, res) => {
    req.getConnection((err, conn) => {
        const id = req.params.id
        if (err) return res.send(err)
        conn.query("SELECT * FROM gestion_telas WHERE id_telas=' " + id + "'", (err, rows) => {
            if (err) return res.send(err)
            res.json(rows);
        })
    })
})

/* ------------------ METODO PARA ACTUALIZAR UN INSUMO POR ID ------------------ */
routes.put('/telas/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('UPDATE gestion_telas set ? WHERE id_telas = ?', [req.body, req.params.id], (err, rows) => {
            if (err) return res.send(err)
            res.json('Actualizado correctamente en la base de datos');
        });
    });
});

//Metodo para eliminar un insmo  de la base de datos
routes.delete('/telas/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('DELETE FROM gestion_telas WHERE id_telas = ?', [req.params.id], (err, rows) => {
            if (err) return res.send(err)
            res.json('Registro eliminado correctamente de la base de datos');
        });
    });
});
module.exports = routes;
 