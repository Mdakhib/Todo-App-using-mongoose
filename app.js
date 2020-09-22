const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose")
const app=express()


// const items=["Khana","Peena","Sona"];
// const workItems=[]




app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));



mongoose.connect("mongodb://localhost:27017/todolistDB",{ useNewUrlParser: true, useUnifiedTopology: true } )

const itemsSchema={
    name:String
}

const Item=mongoose.model("Item",itemsSchema)

const item1=new Item({
    name:"Welcome to your todoList"
});

const item2=new Item({
    name:"Hit the + button to add a new Item"
});

const item3=new Item({
    name:"<-- Hit this to delete an item"
});


const defaultItems=[item1,item2,item3];

// to create a new schema for new listItems in locahost
const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List= mongoose.model("List",listSchema)



app.get("/",(req,res)=>{

    Item.find({},function(err,foundItems){

        if(foundItems.length===0){
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("successfull");
                }
            }) 
            res.redirect("/")
        }else{
            res.render("list",{
                listTitle:"Today",
                newListItems:foundItems
            });
        }
    })
   
});

// for creating a new list in localhost
app.get("/:customListName", (req, res) => {
    const customListName = req.params.customListName;
    List.findOne({ name: customListName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                // create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/"+ customListName)
            } else {
                // show  an existing list
                res.render("list", {
                    listTitle: foundList.name,
                    newListItems: foundList.items
                })
            }
        }
    })
    
})
// ------------------------------------------------------------
app.post("/",(req,res)=>{
    const itemName=req.body.newItem;
    const listName=req.body.list;
    const item= new Item({
        name:itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function (err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName)
        })
    }




})

app.post("/delete",function(req,res){
    const checkedItemId=req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId,function(err){
        if(!err){
            console.log("success");
            res.redirect("/")
        }
    });
    
});





app.listen(process.env.PORT || 3000,()=>{
    console.log("server is running at 3000");
}) 