import User from "../models/user.model.js"
import {uploadOnCloudinary} from "../config/cloudinary.js"
import geminiResponse from '../gemini.js'
import moment from "moment";
import { response } from "express";



export const  getCurrentUser = async (req, res) =>{
    try {
        const userId = req.userId
        const user = await User.findById(userId).select("-password");
        if(!user){
           return res.status(404).json({message : "User not found"})
        }
        return res.status(200).json(user);

    } catch (error) {
        return res.status(400).json({
            message : "Get Current user error"
        });

    }
}


export const updateController = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;

    // declare variable properly
    let assistantImage;

    // If user uploaded a new file → upload to Cloudinary
    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    }else{
        assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(req.userId, { assistantName, assistantImage }, { new: true }).select('-password');
    res.status(200).json({ user });


  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Update Assitant error" });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body
    console.log("Command received in backend:", command);
    
    if (!command || command.trim() === '') {
      return res.status(400).json({
        type: "general",
        userInput: "",
        response: "Please provide a command."
      })
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        type: "general",
        userInput: "",
        response: "User not found."
      })
    }

    const userName = user.name
    const assistantName = user.assistantName

    console.log("Getting response from Gemini...");
    
    const result = await geminiResponse(command, userName, assistantName)
    console.log("Gemini raw result:", result);

  
    let gemResult;
    try {
      gemResult = JSON.parse(result);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
      gemResult = {
        type: "general",
        userInput: command,
        response: "I heard: " + command
      };
    }

    console.log("Processed result:", gemResult);
    
    // Handle different types of responses
    const type = gemResult.type || 'general';
    
    switch(type) {
      case 'get_date': 
        return res.json({
          type,
          userInput: gemResult.userInput || command,
          response: `Current date is ${moment().format("MMMM Do, YYYY")}`
        })

      case 'get_time': 
        return res.json({
          type,
          userInput: gemResult.userInput || command,
          response: `Current time is ${moment().format("h:mm A")}`
        })

      // ... rest of your switch cases remain the same

      default:
        console.log("General conversation response:", gemResult.response);
        return res.json({
          type: 'general',
          userInput: gemResult.userInput || command,
          response: gemResult.response || "I heard: " + command
        });
    }

  } catch (error) {
    console.error("Error in askToAssistant:", error);
    return res.status(500).json({
      type: "general",
      userInput: "",
      response: "I encountered an error. Please try again."
    })
  }
}