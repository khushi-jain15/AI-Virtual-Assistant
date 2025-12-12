import React from 'react';
import { Route } from 'react-router-dom';
import bg from '../assets/wallpaper.png';
import { FaEye } from "react-icons/fa";
import { useState } from 'react';
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';

function Signin() {
  const [showpassword , setshowpassword] = useState(false);
  const{serverURL , userData , setUserdata} = useContext(userDataContext)
  const navigate = useNavigate();
  const[email,setEmail] = useState("");
  const[password , setPassword] = useState("");
  const[err ,seterror] = useState("");
  const[loading , setLoading] = useState(false);


  const handleSignin = async (e) => {
  e.preventDefault();
  seterror("")
  setLoading(true)
  console.log("Signin triggered");

  try {
    let result = await axios.post(
      `${serverURL}/api/auth/signin`,
      {  email, password },
      { withCredentials: true }
    );

    console.log("Response:", result);
    setUserdata(result.data)
    setLoading(false);
    
    // Navigate based on whether user has completed customization
    if (result.data?.assistantImage && result.data?.assistantName) {
      navigate("/");
    } else {
      navigate("/customize");
    }
  } catch (error) {
    console.log("ERROR:", error);
    setUserdata(null)
    seterror(error.response?.data?.message || "An error occurred");
    setLoading(false);
  }
};

  return (
    <div
      className='w-full min-h-[100vh] flex items-center justify-center md:justify-end md:pr-[10%] py-8'
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#0a1628"
      }}
    >
      <form className='w-[90%] h-auto min-h-[600px] max-w-[500px] bg-[#0000003c] backdrop-blur shadow-blue-950 flex flex-col items-center justify-center gap-[20px] px-[20px] py-8' onSubmit={handleSignin}>
        <h1 className='text-white text-[30px] font-semibold mb-[30px] text-center'>SignIn to <span className='text-blue-400'>AI Virtual Assistant</span></h1>
      
        <input type='email' placeholder='Enter your Email' className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[30px] rounded-full text-[18px]' required onChange={(e)=>setEmail(e.target.value)} value={email}></input>
        <div className='w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative '>
          <input type={showpassword?"text" : "password"} placeholder='Enter the password' className='w-full h-full rounded-full outline-none bg-transparent  placeholder-gray-300 px-[20px] py-[30px] rounded-full text-[18px]'required onChange={(e)=>setPassword(e.target.value)} value={password}></input>
          {!showpassword && <FaEye className='absolute top-[18px] right-[20px] text-[white] cursor-pointer' onClick={() =>setshowpassword(true)}/>}
          {showpassword && <FaEyeSlash  className='absolute top-[18px] right-[20px] text-[white] cursor-pointer' onClick={() =>setshowpassword(false)}/>}
          
        </div>
        {err.length > 0 && <p className='text-red-500 text-[17px]'>*{err}
          </p>}
        <button  onClick={() => console.log("Button clicked")} 
            className="w-full h-[55px] mt-[10px] rounded-full 
                      bg-gradient-to-r from-blue-600 to-blue-400 
                      text-white text-[20px] font-semibold
                      shadow-[0_0_20px_rgba(0,147,255,0.6)]
                      hover:shadow-[0_0_35px_rgba(0,147,255,0.9)]
                      hover:scale-105 transition-all duration-300"
          disabled={loading}>
            {loading? "Loading.....":"SignIn"}
        </button>
      <p className='text-[white] text-[18px] cursor-pointer text-center'>Create an account ? <span className='text-blue-700' onClick={() =>navigate("/signup")}>Sign Up</span></p>
      </form>
       
    </div>
  );
}

export default Signin;
