const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27020/todolistDB');

const listSchema = {
    name: String
};

const item = mongoose.model("item", listSchema);

const item1 = new item({
    name: "Welcome to your ToDo List"
});

const item2 = new item({
    name: "<-- Hit this to delete "
});

const defaultItems = [item1, item2];

const cust_listSchema = {
    name:String,
    items:[listSchema]
};

const list = mongoose.model("list",cust_listSchema);


// let items=[];

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    // console.log(date);
    let day = date.get_date();

    item.find({}, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            if (result.length === 0) {
                item.insertMany(defaultItems, (err) => {
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
    const custom_path=req.params.path;
    const list = new list({
        name:custom_path,
        items:defaultItems
    });

    list.save();
});


app.post("/", function (req, res) {
    let new_item = req.body.item;
        // items.push(new_item);
        item.insertMany({
            name: new_item
        });
        res.redirect("/");
});

app.post("/delete",(req,res)=>{
    // console.log(req.body.checkbox);
    const checkedItemId=req.body.checkbox;
    item.findByIdAndRemove(checkedItemId,(err)=>{
        if(err){
            console.log(err);
        }
        res.redirect("/");
    });
});


app.listen(8383, () => {
    console.log("Server running on port 8383");
});
