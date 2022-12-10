const express = require("express");
const bodyParser = require("body-parser");

let items=[];

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

app.get("/",function(req,res){
    let today = new Date();

    let options = {
        weekday:"long",
        day:"numeric",
        month:"long"
    }

    let day = today.toLocaleDateString("en-US",options);
    let params = {day:day,
        items:items};

    res.render("lists",{params});
});


app.post("/",function(req,res){
    let new_item=req.body.item;
    items.push(new_item);
    res.redirect("/");
});


app.listen(8383,()=>{
    console.log("Server running on port 8383");
});
