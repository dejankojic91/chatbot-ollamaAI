import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import MainLayout from "./components/MainLayout";
import AuthLayout from "./components/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Registration";
import NotFoundPage from "./pages/NotFoundPage";
import { PublicRoute, PrivateRoute } from "./components/ProtectedRoute";

const App: React.FC = () => {

  return (
    <Router>
      <Routes>
        <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          </Route>
          </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/chat" element={<Chat />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>

  );
};

export default App;
