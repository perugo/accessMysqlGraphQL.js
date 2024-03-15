
const express=require('express')
const app=express()
const cors=require('cors')
const { port } = require('./config');
console.log(`Your port is ${port}`);

app.use(express.urlencoded({extended:false}));
app.use(cors())


app.get("/",function(req,res){
  res.send("hello");
});

app.listen(port,()=>{console.log(`Server started on port ${port}`) });