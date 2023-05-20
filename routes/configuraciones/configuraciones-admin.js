const express = require('express');
const routes = express.Router();

let valorHora;

/*------------------  GUARDAR CLIENTE EN LA BASE DE DATOS ---------------- */
 routes.post('/configuracion', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('INSERT INTO  configuraciones set ?', [req.body], (err, rows) => {
            if (err) return res.send(err)
            res.json('Guardado correctamente en la base de datos');
        });
    });
});



/* ------------------ MOSTRAR INFORMACION DE TODOS LOS CLIENTES ------------------ */
/* routes.get('/configuracion', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('SELECT *  FROM configuraciones', (err, rows) => {
            if (err) return res.send(err)
            res.json(rows);
        })
    })
}); */

routes.get('/configuracion', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
  
      conn.query('SELECT * FROM configuraciones', (err, rows) => {
        if (err) return res.send(err);
  
        valorHora = rows[0].valor_hora;
        
        // Puedes acceder a todas las filas y campos de la tabla configuraciones en 'rows'
  
        res.json(rows);
      });
    });
  });




/* ------------------ METODO PARA CONSULTAR A CLIENTE POR ID ------------------ */
routes.put('/configuracion/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('UPDATE configuraciones set ? WHERE idconfiguracion = ?', [req.body, req.params.id], (err, rows) => {
            if (err) return res.send(err)
            res.json('Actualizado correctamente en la base de datos');
        });
    });
});

module.exports = routes;