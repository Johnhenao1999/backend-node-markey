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

/* ------------------ METODO PARA CONSULTAR A CLIENTE POR ID ------------------ */
routes.get('/clientes/:id', (req, res) => {
    req.getConnection((err, conn) => {
        const id = req.params.id
        if (err) return res.send(err)
        conn.query("SELECT * FROM clientes WHERE id_cliente=' " + id + "'", (err, rows) => {
            if (err) return res.send(err)
            res.json(rows);
        })
    })
})

/* ------------------ METODO PARA CONSULTAR A CLIENTE POR ID ------------------ */
routes.put('/clientes/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('UPDATE clientes set ? WHERE id_cliente = ?', [req.body, req.params.id], (err, rows) => {
            if (err) return res.send(err)
            res.json('Actualizado correctamente en la base de datos');
        });
    });
});



/*------------------  ELIMINAR CLIENTE EN LA BASE DE DATOS ---------------- */
routes.delete('/clientes/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('DELETE FROM clientes WHERE id_cliente = ?', [req.params.id], (err, rows) => {
            if (err) return res.send(err)
            res.json('Eliminado correctamente en la base de datos');
        });
    });
});


module.exports = routes;