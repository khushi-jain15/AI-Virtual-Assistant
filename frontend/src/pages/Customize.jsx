import React, { useState ,useRef, useContext} from 'react'
import Card from '../components/Card'
import image1 from "../assets/Avtar1.png"
import image2 from "../assets/Avtar2.webp"
import image3 from "../assets/Avtar3.png"
import image4 from "../assets/Avtar4.png"
import image5 from "../assets/Avtar5.png"
import image6 from "../assets/Avtar6.png"
import { FaUpload } from "react-icons/fa";
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from "react-icons/fa";


function Customize() {
    const {serverURL,
        userData , setUserdata,
        backendImage , setBackendImage,
        frontendImage , setFrontendImage,
        selectedImage , setSelectedImage} = useContext(userDataContext);
    const inputImage = useRef();
    const navigate = useNavigate()
    const handleImage = (e) =>{
        const file = e.target.files[0];
        setBackendImage(file)
        const tempURL = URL.createObjectURL(file);

         setFrontendImage(tempURL);
         setSelectedImage(tempURL); 
    }


  return (
    <div className='w-full min-h-[100vh] bg-gradient-to-t from-[black] to-[#3f3f9a] flex justify-center items-center flex-col p-[20px] cursor-pointer'>
        <div className='w-full max-w-[90%] flex items-center justify-center mb-[30px] relative'>
                <FaArrowLeft 
                    className='absolute left-0 text-white w-[24px] h-[24px] sm:w-[28px] sm:h-[28px] hover:scale-110 transition-transform cursor-pointer' 
                    onClick={() => console.log('Navigate back')}
                />
                <h1 className='text-white text-center text-[24px] sm:text-[32px] font-semibold'>
                    Select your <span className='text-[#ad57ad] text-[26px] sm:text-[36px] font-bold'>Assistant Image</span>
                </h1>
            </div>
        <div className='w-[90%] max-w-[60%] flex justify-center items-center flex-wrap gap-[20px]'>
            <Card image={image1}/>
            <Card image={image2}/>
            <Card image={image3}/>
            <Card image={image4}/>
            <Card image={image5}/>
            <Card image={image6}/>

            <div className={`w-[150px] h-[220px] bg-blue-900 border-2 border-[blue] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-200 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${
        selectedImage === "input" 
          ? "border-4 border-white shadow-2xl shadow-blue-200"
          : ""
      }`} onClick={()=> {inputImage.current.click(); setSelectedImage("input")}}> 
                {!frontendImage && <FaUpload className='text-white w-[25px] h-[25px] '/>}
                {frontendImage && <img src={frontendImage} className='h-full object-cover'/>}
            
            </div>
            <input type='file' accept='image/*' ref={inputImage} hidden onChange={handleImage}/>
        </div>
        {selectedImage &&
        <button className="w-[90%] max-w-[400px] h-[55px] mt-[30px] rounded-full 
                      bg-gradient-to-r from-blue-600 to-blue-400 
                      text-white text-[20px] font-semibold
                      shadow-[0_0_20px_rgba(0,147,255,0.6)]
                      hover:shadow-[0_0_35px_rgba(0,147,255,0.9)]
                      hover:scale-105 transition-all duration-300 cursor-pointer"
                      onClick={() => navigate("/customize2")}
                      >         
                Next
        </button>
        }
    </div>
    
  )
}

export default Customize
