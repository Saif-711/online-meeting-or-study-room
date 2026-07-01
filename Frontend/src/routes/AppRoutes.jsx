import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Room from "../pages/Room";
import CreateRoom from "../pages/CreateRoom";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element ={<Login/>} />
                <Route path="/register" element ={<Register/>} />

                {/** Protected Routes */}
                <Route element ={<ProtectedRoute/>}>
                    <Route path="/dashboard" element ={<Dashboard/>} />
                    <Route path="/room/ :id" element ={<Room/>} />
                    <Route path="/create-room" element ={<CreateRoom/>} />
                </Route>
                <Route path="*" element ={<NotFound/>} />
            </Routes>
        </BrowserRouter>
    )
}