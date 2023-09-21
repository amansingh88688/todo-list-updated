const express = require("express"),
app = express(),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
date = require(__dirname + "/date.js"),
_ = require("lodash"),
PORT = process.env.PORT || 3000;

require("dotenv").config(),
app.set("view engine", "ejs"),
app.use(bodyParser.urlencoded({ extended: !0 })),
app.use(express.static("public")),
mongoose.set("strictQuery", !1),
mongoose.connect(process.env.ATLAS_URL, { useNewUrlParser: !0, useUnifiedTopology: !0 }, function (e) {});
const itemsSchema = new mongoose.Schema({ name: { type: String, required: !0 } }),
Item = mongoose.model("Item", itemsSchema),
item1 = new Item({ name: "Welcome!" }),
item2 = new Item({ name: "Hit the + button to add a new item." }),
item3 = new Item({ name: "<-- Hit thus to delete an item." }),
defaultItems = [item1, item2, item3],
listSchema = { name: String, items: [itemsSchema] },
List = mongoose.model("List", listSchema),
day = date.getDate();





app.get("/", function (e, t) {
    Item.find({}, function (e, n) {
        0 === n.length ? (Item.insertMany(defaultItems, function (e) {}), t.redirect("/")) : t.render("list", { listTitle: day, newListItems: n });
    });
}),
    app.get("/allList", function (e, t) {
        List.find({}, function (e, n) {
            t.render("allList", { newLists: n });
        });
    }),
    app.get("/:customListName", function (e, t) {
        const n = _.capitalize(e.params.customListName);
        List.findOne({ name: n }, function (e, i) {
            e || (i ? t.render("list", { listTitle: i.name, newListItems: i.items }) : (new List({ name: n, items: defaultItems }).save(), t.redirect("/" + n)));
        });
    }),
    app.post("/", function (e, t) {
        e.body.newList;
        const n = e.body.newItem,
            i = e.body.list,
            s = new Item({ name: n });
        i === day
            ? (s.save(), t.redirect("/"))
            : List.findOne({ name: i }, function (e, n) {
                  n.items.push(s), n.save(), t.redirect("/" + i);
              });
    }),
    app.post("/new", function (e, t) {
        const n = e.body.newList;
        t.redirect("/" + n);
    }),
    app.post("/deleteList", function (e, t) {
        const n = e.body.deletingList;
        List.findByIdAndDelete(n, function (e) {
            e || t.redirect("/allList");
        });
    }),
    app.post("/delete", function (e, t) {
        const n = e.body.checkbox,
            i = e.body.listName;
        i === day
            ? Item.findByIdAndRemove(n, function (e) {
                  e || t.redirect("/");
              })
            : List.findOneAndUpdate({ name: i }, { $pull: { items: { _id: n } } }, function (e, n) {
                  e || t.redirect("/" + i);
              });
    }),
    app.listen(PORT, () => {});
