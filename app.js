const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const { result } = require("lodash");
const day = date.get_date();
const _ = require("lodash");

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27020/todolistDB');

const listSchema = {
    name: String
};

const cust_listSchema = {
    name:String,
    items:[listSchema]
};

const Item = mongoose.model("item", listSchema);
const List = mongoose.model("list",cust_listSchema);


const item1 = new Item({
    name: "Welcome to your ToDo List"
});

const item2 = new Item({
    name: "<-- Hit this to delete "
});

const defaultItems = [item1, item2];





// let items=[];

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    // console.log(date);

    Item.find({}, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            if (result.length === 0) {
                Item.insertMany(defaultItems, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Data is inserted successfuly");
                    }
                });
                res.redirect("/");
            }else{
            let params = {
                listTitle: day,
                items: result
            };

            res.render("lists", { params });
        }
        }
    })
});

app.get("/:path",(req,res)=>{
    const custom_path=_.capitalize(req.params.path);

    List.findOne({name:custom_path},(err,result)=>{
        if(err){
            console.log(err);
        }else{
            if(!result){
                const list = new List({
                    name:custom_path,
                    items:defaultItems
                });
            
                list.save();
                console.log("new data created in List collection");
                res.redirect("/"+custom_path);
            }
            else{
                let params = {
                    listTitle: custom_path,
                    items: result.items
                };
    
                res.render("lists", { params });
            }
        }
    });

    
});


app.post("/", function (req, res) {
    let new_item = req.body.item;
    let listName =req.body.list;

    if(listName == day){
        Item.insertMany({
            name: new_item
        });
        res.redirect("/");
    }else{
        const item = new Item({
            name:new_item
        });
        List.findOne({name:listName},(err,result)=>{
            result.items.push(item);
            result.save();
            res.redirect("/"+listName);
        });
    }
        // items.push(new_item);
        
});

app.post("/delete",(req,res)=>{
    // console.log(req.body.checkbox);
    const checkedItemId=req.body.checkbox;
    const ListName=req.body.list_name;

    if(ListName === day){
        Item.findByIdAndRemove(checkedItemId,(err)=>{
            if(err){
                console.log(err);
            }
            res.redirect("/");
        });
    }else{
        List.findOneAndUpdate({name:ListName},{$pull:{items:{_id:checkedItemId}}},(err,result)=>{
            if(!err){
                res.redirect("/"+ListName);
            }
        });
    }
    
    
});


app.listen(8383, () => {
    console.log("Server running on port 8383");
});
