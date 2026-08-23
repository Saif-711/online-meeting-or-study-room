import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import Room from "./pages/Room";
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
      <Route path="/create-room" 
      element={
        <ProtectedRoute>
          <CreateRoom />
        </ProtectedRoute>
      } />
      <Route path="/join-room" 
      element={
        <ProtectedRoute>
          <JoinRoom />
        </ProtectedRoute>
      } />
      <Route path="/room/:roomCode" 
      element={
        <ProtectedRoute>
          <Room />
        </ProtectedRoute>
      } />
    </Routes>
  );

}

export default App;