const express = require("express");
const bodyParser = require("body-parser");

const app=express();

app.set("view engine","ejs");

app.get("/",function(req,res){
    res.render("lists",{var_test:"Test"});
});

app.listen(8383,()=>{
    console.log("Server running on port 8383");
});
