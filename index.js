const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
app.use(express.json());

mongoose.connect("mongodb+srv://manan:manan0112@cluster0.xordvmt.mongodb.net/?appName=Cluster0")
.then(()=> console.log("MongoDB connected succesfully"))
.catch((error)=> console.log("MongoDB" , error))

const userSchema = new mongoose.Schema({
    name : String,
    age : Number,
    email : String,
    username : {
        type : String,
        required : [true , "Username must be there"],
        unique : true,
        minlength : 4
    },
    password : String
})
const User = mongoose.model("user" , userSchema);
userSchema.pre("save" , async function(next){
    const user = this;
    if(!user.isModified("password")){
        return next();
    }
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword; 
        next();
    }
    catch(error){   
        return next(error); 
    } 
})

passport.use( new localStrategy(async (username , password , done)=>{
    try{
            const user =    await User.findOne({username : username});
            if(!user){
                return done(null , false , {message : "User not found"})
            }
            const isPasswordMatch = await user.password === password;
           if(isPasswordMatch){
            return done(null , user);
           }
              else{ 
                return done(null , false , {message : "Incorrect password"})
              }
    }
    catch(error){
        return done(error);
    }
}))

app.use(passport.initialize());
const logRequest = (req , res , next)=>{
    console.log("Request received at " , new Date());
    next();
}
app.use(logRequest);
const localAuth = passport.authenticate("local" , {session : false});
app.get("/" ,localAuth, (req , res)=>{
    res.status(200).send("Server has been started")
})
app.get("/user" ,logRequest, async (req , res)=>{
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