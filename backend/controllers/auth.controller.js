import { genToken } from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cookie from "cookie-parser";

export const signUp = async (req ,res) =>{
    try {
        const {name , email , password} = req.body;
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(409).json({message : "User is already exist!"});
        }
        if(password.length < 6){
            return res.status(400).json({message : "Please enter password of atleast 6 character!"})
        }
        const hashedPassword = await bcrypt.hash(password , 10);
        const newUser = await User.create({
            name ,
            email,
            password : hashedPassword
        });

        const token = await genToken(newUser._id)
        res.cookie("token" ,token ,{
            httpOnly : true,
            maxAge : 7*24*60*60*1000, // 7 days tokens 7days , 24hrs per day , 60 mins per hr, 60 sec per min , 1000 ms per sec
            sameSite: "lax",
            secure: false,

        })

        res.status(201).json(newUser);
    }
    catch(error) {
        res.status(500).json({message : `signup failed due to ${error.message}`});
        
    }
}

export const LogIn = async (req ,res) =>{
    try {
        const {email , password} = req.body;
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message : "Email does not exist!"});
        }
        const isMatch = await bcrypt.compare(password , user.password)
        if(!isMatch){
            return res.status(400).json({message :"Incorrect password!"});
        }
        const token = await genToken(user._id)
        res.cookie("token" ,token ,{
            httpOnly : true,
            sameSite : "lax",
            secure : false,
        })

        res.status(200).json(user);
    }
    catch(error) {
        res.status(500).json({message : `Login failed due to ${error.message}`});      
    }
}

export const logout = async(req ,res) =>{
    try {
        res.clearCookie("token" )
            return res.status(200).json({message :"LogOut successfully!"})
    }catch(error){
        res.status(500).json({message : `Logout failed due to ${error.message}`});
    }
}