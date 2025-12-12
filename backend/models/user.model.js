import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    email:{
        type : String,
        required : true,
        unique : true,
    },
    password :{
        type : String,
        required : true
    },
    assistantName: {
        type : String,
    },
    assistantImage :{
        type : String,
    },
    history :[
        {type : String}
    ] // History be array so that all the history  of the user be store in one array 
} , {timestamps : true})

const User = mongoose.model("User", userSchema);
export default User;