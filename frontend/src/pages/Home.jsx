import { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import voice1 from '../assets/Voice1.gif'
import voice2 from '../assets/voice2.gif'

function Home() {
  const navigate = useNavigate();
  const { userData, setUserdata, serverURL, getGeminiResponse } = useContext(userDataContext);
  const [listening, setListening] = useState(false)
  const [lastCommand, setLastCommand] = useState("")
  const [detectedLanguage, setDetectedLanguage] = useState('en-US')
  const isSpeaking = useRef(false)
  const recognitionRef = useRef(null)
  const synth = window.speechSynthesis
  const isRecognizing = useRef(false)
  const shouldRestart = useRef(true)
  const [isAISpeaking, setIsAISpeaking] = useState(false)

  useEffect(() => {
    if (!userData) {
      navigate("/signin");
      return;
    }

    const customizationTimestamp = localStorage.getItem('customizationTimestamp');
    const oneHour = 60 * 60 * 1000;
    const hasCustomization = userData?.assistantImage && userData?.assistantName;

    if (!hasCustomization || !customizationTimestamp || (Date.now() - parseInt(customizationTimestamp)) > oneHour) {
      localStorage.removeItem('customizationTimestamp');
      navigate("/customize");
    }
  }, [userData, navigate]);

  const handleLogout = async () => {
    try {
      shouldRestart.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      synth.cancel();
      
      const result = await axios.get(`${serverURL}/api/auth/logout`, { withCredentials: true })
      setUserdata(null);
      localStorage.removeItem('customizationTimestamp');
      navigate("/signup");
    } catch (error) {
      setUserdata(null);
      console.log(error.message);
    }
  };

  const speak = (text, language = 'en-US') => {
    return new Promise((resolve) => {
      synth.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
  
      const voices = synth.getVoices();
      
      if (language === 'hi-IN') {
        const hindiVoice = voices.find(voice => 
          voice.lang === 'hi-IN' || 
          voice.lang.startsWith('hi')
        );
        if (hindiVoice) {
          utterance.voice = hindiVoice;
        }
      } else {
        const englishVoice = voices.find(voice => 
          voice.lang === 'en-US' || 
          voice.lang === 'en-GB' || 
          voice.lang.startsWith('en')
        );
        if (englishVoice) {
          utterance.voice = englishVoice;
        }
      }
      
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = language;
      
      isSpeaking.current = true;
      setIsAISpeaking(true);
      
      utterance.onend = () => {
        isSpeaking.current = false;
        setIsAISpeaking(false);
        resolve();
      };
      
      utterance.onerror = () => {
        isSpeaking.current = false;
        setIsAISpeaking(false);
        resolve();
      };
      
      synth.speak(utterance);
    });
  };

  const handleCommand = async (data) => {
    const { type, userInput, response } = data;
    
    console.log("Handling command:", { type, userInput, response });

    switch (type) {
      case "google_search":
        const googleQuery = encodeURIComponent(userInput);
        window.open(`https://www.google.com/search?q=${googleQuery}`, "_blank");
        await speak(response, detectedLanguage);
        break;

      case "youtube_search":
      case "youtube_play":
        const youtubeQuery = encodeURIComponent(userInput);
        window.open(`https://www.youtube.com/results?search_query=${youtubeQuery}`, "_blank");
        await speak(response, detectedLanguage);
        break;

      case "youtube_open":
        window.open("https://www.youtube.com", "_blank");
        await speak(response, detectedLanguage);
        break;

      case "calculator_open":
        window.open("https://www.google.com/search?q=calculator", "_blank");
        await speak(response, detectedLanguage);
        break;

      case "instagram_open":
        window.open("https://www.instagram.com", "_blank");
        await speak(response, detectedLanguage);
        break;

      case "facebook_open":
        window.open("https://www.facebook.com", "_blank");
        await speak(response, detectedLanguage);
        break;

      case "weather_show":
        window.open("https://www.google.com/search?q=weather", "_blank");
        await speak(response, detectedLanguage);
        break;

      case "get_time":
      case "get_date":
        await speak(response, detectedLanguage);
        break;

      case "general":
      default:
        console.log("Speaking detailed response:", response);
        await speak(response, detectedLanguage);
        break;
    }
    if (shouldRestart.current) {
      setTimeout(() => startRecognition(), 500);
    }
  };

  const detectLanguage = (transcript) => {
    const lowerTranscript = transcript.toLowerCase();
    
    const hindiPatterns = /[\u0900-\u097F]|kya|kaise|kahan|kab|kaun|mujhe|tumhe|hai|ho|hain|namaste|namaskar|kholo|chalao|batao|dikha|suno|bolo/;
    if (hindiPatterns.test(lowerTranscript)) {
      return 'hi-IN';
    }
    
    return 'en-US';
  };

  const startRecognition = () => {
    if (!recognitionRef.current || isSpeaking.current || isRecognizing.current || !shouldRestart.current) {
      return;
    }

    try {
      isRecognizing.current = true;
      recognitionRef.current.start();
    } catch (error) {
      isRecognizing.current = false;
      if (error.name !== "InvalidStateError") {
        console.error("Recognition start error:", error);
      }
    }
  };

  useEffect(() => {
    if (!userData) return;

    const SpeechRecognition = 
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    shouldRestart.current = true;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      console.log("Recognition started");
      setListening(true);
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      isRecognizing.current = false;
      setListening(false);
      
      if (shouldRestart.current && !isSpeaking.current) {
        setTimeout(() => {
          startRecognition();
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      isRecognizing.current = false;
      setListening(false);

      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.error("Recognition error:", event.error);
      }
      if (event.error !== 'aborted' && event.error !== 'no-speech' && shouldRestart.current) {
        setTimeout(() => {
          startRecognition();
        }, 2000);
      } else if (event.error === 'no-speech' && shouldRestart.current) {
        setTimeout(() => {
          startRecognition();
        }, 500);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Heard:", transcript);

      const lang = detectLanguage(transcript);
      setDetectedLanguage(lang);

      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        isRecognizing.current = false;
        setListening(false);
        setLastCommand(transcript);

        try {
          const data = await getGeminiResponse(transcript);
          console.log("Assistant response:", data);
          await handleCommand(data);
        } catch (error) {
          console.error("Error getting response:", error);
          await speak("Sorry, I encountered an error. Please try again.", lang);
          if (shouldRestart.current) {
            setTimeout(() => startRecognition(), 1000);
          }
        }
      }
    };

    setTimeout(() => {
      startRecognition();
    }, 1000);

    return () => {
      shouldRestart.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setListening(false);
      isRecognizing.current = false;
      synth.cancel();
    };
  }, [userData, serverURL, getGeminiResponse]);

  return (
    <div className='relative w-full min-h-[100vh] bg-gradient-to-br from-[#0a0a1f] via-[#1a1a3e] to-[#2f2f78] flex justify-center items-center flex-col gap-[15px] overflow-hidden'>
      {/* CSS Animations */}
      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rotateReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes slideRotate {
          0% { transform: translateX(-100%) rotate(0deg); }
          100% { transform: translateX(100vw) rotate(360deg); }
        }
        .rotate-slow { animation: rotate 20s linear infinite; }
        .rotate-medium { animation: rotate 15s linear infinite; }
        .rotate-fast { animation: rotate 10s linear infinite; }
        .rotate-reverse { animation: rotateReverse 25s linear infinite; }
        .float-anim { animation: float 3s ease-in-out infinite; }
        .pulse-anim { animation: pulse 4s ease-in-out infinite; }
        .slide-rotate { animation: slideRotate 30s linear infinite; }
      `}</style>

      {/* Rotating Circles - Top Left */}
      <div className="absolute top-[10%] left-[10%] w-[200px] h-[200px] border-4 border-blue-500/30 rounded-full rotate-slow pointer-events-none"></div>
      <div className="absolute top-[15%] left-[12%] w-[150px] h-[150px] border-4 border-purple-500/40 rounded-full rotate-reverse pointer-events-none"></div>
      
      {/* Rotating Circles - Bottom Right */}
      <div className="absolute bottom-[15%] right-[8%] w-[250px] h-[250px] border-4 border-cyan-500/30 rounded-full rotate-medium pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[180px] h-[180px] border-4 border-pink-500/40 rounded-full rotate-fast pointer-events-none"></div>

      {/* Rotating Triangles */}
      <div className="absolute top-[40%] left-[5%] rotate-slow pointer-events-none">
        <div className="w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[100px] border-b-blue-400/30"></div>
      </div>
      
      <div className="absolute top-[60%] right-[15%] rotate-reverse pointer-events-none">
        <div className="w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[80px] border-b-purple-400/30"></div>
      </div>

      <div className="absolute bottom-[40%] left-[20%] rotate-fast pointer-events-none">
        <div className="w-0 h-0 border-t-[70px] border-t-pink-400/30 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent"></div>
      </div>

      {/* Floating Squares */}
      <div className="absolute top-[25%] right-[20%] w-[80px] h-[80px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 rotate-medium pointer-events-none"></div>
      <div className="absolute bottom-[30%] left-[15%] w-[60px] h-[60px] bg-gradient-to-br from-cyan-500/20 to-pink-500/20 rotate-reverse pointer-events-none"></div>

      {/* Pulsing Circles */}
      <div className="absolute top-[50%] left-[5%] w-[100px] h-[100px] bg-blue-500/10 rounded-full pulse-anim pointer-events-none"></div>
      <div className="absolute top-[30%] right-[5%] w-[120px] h-[120px] bg-purple-500/10 rounded-full pulse-anim pointer-events-none" style={{animationDelay: '2s'}}></div>

      {/* Sliding Shapes */}
      <div className="absolute top-[20%] w-[40px] h-[40px] bg-gradient-to-r from-cyan-400/30 to-blue-400/30 slide-rotate pointer-events-none"></div>
      <div className="absolute top-[70%] w-[30px] h-[30px] bg-gradient-to-r from-pink-400/30 to-purple-400/30 slide-rotate pointer-events-none" style={{animationDelay: '15s'}}></div>

      {/* Gradient Orbs */}
      <div className="absolute top-[10%] right-[30%] w-[150px] h-[150px] bg-gradient-radial from-blue-500/20 to-transparent rounded-full blur-2xl pulse-anim pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[25%] w-[200px] h-[200px] bg-gradient-radial from-purple-500/20 to-transparent rounded-full blur-2xl pulse-anim pointer-events-none" style={{animationDelay: '3s'}}></div>

      {/* Top Right Buttons */}
      <div className='absolute top-[25px] right-[25px] flex flex-col gap-3 z-10'>
        <button
          onClick={() => {
            shouldRestart.current = false;
            if (recognitionRef.current) {
              recognitionRef.current.stop();
            }
            synth.cancel();
            localStorage.removeItem('customizationTimestamp');
            navigate("/customize");
          }}
          className="px-5 py-2 rounded-full 
                     bg-gradient-to-r from-blue-600 to-blue-400 
                     text-white text-[16px] font-semibold
                     shadow-[0_0_15px_rgba(0,147,255,0.6)]
                     hover:shadow-[0_0_25px_rgba(0,147,255,0.9)]
                     hover:scale-105 transition-all duration-300"
        >
          Customize Assistant
        </button>

        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-full 
                     bg-gradient-to-r from-red-600 to-red-400 
                     text-white text-[16px] font-semibold
                     shadow-[0_0_15px_rgba(255,0,0,0.6)]
                     hover:shadow-[0_0_25px_rgba(255,0,0,0.9)]
                     hover:scale-105 transition-all duration-300"
        >
          Logout
        </button>
      </div>

      {/* Main Content - Assistant Image */}
      <div className='relative z-10 w-[500px] h-[400px] flex justify-center items-center flex-col rounded-4xl'>
        <div className='relative float-anim'>
          {/* Glow effect behind image */}
          <div className='absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur-xl'></div>
          <img src={userData?.assistantImage} alt="" className='relative h-[400px] object-cover rounded-2xl shadow-2xl' />
        </div>
      </div>

      {/* Assistant Name with Gradient */}
      <h1 className='relative z-10 text-white text-[24px] font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>
        I'm {userData?.assistantName}
      </h1>

      {/* Voice Animation GIFs */}
      <div className='relative z-10 flex justify-center items-center h-[80px]'>
        {listening && !isAISpeaking && (
          <div className='pulse-anim'>
            <img 
              src={voice1} 
              alt="User Speaking" 
              className='w-[120px] h-[180px] object-contain'
            />
          </div>
        )}
        {isAISpeaking && (
          <div className='pulse-anim'>
            <img 
              src={voice2} 
              alt="AI Speaking" 
              className='w-[120px] h-[180px] object-contain'
            />
          </div>
        )}
      </div>

      {/* Language Indicator */}
      {detectedLanguage === 'hi-IN' && (
        <div className='relative z-10 text-white text-[12px] bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20'>
          Language: Hindi
        </div>
      )}
    </div>
  )
}

export default Home