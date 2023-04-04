const express = require('express');
const routes = express.Router();

/*------------------  GUARDAR EMPLEADO EN LA BASE DE DATOS ---------------- */
routes.post('/holamundo', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('INSERT INTO  empleados_markey set ?', [req.body], (err, rows) => {
            if (err) return res.send(err)
            res.json('Guardado correctamente en la base de datos');
        });
    });
});

/* ------------------ MOSTRAR INFORMACION DE TODOS LOS EMPLEADOS ------------------ */
routes.get('/empleados', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('SELECT *  FROM empleados_markey', (err, rows) => {
            if (err) return res.send(err)
            res.json(rows);
        })
    })
});

/*------------------  ELIMINAR EMPLEADO EN LA BASE DE DATOS ---------------- */
routes.delete('/holamundo/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('DELETE FROM empleados_markey WHERE idcedula = ?', [req.params.id], (err, rows) => {
            if (err) return res.send(err)
            res.json('Eliminado correctamente en la base de datos');
        });
    });
});

//Metodo para actualizar un usuario de la base de datos
routes.put('/holamundo/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('UPDATE empleados set ? WHERE id = ?', [req.body, req.params.id], (err, rows) => {
            if (err) return res.send(err)
            res.json('Actualizado correctamente en la base de datos');
        });
    });
});

//Metodo para consultar a un usuario por ID
routes.get('/holamundo/:id', (req, res) => {
    req.getConnection((err, conn) => {
        const id = req.params.id
        if (err) return res.send(err)
        conn.query("SELECT * FROM empleados WHERE id=' " + id + "'", (err, rows) => {
            if (err) return res.send(err)
            res.json(rows);
        })
    })
})

// Mostar ciertos atributos de los empleados
routes.get('/holamundoprueba', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('SELECT apellido, email FROM empleados', (err, rows) => {
            if (err) return res.send(err)
            res.json(rows);
        });
    });
});

//Metodo para eliminar un usuario de la base de datos
routes.delete('/ingreso_empleados/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('DELETE FROM ingreso_empleados WHERE idingreso = ?', [req.params.id], (err, rows) => {
            if (err) return res.send(err)
            res.json('Registro eliminado correctamente de la base de datos');
        });
    });
});




module.exports = routes;