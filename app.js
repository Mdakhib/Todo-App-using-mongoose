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

app.post("/",(req,res)=>{
    const item=req.body.newItem;
    if(req.body.list==="Work"){
        workItems.push(item);
        res.redirect("/work")
    }else{
        items.push(item)
    }
    res.redirect("/");
})

app.get("/work",(req,res)=>{
    res.render("list",{listTitle:"Work List",newListItems:workItems});
})

app.listen(process.env.PORT || 3000,()=>{
    console.log("server is running at 3000");
}) 