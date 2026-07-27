import {useContext} from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
export default function Dashboard() {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const handleLogout = () =>{
        logout();
        navigate("/login");
    }
    return (
        <div className="dashboard-container">
        <h1>Welcome to the Dashboard</h1>
        <div className="btn-container">
            <button onClick={() =>navigate("/create-room")}>Create Room</button>
        </div>
        <button onClick={handleLogout}>Logout</button>
        </div>
    );
}