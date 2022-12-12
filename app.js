const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

let items=[];
let workItems=[];

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

app.get("/",function(req,res){
    // console.log(date);
    let day = date.get_date();

    let params = {listTitle:day,
        items:items};

    res.render("lists",{params});
    
});

app.get("/work",function(req,res){
    
    let params = {
        listTitle:"Work List",
        items:workItems
    }
    res.render("lists",{params});
});

app.get("/about",function(req,res){
    res.render("about",{});
});

app.post("/",function(req,res){
    let new_item=req.body.item;
    if(req.body.list === "Work"){
        workItems.push(new_item);
        res.redirect("/work");
    }
    else{
    items.push(new_item);
    res.redirect("/");
    }
});

app.post("/work",function(req,res){
    let new_item=req.body.item;
    workItems.push(new_item);
    res.redirect("/work");
})


app.listen(8383,()=>{
    console.log("Server running on port 8383");
});
