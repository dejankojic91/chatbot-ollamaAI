# 🧠 Chatbot AI - Ollama Powered Chat Application

A **React + Node.js** chatbot application powered by **Ollama** with user authentication, chat history, and an interactive UI.

## 📁 Project Structure
Chatbot-OpenAI/ 
    ── frontend/ # React-based frontend (Vite, Tailwind, React Query) 
    ── backend/ # Node.js + Express + MongoDB backend 

## 🛠 Tech Stack
- **Frontend:** React (Vite), TypeScript, TailwindCSS, React Query, shadcn/ui
- **Backend:** Node.js, Express, MongoDB, Ollama API
- **Auth:** JWT-based authentication with Refresh Token

---

## 🚀 Getting Started

## 1️⃣ **Clone the Repository**
```sh
git clone https://github.com/yourusername/chatbot-openai.git
cd chatbot-openai
npm install
```
## 2️⃣ ** Set Up & Run the Project**

## Frontend Setup
```sh
cd frontend
npm install
npm run dev
```

## Backend Setup
```sh
cd ../backend
npm install
npm run dev
```

## 📂  .env Configuration

## Backend (backend/.env)
PORT=3005
MONGO_URI=mongodb+srv://<your_mongodb>
JWT_SECRET=your_secret
REFRESH_SECRET=your_refresh_secret

## Frontend (frontend/.env)
VITE_API_BASE_URL=http://localhost:3005/api

## 📘 Documentation
- 📂 [Frontend Documentation](frontend/README.md)
- 📂 [Backend Documentation](backend/README.md)
