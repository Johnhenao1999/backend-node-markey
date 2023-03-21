const express = require('express');
const routes = express.Router();



// Mostrar todos los atributos de los empleados
routes.get('/holamundo', (req, res)=>{
     req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('SELECT *  FROM empleados_markey', (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows);
        })
    }) 
});

routes.get('/ingreso', (req, res)=>{
    req.getConnection((err, conn)=>{
       if(err) return res.send(err)
       conn.query('SELECT *  FROM ingreso_empleados', (err, rows)=>{
           if(err) return res.send(err)
           res.json(rows);
       })
   }) 
})  

routes.get('/empleados_ingreso', (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
      conn.query('SELECT e.idempleado, i.idingreso, e.nombre, i.hora_ingreso, i.hora_salida FROM empleados_markey e INNER JOIN ingreso_empleados i ON e.idempleado = i.idempleado ', (err, rows) => {
        if (err) return res.send(err);
        res.json(rows);
      })
    })
  });


  routes.get('/holamundo/empleados-ingresos/:id', (req, res) => {
    const idEmpleado = req.params.id;
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
      conn.query(`SELECT e.idempleado, i.idingreso, e.nombre, i.hora_ingreso, i.hora_salida, i.total_pagar FROM empleados_markey e INNER JOIN ingreso_empleados i ON e.idempleado = i.idempleado WHERE e.idempleado = ${idEmpleado}`, (err, rows) => {
        if (err) return res.send(err);
        res.json(rows);
      })
    })
  });

  routes.post('/holamundo/ingresar_fecha/:idEmpleado', (req, res) => {
    const { horaIngreso, horaSalida, totalPagar } = req.body;
    const idEmpleado = req.params.idEmpleado;
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
      conn.query('INSERT INTO ingreso_empleados (idempleado, hora_ingreso, hora_salida, total_pagar) VALUES (?, ?, ?, ?)', [idEmpleado, horaIngreso, horaSalida, totalPagar], (err, result) => {
        if (err) return res.send(err);
        res.send('Registro de ingreso creado con éxito');
      })
    })
  });

// Mostar ciertos atributos de los empleados
routes.get('/holamundoprueba', (req, res)=>{
    req.getConnection((err, conn)=>{
       if(err) return res.send(err)
       conn.query('SELECT apellido, email FROM empleados', (err, rows)=>{
           if(err) return res.send(err)
           res.json(rows);
       })
   }) 
})


//Metodo para consultar a un usuario por ID
routes.get('/holamundo/:id', (req, res)=>{
    req.getConnection((err, conn)=>{
        const id = req.params.id
       if(err) return res.send(err)
       conn.query("SELECT * FROM empleados WHERE id=' "+id+"'", (err, rows)=>{
           if(err) return res.send(err)
           res.json(rows);
       })
   }) 
})


// Metodo para guardar un usuario en la base de datos

routes.post('/holamundo', (req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO  empleados_markey set ?', [req.body], (err, rows)=>{
            if(err) return res.send(err)
            res.json('Guardado correctamente en la base de datos');
        });
    });
});



// Metodo para guardar el total de horas de un usuario
 
routes.post('/horasEmpleados', (req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO  registro_horas set ?', [req.body], (err, rows)=>{
            if(err) return res.send(err)
            res.json('Guardado correctamente en la base de datos');
        });
    });
});

//Metodo para eliminar un usuario de la base de datos
routes.delete('/holamundo/:id', (req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('DELETE FROM empleados WHERE id = ?', [req.params.id], (err, rows)=>{
            if(err) return res.send(err)
            res.json('Eliminado correctamente en la base de datos');
        });
    });
});

//Metodo para actualizar un usuario de la base de datos
routes.put('/holamundo/:id', (req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('UPDATE empleados set ? WHERE id = ?', [req.body, req.params.id], (err, rows)=>{
            if(err) return res.send(err)
            res.json('Actualizado correctamente en la base de datos');
        });
    });
});

// Metodo para guardar una maquina en la base de datos

routes.post('/insertar_maquinas', (req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO  gestion_inventario set ?', [req.body], (err, rows)=>{
            if(err) return res.send(err)
            res.json('Guardado correctamente en la base de datos');
        });
    });
}); 

// Mostrar todos los atributos del inventario
routes.get('/maquinas', (req, res)=>{
    req.getConnection((err, conn)=>{
       if(err) return res.send(err)
       conn.query('SELECT *  FROM gestion_inventario', (err, rows)=>{
           if(err) return res.send(err)
           res.json(rows);
       })
   }) 
})  

module.exports = routes;


console.log("Prueba repo")
