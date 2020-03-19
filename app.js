const express = require("express");
const bodyParser = require("body-parser");
const date = require("./date");
const mongoose = require("mongoose");
const _ = require("lodash");

require("./db");

const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemSchema);

const welcome = new Item({
  name: "Welcome to your ToDo list"
});

const add = new Item({
  name: "Hit the + item to add the item to list"
});

const remove = new Item({
  name: "<-- hit this to delete an item"
});

const defaultItems = [welcome, add, remove];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
})

const List = mongoose.model("List", listSchema);


var items;

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  let day = date.getDate();
  Item.find({}, (err, results) => {
    //console.log(results.length)
    if (results.length === 0) {
      Item.insertMany(defaultItems, err => {
        if (err) {
          console.log(err);
        } else {
          console.log("Items inserted successfully");
          res.redirect("/");
        }
      });
    } else {
      res.render("list", { listTitle: "Today", newListItems: results });
    }
  });
});


app.get("/about", (req, res) => {
  res.render("about");
});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if(listName === "Today"){
    item.save();
    res.redirect("/");
  }else {
    List.findOne({name: listName}, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    })
  }
  
});

app.post("/delete", (req,res) => {
  const itemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndRemove(itemId, (err) => {
      if(!err){
        console.log("Item removed successfully");
        res.redirect("/");
      }
    })
  }else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemId}}}, (err, results) => {
      if(!err){
        console.log("Item removed successfully");
        res.redirect("/" + listName);
      }
    })
  }
  
})

app.get("/:customListName", (req,res) => {
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name: customListName}, (err, foundList) => {
    if(!err) {
      if(!foundList){
        const list = new List({
          name: customListName,
          items: defaultItems
        })
        list.save();
        res.render("list", {listTitle: customListName, newListItems: defaultItems});
      }else {
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
    else {
      console.log(err);
    }
  });
})



// Server is listening on port 3000

app.listen(3000, (req, res) => {
  console.log("Server is up on port no 3000");
});
