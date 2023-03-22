const express = require('express');
const routes = express.Router();

/* ------------------ SE REALIZA ENDPOINT PARA EL INCIO DE SESION ------------------ */

const users = [
    { username: 'admin', password: 'admin' },
  ];
  
routes.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    
    if (!user) {
      return res.status(401).send({ error: 'Invalid username or password' });
    }
  
    res.send({ message: 'Login successful' });
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

/* ------------------ MOSTRAR REGISTROS DE LA TABLA DE HORAS DE INGRESO ------------------ */
routes.get('/registro-horas', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('SELECT *  FROM ingreso_empleados', (err, rows) => {
            if (err) return res.send(err)
            res.json(rows);
        })
    })
})

/* ------------------ MOSTRAR REGISTROS DE LA TABLA DE HORAS TODOS LOS EMPLEADOS  ------------------ */
routes.get('/registro-horas-empleado', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query('SELECT e.idcedula, i.idingreso, e.nombre, i.hora_ingreso, i.hora_salida, i.hora_ingreso_manana, i.hora_salida_manana FROM empleados_markey e INNER JOIN ingreso_empleados i ON e.idcedula = i.idcedula ', (err, rows) => {
            if (err) return res.send(err);
            res.json(rows);
        })
    })
});

/* ------------------ MOSTRAR REGISTROS DE LA TABLA DE HORAS POR EMPLEADO ------------------ */
routes.get('/registro-horas-empleado/:id', (req, res) => {
    const idCedula = req.params.id;
    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query(`SELECT e.idcedula, i.idingreso, e.nombre, i.hora_ingreso, i.hora_salida, i.total_pagar, i.fecha_registro, i.hora_ingreso_manana, i.hora_salida_manana, i.total_horas FROM empleados_markey e INNER JOIN ingreso_empleados i ON e.idcedula = i.idcedula WHERE e.idcedula = ${idCedula}`, (err, rows) => {
            if (err) return res.send(err);
            const result = rows.reduce((acc, curr) => {
                const existingIndex = acc.findIndex((item) => item.idcedula === curr.idcedula && item.nombre === curr.nombre);
                if (existingIndex !== -1) {
                    acc[existingIndex].registros.push({
                        idingreso: curr.idingreso,
                        hora_ingreso_manana: curr.hora_ingreso_manana,
                        hora_salida_manana: curr.hora_salida_manana,
                        hora_ingreso: curr.hora_ingreso,
                        hora_salida: curr.hora_salida,
                        total_pagar: curr.total_pagar,
                        fecha_registro: curr.fecha_registro,
                        total_horas: curr.total_horas
                    });
                } else {
                    acc.push({
                        idcedula: curr.idcedula,
                        nombre: curr.nombre,
                        registros: [{
                            idingreso: curr.idingreso,
                            hora_ingreso_manana: curr.hora_ingreso_manana,
                            hora_salida_manana: curr.hora_salida_manana,
                            hora_ingreso: curr.hora_ingreso,
                            hora_salida: curr.hora_salida,
                            total_pagar: curr.total_pagar,
                            fecha_registro: curr.fecha_registro,
                            total_horas: curr.total_horas
                        }]
                    });
                }
                return acc;
            }, []);
            res.json(result);
        })
    })
});

/* ------------------ INSERTAR REGISTROS A LA TABLA DE HORAS POR EMPLEADO ------------------ */
routes.post('/holamundo/ingresar_fecha/:idcedula', (req, res) => {
    const { horaEntradaManana, horaSalidaManana, horaIngreso, horaSalida } = req.body;
    const idcedula = req.params.idcedula;

    const horaEntradaMananaDate = new Date(`01/01/1970 ${horaEntradaManana}`);
    const horaSalidaMananaDate = new Date(`01/01/1970 ${horaSalidaManana}`);
    const horaEntradaDate = new Date(`01/01/1970 ${horaIngreso}`);
    const horaSalidaDate = new Date(`01/01/1970 ${horaSalida}`);

    // Calcular horas trabajadas en la mañana
    const tiempoTrabajadoManana = horaSalidaMananaDate.getTime() - horaEntradaMananaDate.getTime();
    const horasTrabajadasManana = tiempoTrabajadoManana / (1000 * 60 * 60);

    // Calcular horas trabajadas en la tarde
    const tiempoTrabajadoTarde = horaSalidaDate.getTime() - horaEntradaDate.getTime();
    const horasTrabajadasTarde = tiempoTrabajadoTarde / (1000 * 60 * 60);

    // Calcular total de horas trabajadas
    const totalHorasTrabajadas = horasTrabajadasManana + horasTrabajadasTarde;

    // Calcular total a pagar
    const totalPagar = totalHorasTrabajadas * 1000;

    const fechaActual = new Date().toISOString().slice(0, 10);

    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query('INSERT INTO ingreso_empleados (idcedula,  hora_ingreso, hora_salida, total_pagar, fecha_registro, hora_ingreso_manana, hora_salida_manana, total_horas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [idcedula, horaIngreso, horaSalida, totalPagar, fechaActual, horaEntradaManana, horaSalidaManana, totalHorasTrabajadas], (err, result) => {
            if (err) return res.send(err);
            res.send('Registro de ingreso creado con éxito');
        })
    })
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



// Mostar ciertos atributos de los empleados
routes.get('/holamundoprueba', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('SELECT apellido, email FROM empleados', (err, rows) => {
            if (err) return res.send(err)
            res.json(rows);
        })
    })
})


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


// Metodo para guardar un usuario en la base de datos

routes.post('/holamundo', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('INSERT INTO  empleados_markey set ?', [req.body], (err, rows) => {
            if (err) return res.send(err)
            res.json('Guardado correctamente en la base de datos');
        });
    });
});



// Metodo para guardar el total de horas de un usuario

routes.post('/horasEmpleados', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('INSERT INTO  registro_horas set ?', [req.body], (err, rows) => {
            if (err) return res.send(err)
            res.json('Guardado correctamente en la base de datos');
        });
    });
});

//Metodo para eliminar un usuario de la base de datos
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

// Metodo para guardar una maquina en la base de datos

routes.post('/insertar_maquinas', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('INSERT INTO  gestion_inventario set ?', [req.body], (err, rows) => {
            if (err) return res.send(err)
            res.json('Guardado correctamente en la base de datos');
        });
    });
});

// Mostrar todos los atributos del inventario
routes.get('/maquinas', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        conn.query('SELECT *  FROM gestion_inventario', (err, rows) => {
            if (err) return res.send(err)
            res.json(rows);
        })
    })
})

module.exports = routes;


console.log("Prueba repo")
