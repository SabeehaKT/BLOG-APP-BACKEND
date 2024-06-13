const express = require("express")
const mongoose = require ("mongoose")
const cors = require("cors")
const bcryptjs = require ("bcryptjs") //for ciphertexting
const {signupmodel} = require("./models/signup")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://sabeeha02:sabeehamongodb@cluster0.05m7a.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0")

const generateHashedPassword= async (password)=>{
    const salt = await bcryptjs.genSalt(10)
    return bcryptjs.hash(password,salt)
}

app.post("/signup",async (req,res)=>{
    let input = req.body
    let hashedPassword = await generateHashedPassword(input.pass)
    console.log(hashedPassword)
    input.pass = hashedPassword
    let signup = new signupmodel(input)
    signup.save()
    res.json({"status":"success"})
})


app.listen(8081,()=>{
    console.log("server started")
})