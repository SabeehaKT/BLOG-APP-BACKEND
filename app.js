const express = require("express")
const mongoose = require ("mongoose")
const cors = require("cors")
const bcryptjs = require ("bcryptjs") //for ciphertexting
const jwt = require("jsonwebtoken")
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


app.post("/signin",(req,res)=>{
    
    let input = req.body
    signupmodel.find({"emailid":req.body.emailid}).then(
        (response)=>{
            if(response.length > 0){

                let dbPassword = response[0].pass
                console.log(dbPassword)
                bcryptjs.compare(input.pass,dbPassword,(error,isMatch)=>{

                    if (isMatch) {
                        jwt.sign({email:input.emailid},"blog-app",{expiresIn:"1d"},(error,token)=>{
                            if (error) {
                               res.json("unable to create a token") 
                            } else {
                                res.json({"status":"success","userId":response[0]._id,"token":token})
                            }
                        })
                    } else {
                        res.json({"status":"Incorrect"})
                    }
                })
            }else{
                
                res.json({"status":"user not found"})
            }
        }
    ).catch()

})

app.post("/viewusers",(req,res)=>{
    let token = req.headers["token"]
    jwt.verify(token,"blog-app",(error,decoded)=>{
        if (error) {
            res.json({"status":"unauthorized access"})
        } else {
            if (decoded) {
                signupmodel.find().then(
                    (response)=>{
                        res.json(response)
                    }
                ).catch()
            }
        }
    })
    
})


app.listen(8081,()=>{
    console.log("server started")
})