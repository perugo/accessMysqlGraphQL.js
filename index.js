
const express=require('express')
const app=express()
const cors=require('cors')

app.use(express.urlencoded({extended:false}));
app.use(cors())


app.get("/",function(req,res){
  res.send("hello");
});

app.listen(3000,()=>{console.log("Server started on port 3000") });
