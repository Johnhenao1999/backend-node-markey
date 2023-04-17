const express = require('express');
const routes = express.Router();

/*------------------  GUARDAR PROVEEDOR EN LA BASE DE DATOS ---------------- */
routes.post('/create-proveedor', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('INSERT INTO  proveedores set ?', [req.body], (err, rows) => {
            if (err) return res.send(err)
            res.json('Guardado correctamente en la base de datos');
        });
    });
});

/*------------------  MOSTRAR INFORMACION DEL PROVEEDOR---------------- */
routes.get('/proveedor', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('SELECT *  FROM proveedores', (err, rows) => {
            if (err) return res.send(err)
            res.json(rows);
        });
    });
});

/* ------------------ METODO PARA CONSULTAR A UN PROVEEDOR POR ID ------------------ */
routes.get('/proveedor/:id', (req, res) => {
    req.getConnection((err, conn) => {
        const id = req.params.id
        if (err) return res.send(err)
        conn.query("SELECT * FROM proveedores WHERE id_proveedor=' " + id + "'", (err, rows) => {
            if (err) return res.send(err)
            res.json(rows);
        })
    })
})


/*------------------  ACTUALIZAR PROVEEDOR EN LA BASE DE DATOS ---------------- */
routes.put('/proveedor/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('UPDATE proveedores set ? WHERE id_proveedor = ?', [req.body, req.params.id], (err, rows) => {
            if (err) return res.send(err)
            res.json('Actualizado correctamente en la base de datos');
        });
    });
});

/*------------------  ELIMINAR PROVEEDOR EN LA BASE DE DATOS ---------------- */
routes.delete('/proveedor/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('DELETE FROM proveedores WHERE id_proveedor = ?', [req.params.id], (err, rows) => {
            if (err) return res.send(err)
            res.json('Registro eliminado correctamente de la base de datos');
        });
    });
});

module.exports = routes;