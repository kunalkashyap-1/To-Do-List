const express = require("express");
const bodyParser = require("body-parser");

const app=express();

app.get("/",function(req,res){
    res.write("<h1>nodemon test</h1>");
    res.write("sup homie");
});

app.listen(8383,()=>{
    console.log("Server running on port 8383");
});
