const express = require('express');
const routes = express.Router();


// Mostrar todos los atributos de los empleados
routes.get('/holamundo', (req, res)=>{
     req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('SELECT *  FROM empleados', (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows);
        })
    }) 
})
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
        conn.query('INSERT INTO  empleados set ?', [req.body], (err, rows)=>{
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

