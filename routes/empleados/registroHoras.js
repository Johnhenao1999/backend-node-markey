const express = require('express');
const routes = express.Router();

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
        conn.query(`SELECT e.idcedula, i.idingreso, e.nombre, e.apellido, i.hora_ingreso, i.hora_salida, i.total_pagar, i.fecha_registro, i.hora_ingreso_manana, i.hora_salida_manana, i.total_horas FROM empleados_markey e INNER JOIN ingreso_empleados i ON e.idcedula = i.idcedula WHERE e.idcedula = ${idCedula}`, (err, rows) => {
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
                        apellido: curr.apellido,
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


/* ------------------ SE TRAE CONSULTA DE CONFIGURACION PARA USAR EL VALOR HORA------------------ */
let valorHora;

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
    const totalPagar = totalHorasTrabajadas * valorHora;

    const fechaActual = new Date().toISOString().slice(0, 10);

    req.getConnection((err, conn) => {
        if (err) return res.send(err);
        conn.query('INSERT INTO ingreso_empleados (idcedula,  hora_ingreso, hora_salida, total_pagar, fecha_registro, hora_ingreso_manana, hora_salida_manana, total_horas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [idcedula, horaIngreso, horaSalida, totalPagar, fechaActual, horaEntradaManana, horaSalidaManana, totalHorasTrabajadas], (err, result) => {
            if (err) return res.send(err);
            res.send('Registro de ingreso creado con éxito');
        })
    })
});

/*------------------  ELIMINAR REGISTRO DE HORA EMPLEADO ---------------- */
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

