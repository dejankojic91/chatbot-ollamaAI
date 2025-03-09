# 🖥️ Chatbot Backend (Ollama AI)

This is the **backend** of the **Chatbot AI** application, built using **Node.js, Express, and MongoDB**.  
It handles **authentication, user management, chat history, and integration with Ollama AI API**.

---

## 🚀 Features
✔ **User Authentication (JWT & Refresh Tokens)**  
✔ **Secure API with Protected Routes**  
✔ **Chat with AI (Ollama API Integration)**  
✔ **Store & Retrieve Conversation History**  
✔ **Real-time Updates with Optimized Queries**  
✔ **RESTful API for Frontend Integration**  

---

## 📂 Project Structure
```
backend/ │── src/ │ ├── controllers/ # Handles API logic │ ├── models/ # Mongoose models (User, Conversation) │ ├── routes/ # Express API routes │ ├── middleware/ # Authentication & error handling │ ├── utils/ # Helper functions & configurations │── README.md # Backend documentation
```


---

## 🛠 Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (Access & Refresh Tokens)
- **AI Integration:** Ollama API

---

## 🔧 Installation & Setup
### 1️⃣ **Navigate to the Backend Directory**
```sh
cd backend
```

### 2️⃣ **Install Dependencies**
```sh
npm install
```

### 3️⃣ **Run the Development Server**
```sh
npm run dev
```
The backend will run on http://localhost:3005

## 📂  .env Configuration
PORT=3005
MONGO_URI=mongodb+srv://<your_mongodb>
JWT_SECRET=your_secret
REFRESH_SECRET=your_refresh_secret
OLLAMA_API_KEY=your_ollama_api_key

## 📂 API Endpoints
### 🔑 **Authentication**

| Method  | Endpoint | Description |  Auth Required|
| ------------- | ------------- | ------------- | ------------- |
| POST | /api/auth/register  | Register a new user  | ❌ No  |
| POST  | /api/auth/login  | Login and get access tokens  | ❌ No  |
| POST | /api/auth/logout  | Logout and clear tokens  | ✅ Yes |
| GET  | /api/auth/user  | Get authenticated user info  | ✅ Yes |

### 💬 **Conversations**

| Method  | Endpoint | Description |  Auth Required|
| ------------- | ------------- | ------------- | ------------- |
| GET | /api/conversations  | Get all user conversations  | ✅ Yes  |
| POST  | /api/conversations/messages | Send a message & get AI response  | ✅ Yes  |
| GET | /api/conversations/:id  | Get messages in a conversation  | ✅ Yes |
| DELETE  | /api/conversations/:id  | Delete a conversation  | ✅ Yes |

## 📘 Frontend Integration
The frontend communicates with the backend API, which is documented in:
- 📂 [Frontend Documentation](frontend/README.md)