const express = require('express');
const routes = express.Router();



/*------------------  GUARDAR PEDIDO EN LA BASE DE DATOS ---------------- */
routes.post('/registro-pedidos/:id_cliente', (req, res) => {
  const { estado_pedido, descripcion_pedido, fecha_finalizacion, precio_pedido, anticipo_pedido, precio_faltante, factura_venta } = req.body;
  const idcliente = req.params.id_cliente;
  const fechaActual = new Date().toISOString().slice(0, 10);
  req.getConnection((err, conn) => {
    if (err) return res.send(err)
    conn.query('INSERT INTO pedidos (id_cliente, fecha, estado_pedido, descripcion_pedido, fecha_finalizacion, precio_pedido, anticipo_pedido, precio_faltante, factura_venta) VALUES (?,?,?,?,?,?,?,?, ?)', [idcliente, fechaActual, estado_pedido, descripcion_pedido, fecha_finalizacion, precio_pedido, anticipo_pedido, precio_faltante, factura_venta], (err, result) => {
      if (err) return res.send(err)
      const id_pedido = result.insertId;
      res.json({ id_pedido: id_pedido, message: 'Guardado correctamente en la base de datos' });
    });
  });
});

/* ------------------ METODO PARA CONSULTAR UN PEDIDO POR ID ------------------ */
routes.get('/pedidos-cliente/:id', (req, res) => {
  req.getConnection((err, conn) => {
    const id = req.params.id
    if (err) return res.send(err)
    conn.query("SELECT * FROM pedidos WHERE id_pedido=' " + id + "'", (err, rows) => {
      if (err) return res.send(err)
      res.json(rows);
    })
  })
})

/* ------------------ MOSTRAR TODOS LOS PEDIDOS REGISTRADOS ------------------ */
routes.get('/pedidos', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err)
    conn.query('SELECT c.nombre_comercial, p.id_pedido, p.fecha, p.estado_pedido, p.descripcion_pedido, p.fecha_finalizacion, p.precio_pedido, p.anticipo_pedido, p.precio_faltante, p.factura_venta FROM clientes c JOIN pedidos p ON c.id_cliente = p.id_cliente WHERE p.estado_pedido NOT LIKE "Pedido finalizado"', (err, rows) => {
      if (err) return res.send(err)
      res.json(rows);
    })
  })
});

/* ------------------ METODO PARA ACTUALIZAR A UN PEDIDO POR ID ------------------ */
routes.put('/pedidos-cliente/:id', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err)
    conn.query('UPDATE pedidos set ? WHERE id_pedido = ?', [req.body, req.params.id], (err, rows) => {
      if (err) return res.send(err)
      res.json('Actualizado correctamente en la base de datos');
    });
  });
});

/* ------------------ MOSTRAR TODOS LOS PEDIDOS QUE HAN SIDO FINALIZADOS ------------------ */
routes.get('/pedidos-finalizados', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err)
    conn.query("SELECT c.nombre_comercial, p.id_pedido, p.fecha, p.estado_pedido, p.descripcion_pedido, p.fecha_finalizacion, p.precio_pedido, p.anticipo_pedido, p.precio_faltante, p.factura_venta FROM clientes c JOIN pedidos p ON c.id_cliente = p.id_cliente WHERE p.estado_pedido = 'Pedido finalizado'", (err, rows) => {
      if (err) return res.send(err)
      res.json(rows);
    })
  })
});

/* ------------------ MOSTRAR PEDIDO POR CLIENTE ------------------ */
routes.get('/pedidos/:id_cliente', (req, res) => {
  const id_cliente = req.params.id_cliente;
  req.getConnection((err, conn) => {
    if (err) return res.send(err)
    conn.query('SELECT c.nombre_comercial, p.id_pedido, p.fecha, p.estado_pedido, p.descripcion_pedido, p.fecha_finalizacion, p.precio_pedido, p.anticipo_pedido, p.precio_faltante, p.factura_venta FROM clientes c JOIN pedidos p ON c.id_cliente = p.id_cliente WHERE c.id_cliente = ?', [id_cliente], (err, rows) => {
      if (err) return res.send(err)
      res.json(rows);
    })
  })
});

