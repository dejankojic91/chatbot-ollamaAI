# 🌐 Chatbot Frontend

This is the **frontend** of the **Chatbot AI** application, built using **React (Vite)**,
**TypeScript**, **TailwindCSS**, and **shadcn/ui**.  
It provides a **modern, interactive user interface** for users to chat with the AI, manage
conversation history, and authenticate securely.

---

## 🚀 Features

✔ **User Authentication (Login & Register)**  
✔ **Chat with AI (Powered by Ollama API)**  
✔ **Conversation History with Sidebar Navigation**  
✔ **Edit & Delete Messages**  
✔ **Responsive UI**  
✔ **Fast & Optimized with React Query & Vite**

---

## 📂 Project Structure

```
📂 frontend/ ├── 📂 src/ # Source code directory │ ├── 📂 components/ # Reusable UI components │ ├── 📂 pages/ # Application pages (Chat, Login, Register) │ ├── 📂 context/ # Authentication & App Context │ ├── 📂 utils/ # API & Helper functions │ ├── 📂 hooks/ # Custom hooks │── 📂 public/ # Static assets (favicon, images, etc.) │── 📜 README.md # Frontend documentation
```

---

## 🛠 Tech Stack

- **Framework:** React (Vite) + TypeScript
- **Styling:** TailwindCSS
- **State Management:** React Query
- **UI Components:** shadcn/ui
- **Routing:** React Router
- **API Handling:** Axios

---

## 🔧 Installation & Setup

### 1️⃣ **Navigate to the Frontend Directory**

```sh
cd frontend
```

### 2️⃣ **Install Dependencies**

```sh
npm install
```

### 3️⃣ **Run the Development Server**

```sh
npm run dev
```

The application will be available at http://localhost:5173

## 📂 .env Configuration

VITE_API_BASE_URL=http://localhost:3005/api

## 📘 Backend API

The frontend communicates with the backend API, which is documented in:

- 📂 [Backend Documentation](../backend/README.md)
