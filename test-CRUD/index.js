const express = require("express");
const mongoose = require("mongoose")
const app = express();
app.use(express.json());
// mongodb+srv://manan:manan0112@cluster0.xordvmt.mongodb.net/?appName=Cluster0
mongoose.connect("")
    .then(() => console.log("MongoDB connected Succesfully"))
    .catch((error) => console.log("Mongodb error ", error))


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    age: {
        type: Number,
        required: true,
        min: 18
    },
    role: {
        type: String,
        enum: ["Student", "Mentor", "Admin"],
        default: "Student"
    },
    course: {
        type: String,
        enum: ["MERN", "Java", "Python", "Data Science"]
    },
    isActive: {
        type: Boolean,
        default: true
    }
});
const User = mongoose.model("users", userSchema);

app.post("/students", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ "Error ": error.message })
    }
})

app.post("/students/bulk", async (req, res) => {
    try {
        const user = await User.insertMany(req.body)
        res.status(201).json({ "Inserted": user });
    }
    catch (error) {
        res.status(500).json({ "Error": error.message })
    }
})

app.get("/students", async (req, res) => {
    const user = await User.find({});
    res.status(200).json(user);
})
app.get("/students/:id", async (req, res) => {
  try{  const id = req.params.id

    if(!id){
        return res.status(500).send("Student does  not exist");
    }
    const user = await User.findById({ _id: id });
    res.status(200).json(user);}
      catch(error){
        res.status(500).send("Student does not exist on this id 😢")
    }
})
app.get("/students/course/:course", async (req, res) => {
 try{   const id = req.params.course
    const user = await User.find({ course: id });
    res.status(200).json(user);}
      catch(error){
        res.status(404).send("Student course is invalid or wrong spelling 😢")
    }
})

app.put("/students/:id", async (req, res) => {
try{    const id = req.params.id
    const data = await User.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(201).json({ "Updated": data });}
      catch(error){
        res.status(404).send("Student does not exist on this id 😢")
    }
})

app.delete("/students/:id", async (req, res) => {
    try{const id = req.params.id;
    if(!id){
        res.status(500).send("Student does not exist on this id 😢")
    }
    const user = await User.deleteOne({ _id: id });
    res.status(201).json({ "Deleted": user })}
    catch(error){
        res.status(404).send("Student does not exist on this id 😢")
    }
})
app.listen(3000, () => {
    console.log("Server hass been started");

})