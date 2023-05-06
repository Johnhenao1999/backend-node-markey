require('dotenv').config();
const express = require('express')
const app = express()
const mysql = require('mysql2')
const myconn = require('express-myconnection')
const cors = require('cors')
 

app.set('port', 8000);

const dbOptions ={
    host: process.env.MYSQLHOST || "localhost" ,
    port: process.env.MYSQLPORT || "3306",
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD ||  "jhonHenao123456",
    database: process.env.MYSQLDATABASE || "mydb"
} 
 
app.use(myconn(mysql, dbOptions, 'single'))
app.use(express.json());
app.use(cors()) 

 
app.use(require('./routes/login/loginAdmin'));
app.use(require('./routes/login/logoutAdmin'));
app.use(require('./routes/empleados/empleados'));
app.use(require('./routes/empleados/registroHoras'));
app.use(require('./routes/clientes/clientes'));
app.use(require('./routes/clientes/pedidosCliente'));
app.use(require('./routes/proveedores/proveedores'));
app.use(require('./routes/inventario/maquinaria'));
app.use(require('./routes/inventario/insumos'));
app.use(require('./routes/inventario/telas'));
app.use(require('./routes/configuraciones/configuraciones-admin'))


 
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});   