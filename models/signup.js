const mongoose = require("mongoose")
const schema = mongoose.Schema(
    {
        "name":{type:String,required:true},
        "emailid":{type:String,required:true},
        "pass":{type:String,required:true}
    }
)

const signupmodel=mongoose.model("users",schema);
module.exports={signupmodel}