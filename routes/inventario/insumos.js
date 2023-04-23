const express = require('express');
const routes = express.Router()

/* ------------------ METODO PARA REGISTRAR UN INSUMO ------------------ */
routes.post('/registrar-insumo', (req, res) => {
    const fechaActual = new Date().toISOString().slice(0, 10); // obtener la fecha actual y formatearla como YYYY-MM-DD
    const maquinaria = {
        nombre: req.body.nombre,
        fecha_ingreso: fechaActual,
        cantidad: req.body.cantidad,
        color: req.body.color,
        tamaño: req.body.tamaño
    };
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('INSERT INTO gestion_insumos SET ?', maquinaria, (err, result) => {
            if (err) return res.send(err)
            res.json('Guardado correctamente en la base de datos');
        });
    });
});

/* ------------------ METODO PARA VER LOS INSUMOS----------------- */
routes.get('/insumos', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('SELECT *  FROM gestion_insumos', (err, rows) => {
            if (err) return res.send(err)
            res.json(rows);
        });
    });
});

/* ------------------ METODO PARA CONSULTAR UN INSUMO POR ID ------------------ */
routes.get('/insumos/:id', (req, res) => {
    req.getConnection((err, conn) => {
        const id = req.params.id
        if (err) return res.send(err)
        conn.query("SELECT * FROM gestion_insumos WHERE id_insumo=' " + id + "'", (err, rows) => {
            if (err) return res.send(err)
            res.json(rows);
        })
    })
})

/* ------------------ METODO PARA ACTUALIZAR UN INSUMO POR ID ------------------ */
routes.put('/insumos/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('UPDATE gestion_insumos set ? WHERE id_insumo = ?', [req.body, req.params.id], (err, rows) => {
            if (err) return res.send(err)
            res.json('Actualizado correctamente en la base de datos');
        });
    });
});

//Metodo para eliminar un insmo  de la base de datos
routes.delete('/insumos/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('DELETE FROM gestion_insumos WHERE id_insumo = ?', [req.params.id], (err, rows) => {
            if (err) return res.send(err)
            res.json('Registro eliminado correctamente de la base de datos');
        });
    });
});
module.exports = routes;
 