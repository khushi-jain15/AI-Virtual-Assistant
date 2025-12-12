import React, { createContext, useEffect, useState } from "react";
import axios from "axios"

export const userDataContext = createContext()

function UserContext({children}) {
    const serverURL = "http://localhost:8000"
    const[userData , setUserdata] = useState(null);
    const[frontendImage , setFrontendImage ] = useState(null);
    const[backendImage , setBackendImage] = useState(null);
    const[selectedImage , setSelectedImage] = useState(null);

    const handleCurrentUser = async () => {
      try {
        const result = await axios.get(`${serverURL}/api/user/current`, {withCredentials : true})
        
        const customizationTimestamp = localStorage.getItem('customizationTimestamp');
        const oneHour = 60 * 60 * 1000;
        
        if (customizationTimestamp && (Date.now() - parseInt(customizationTimestamp)) < oneHour) {
          setUserdata(result.data);
        } else {
          localStorage.removeItem('customizationTimestamp');
          setUserdata({
            ...result.data,
            needsCustomization: !result.data.assistantImage || !result.data.assistantName
          });
        }

        console.log(result.data);
        
      } catch (error) {
        console.log(error.message);
      }
    }

    useEffect(() => {
      handleCurrentUser()
    }, [])

    const getGeminiResponse = async (command) => {
      try {
        console.log("Sending command to backend:", command);
        
        const result = await axios.post(
          `${serverURL}/api/user/asktoassistant`,
          { command }, // This is correct - sending as object with 'command' key
          { withCredentials: true }
        )
        
        console.log("Backend response:", result.data);
        return result.data;
        
      } catch (error) {
        console.error("Error in getGeminiResponse:", error);
        console.error("Error response:", error.response?.data);
        
        // Return a fallback response
        return {
          type: "general",
          userInput: command,
          response: "Sorry, I'm having trouble processing that command."
        };
      }
    }

    const value = {
        serverURL,
        userData, 
        setUserdata,
        backendImage, 
        setBackendImage,
        frontendImage, 
        setFrontendImage,
        selectedImage, 
        setSelectedImage,
        getGeminiResponse
    }

    return (
      <div>
        <userDataContext.Provider value={value}>
          {children}
        </userDataContext.Provider>
      </div>
    )
}

export default UserContext