import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import CreateRoom from "./pages/CreateRoom";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" 
      element={
        <ProtectedRoute>
        <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/create-room" element={
        <ProtectedRoute>
          <CreateRoom />
        </ProtectedRoute>
      } />
    </Routes>
  );

}

export default App;