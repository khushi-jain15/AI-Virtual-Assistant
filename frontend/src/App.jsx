import React, { useContext, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Signup from './pages/signup.jsx'
import Signin from './pages/signin.jsx'
import Customize from './pages/Customize.jsx'
import { userDataContext } from './context/userContext.jsx'
import Home from './pages/Home.jsx'
import Customize2 from './pages/Customize2.jsx'

function App() {
  const { userData, setUserdata } = useContext(userDataContext)

  return (
    <Routes>
      {/* Root path: redirect to signin if not logged in */}
      <Route
        path="/"
        element={
          !userData 
            ? <Navigate to="/signup" />
            : userData?.assistantImage && userData?.assistantName
            ? <Home />
            : <Navigate to="/customize" />
        }
      />

      {/* Signin: landing page for non-authenticated users */}
      <Route
        path="/signin"
        element={
          !userData
            ? <Signin />
            : userData?.assistantImage && userData?.assistantName
            ? <Navigate to="/customize" />
            : <Navigate to="/" />
        }
      />

      {/* Signup: should show only if NOT logged in */}
      <Route
        path="/signup"
        element={
          !userData
            ? <Signup />
            : <Navigate to="/customize" />
        }
      />

      {/* Customize: user must be logged in */}
      <Route
        path="/customize"
        element={
          userData
            ? <Customize />
            : <Navigate to="/signin" />
        }
      />
      
      <Route
        path="/customize2"
        element={
          userData
            ? <Customize2 />
            : <Navigate to="/signin" />
        }
      />
    </Routes>
  )
}

export default App