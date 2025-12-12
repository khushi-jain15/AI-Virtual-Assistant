import React, { useContext, useState  } from 'react'
import { userDataContext } from '../context/UserContext';
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Customize2() {
  const { userData, backendImage, selectedImage, serverURL, setUserdata } =
    useContext(userDataContext);
  const navigate = useNavigate(); 
  const [assistentname, setassitentName] = useState(userData?.assistantName || "");
  const[Loading ,setLoading] = useState(false);
  
  const handleUpdateAssistant = async () => {
    setLoading(true)
    try {
      if (!userData) {
        console.log("User not logged in");
        return navigate("/signin");
      }

      let formData = new FormData();
      formData.append("assistantName", assistentname);

      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }

      const result = await axios.put(
        `${serverURL}/api/user/update`,
        formData,
        { withCredentials: true }
      );
      
      setLoading(false)
      console.log("Updated:", result.data);
      setUserdata(result.data.user);
      
      // Set customization timestamp before navigating to home
      localStorage.setItem('customizationTimestamp', Date.now().toString());
      
      navigate("/");
      
    } catch (error) {
      setLoading(false)
      console.log(error.message);
    }
  };

  return (
    <div className='w-full min-h-[100vh] bg-gradient-to-t from-[black] to-[#3f3f9a] flex justify-center items-center flex-col p-[20px] relative cursor-pointer'>
      <FaArrowLeft className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px]' onClick={() => navigate("/customize")}/>
      <h1 className='text-white mb-[30px] text-center text-[30px]'> Enter your <span className='text-[#ad57ad] text-4xl'>Assistant Name</span></h1>

      <input 
        type='text' 
        placeholder='eg. Sifra' 
        className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[30px] rounded-full text-[18px]' 
        required 
        onChange={(e) => {setassitentName(e.target.value)}} 
        value={assistentname}
      />

      {assistentname &&
        <button 
          className="w-[90%] max-w-[400px] h-[55px] mt-[30px] rounded-full 
                    bg-gradient-to-r from-blue-600 to-blue-400 
                    text-white text-[20px] font-semibold
                    shadow-[0_0_20px_rgba(0,147,255,0.6)]
                    hover:shadow-[0_0_35px_rgba(0,147,255,0.9)]
                    hover:scale-105 transition-all duration-300 cursor-pointer"
          disabled={Loading}
          onClick={handleUpdateAssistant}
        >         
          {!Loading ? "Finally Create your Virtual assistant" : "Loading....."}
        </button>
      }
    </div>
  )
}

export default Customize2