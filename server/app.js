const express= require('express');
const app= express();
const mongoose= require('mongoose')
const PORT= 5000
const {MONGOURI}= require("./key")


mongoose.connect(MONGOURI,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected',()=>{
    console.log("connected")
})
mongoose.connection.on('error',(error)=>{
    console.log("erroe",error)
})
const things=require('./routes/auth')
//registering model 
require('./models/user')
require('./models/post')
//middleware to pass all the data in json format to router
app.use(express.json())
app.use(things)
app.use(require('./routes/post'))
app.use(require('./routes/user'))

 app.listen(PORT,()=>{
     console.log("Server is running on ",PORT)
 })