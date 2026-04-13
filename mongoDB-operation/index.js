const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({});
const User = mongoose.model("user" , userSchema);


mongoose.connect("mongodb+srv://manan:manan0112@cluster0.xordvmt.mongodb.net/?appName=Cluster0")
    .then(() => console.log("MonogoDB has been connected")
    )
    .catch((error) => console.log(error.message)
    )
    app.post("/product/bulk", async (req, res) => {
    try {
        console.log(req.body);
        
        const user = await User( req.body)
        user.save();
        res.status(201).json({ "Inserted": user });
    }
    catch (error) {
        res.status(500).json({ "Error": error.message })
    }
})

    app.get("/user" ,async (req , res)=>{
        const user = await User.find({});
        res.status(200).json(user);
    })
    app.get("/user/:id" ,async (req , res)=>{
        const id = req.params.id;
        const user = await User.findById({_id : id});
        res.status(200).json(user);
    })
    app.get("/product" , async(req , res)=>{

        const categoryName = req.query.category;
        const products =await User.find({category : categoryName});

        res.status(200).json();
    })
    app.listen(3000 , ()=>{
        console.log("Server has been started");
        
    })