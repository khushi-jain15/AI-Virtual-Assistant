# ⭐ AI Virtual Assistant

A full-stack AI-powered virtual assistant built using **Google Gemini API**, **React**, **Node.js**, and **MongoDB**.
The assistant can take user input (text), send it to Gemini, and display the intelligent response on the UI.
This project also includes **Signup/Login**, user data management, and assistant customization features.

---

## 📌 Overview

This AI Virtual Assistant allows users to:

* Create an account & log in
* Customize their assistant (choose avatar image, set assistant name, etc.)
* Ask text-based questions to the AI
* Receive real-time responses from Google Gemini
* Store user data (name, avatar, preferences) securely in MongoDB

This project has **two parts**:

### ✔ Frontend (React.js)

### ✔ Backend (Node.js + Express)

---

## 🚀 Features

### 🔹 **User Authentication**

* Signup & Login
* Secure cookies
* Persistent user session

### 🔹 **Assistant Customization**

* Upload/select avatar
* Save assistant name
* Store configurations in backend

### 🔹 **Gemini AI Integration**

* Send user prompts
* Receive text responses
* Display responses in chat UI

### 🔹 **Modern UI**

* Built using React.js components
* Responsive layout
* Smooth interaction flow

---

## 🛠️ Tech Stack

### **Frontend**

* React.js
* Context API
* Axios

### **Backend**

* Node.js
* Express.js
* MongoDB (Mongoose)
* Google Gemini API

---

## 🔐 Environment Variables

Create a `.env` file inside the backend folder:

```
PORT=8000
MONGO_URI=your_mongodb_url
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_secret_key
```

---

## 📂 Folder Structure

```
AI-Virtual-Assistant/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── gemini.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── App.js
│
└── README.md
```

---

## ▶️ Running the Project

### **Backend Setup**

```sh
cd backend
npm install
npm run dev
```

### **Frontend Setup**

```sh
cd frontend
npm install
npm run dev
```

Frontend runs typically on:
👉 `http://localhost:5173/`

Backend runs on:
👉 `http://localhost:8000/`

---

## Live link 
🔹 Frontend (React App)

👉 https://ai-virtual-assistant-5b15.onrender.com

🔹 Backend (Node.js + Express API)

👉 https://virtualassistant-backend-xwbz.onrender.com

## 🤝 Contributing

Feel free to contribute by submitting issues or pull requests.

---

## 📄 License

This project is licensed under the MIT License.

