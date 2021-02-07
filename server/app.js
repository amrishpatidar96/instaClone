const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 5000;
const {MONGOURI} = require('./keys');
require('./models/user');
require('./models/post');

mongoose.connect(MONGOURI,{ 
    useNewUrlParser: true
    ,useUnifiedTopology: true
});

mongoose.connection.on('connected',()=>{
    console.log("connected to mango");
})

mongoose.connection.on('error',(err)=>{
    console.log("error in connecting to mango"+err);
})

app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
app.use(require('./routes/auth'));
app.use(require('./routes/user'));
app.use(require('./routes/post'));



app.listen(PORT, () => {
    console.log("server is running on port",PORT);
});