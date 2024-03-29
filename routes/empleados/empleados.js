const express = require('express');
const routes = express.Router();
const jwt = require('jsonwebtoken');


// Middleware que verifica si el usuario ha iniciado sesión
function requireLogin(req, res, next) {
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header not found' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, 'x^D8$X!5yG@5rYv2c#W1eA%Zf&3qB*p');
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
  


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
routes.get('/empleados',  requireLogin,  (req, res) => {
    req.getConnection((err, conn) => {
      if (err) {
        return res.status(500).send(err);
      }
      conn.query('SELECT * FROM empleados_markey', (err, rows) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.json(rows);
      });
    });
  });

/* ------------------ METODO PARA CONSULTAR A EMPLEADO POR ID ------------------ */
routes.get('/empleados/:id', (req, res) => {
    req.getConnection((err, conn) => {
        const id = req.params.id
        if (err) return res.send(err)
        conn.query("SELECT * FROM empleados_markey WHERE idcedula=' " + id + "'", (err, rows) => {
            if (err) return res.send(err)
            res.json(rows);
        })
    })
})


/*------------------  ELIMINAR EMPLEADO EN LA BASE DE DATOS ---------------- */
routes.delete('/empleados/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('DELETE FROM empleados_markey WHERE idcedula = ?', [req.params.id], (err, rows) => {
            if (err) return res.send(err)
            res.json('Eliminado correctamente en la base de datos');
        });
    });
});

//Metodo para actualizar un usuario de la base de datos
routes.put('/empleados/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('UPDATE empleados_markey set ? WHERE idcedula = ?', [req.body, req.params.id], (err, rows) => {
            if (err) return res.send(err)
            res.json('Actualizado correctamente en la base de datos');
        });
    });
});


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




module.exports = routes;