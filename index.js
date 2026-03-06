const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());

mongoose.connect("mongodb+srv://manan:manan0112@cluster0.xordvmt.mongodb.net/?appName=Cluster0")
.then(()=> console.log("MongoDB connected succesfully"))
.catch((error)=> console.log("MongoDB" , error))

const userSchema = new mongoose.Schema({
    name : String,
    age : Number,
    email : String
})
const User = mongoose.model("user" , userSchema);

app.get("/user" , async (req , res)=>{
 try{ 
      const data = await User.find({});
    res.status(200).json(data);
}
catch(error){
    res.status(500).json({error : error.message})
}
})
app.get("/user/:id" , async (req , res)=>{
    const id = req.params.id;
    const data = await User.findById(id);
    res.status(200).json(data);
})
app.post("/user" , async (req , res)=>{
    try{
        const user = new User(req.body);
        await user.save()
        res.status(201).json(user);

    }
    catch(error){
        res.status(500).json({error : error.message})
    }
})
app.post("/users" , async (req , res)=>{
    const data = await User.insertMany(req.body);

    res.status(201).json({ "Added one then one user":data});
})
app.delete("/user/:id" ,async  (req , res)=>{
   try{ const id = req.params.id;
    const data  = await User.deleteOne({_id : id});
    res.status(201).json({ "deleted " : data});}
    catch(error){
        res
        .status(500).json({"Error message" : error.message})
    }
})

app.put("/user/:id" , async (req , res)=>{
    const id = req.params.id;
  try{  const data = await User.findByIdAndUpdate(id , req.body , {
        new : true,
        runValidators : true
    });
    res.status(201).json(data);}
    catch(error){
        res.status(500).json({"Error" : error.message})
    }
})
app.patch("/user/:id" , async (req , res)=>{
    const id = req.params.id;
  try{  const data = await User.findByIdAndUpdate(id , req.body , {
        new : true,
        runValidators : true
    });
    res.status(201).json(data);}
    catch(error){
        res.status(500).json({"Error" : error.message})
    }
})
app.listen(3000 , ()=>{
    console.log("Server has started on localhost");
    
})