/*------------------  GUARDAR ITEMS EN LA BASE DE DATOS ---------------- */
routes.post('/registro-items/:id_pedido', (req, res) => {
  const { id_pedido } = req.params;
  const { items } = req.body;
  const values = items.map(item => [id_pedido, item.cantidad, item.producto, item.precio_unitario, item.total]);

  req.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send(err);
    }

    conn.query('INSERT INTO itemsPedidos (id_pedido, cantidad, producto, precio_unitario, total) VALUES ?', [values], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.json('Guardado correctamente en la base de datos');
    });
  });
});

/*------------------  MOSTRAR ITEMS EN LA BASE DE DATOS POR CLIENTE ---------------- */
routes.get('/mostrar-items-pedidos/:id_cliente', (req, res) => {
  const id_cliente = req.params.id_cliente;
  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    // Consulta para obtener la información del cliente y sus pedidos
    const sql = 'SELECT c.nombre_comercial, p.id_pedido FROM clientes c JOIN pedidos p ON c.id_cliente = p.id_cliente WHERE c.id_cliente = ?';

    // Consulta para obtener los items de cada pedido
    const sqlItems = 'SELECT cantidad, producto, precio_unitario, total FROM itemsPedidos WHERE id_pedido = ?';

    conn.query(sql, [id_cliente], (err, rows) => {
      if (err) return res.send(err);

      const result = [];
      for (const row of rows) {
        // Para cada pedido del cliente, obtenemos sus items
        conn.query(sqlItems, [row.id_pedido], (err, rowsItems) => {
          if (err) return res.send(err);

          // Creamos un objeto con la información del pedido y sus items
          const pedido = {
            nombre_comercial: row.nombre_comercial,
            id_pedido: row.id_pedido,
            items: rowsItems
          };

          // Agregamos el objeto al array result
          result.push(pedido);

          // Si ya se procesaron todos los pedidos, enviamos la respuesta
          if (result.length === rows.length) {
            res.json(result);
          }
        });
      }
    });
  });
});

/*------------------  MOSTRAR ITEMS EN LA BASE DE DATOS POR PEDIDO ---------------- */
routes.get('/detalle-pedido/:id_pedido', (req, res) => {
  const id_pedido = req.params.id_pedido;
  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    // Consulta para obtener la información del pedido y su cliente
    const sql = 'SELECT c.nombre_comercial, p.id_pedido FROM clientes c JOIN pedidos p ON c.id_cliente = p.id_cliente WHERE p.id_pedido = ?';

    // Consulta para obtener los items del pedido
    const sqlItems = 'SELECT cantidad, producto, precio_unitario, total FROM itemsPedidos WHERE id_pedido = ?';

    conn.query(sql, [id_pedido], (err, rows) => {
      if (err) return res.send(err);

      // Si no se encontró ningún pedido con el id especificado, enviamos un error
      if (rows.length === 0) {
        return res.status(404).send(`Pedido con id ${id_pedido} no encontrado`);
      }

      const pedido = rows[0];

      // Obtenemos los items del pedido
      conn.query(sqlItems, [id_pedido], (err, rowsItems) => {
        if (err) return res.send(err);

        // Agregamos los items al objeto pedido
        pedido.items = rowsItems;

        // Enviamos la respuesta
        res.json(pedido);
      });
    });
  });
});

/*------------------  MOSTRAR ITEMS EN LA BASE DE DATOS ---------------- */
routes.get('/detalle-pedido/', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err)
    conn.query('SELECT *  FROM itemsPedidos', (err, rows) => {
      if (err) return res.send(err)
      res.json(rows);
    })
  })
});

//Metodo para eliminar un pedido de la base de datos
routes.delete('/pedidos/:id', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err)
    conn.query('DELETE FROM pedidos WHERE id_pedido = ?', [req.params.id], (err, rows) => {
      if (err) return res.send(err)
      res.json('Registro eliminado correctamente de la base de datos');
    });
  });
});

// Endpoint que retorna los items de los pedidos que tienen estado 'Pedido finalizado'
routes.get('/items-pedidos-finalizados', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error en la conexión a la base de datos.' });
    } else {
      conn.query(`SELECT * FROM itemsPedidos WHERE id_pedido IN(SELECT id_pedido FROM pedidos WHERE estado_pedido = 'Pedido finalizado')`,
        (err, results) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al obtener los items de los pedidos finalizados.' });
          } else {
            res.json(results);
          }
        });
    }
  });
});


module.exports = routes;