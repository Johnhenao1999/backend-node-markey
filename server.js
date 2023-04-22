const express = require('express')
const app = express()
const mysql = require('mysql2')
const myconn = require('express-myconnection')
const cors = require('cors')
 

app.set('port', 8000);

const dbOptions ={
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'jhonHenao123456',
    database: 'mydb'
} 

app.use(myconn(mysql, dbOptions, 'single'))
app.use(express.json());
app.use(cors())


app.use(require('./routes/login/loginAdmin'));
app.use(require('./routes/empleados/empleados'));
app.use(require('./routes/empleados/registroHoras'));
app.use(require('./routes/clientes/clientes'));
app.use(require('./routes/clientes/pedidosCliente'));
app.use(require('./routes/proveedores/proveedores'));
app.use(require('./routes/inventario/maquinaria'));



app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});   