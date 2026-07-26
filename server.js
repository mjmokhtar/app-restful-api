const express = require('express');
const bodyParser = require('body-parser');

var morgan = require('morgan');
const app = express();
const port = 3000;


//parse application/json
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Panggil modul routers dengan objek aplikasi Express
var routers = require('./routers');
routers(app);

//daftarkan menu routes dari index

app.use('/auth', require('./middleware'))

app.listen(port,()=>{
    console.log(`app running at http://localhost:${port}`);
})