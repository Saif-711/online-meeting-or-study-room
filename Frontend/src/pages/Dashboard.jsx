import {useContext} from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getMyRooms } from '../services/roomService';
export default function Dashboard() {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = () =>{
        logout();
        navigate("/login");
    }
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const token = localStorage.getItem('token');
                const data = await getMyRooms(token);
                setRooms(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching rooms:', error);
                setLoading(false);
            }finally{
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);



     return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome to the Dashboard</h1>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
 
            <div className="dashboard-actions">
                <button onClick={() => navigate("/create-room")} className="create-room-btn">Create Room</button>
                <button onClick={() => navigate("/join-room")} className="join-room-btn">Join Room</button>
            </div>
 
            {loading ? (
                <p>Loading rooms...</p>
            ) : rooms.length === 0 ? (
                <p>No rooms yet. Create or join a room to get started!</p>
            ) : (
                <div className="rooms-list">
                    <h2>Your Rooms</h2>
                    <div className="rooms-grid">
                        {rooms.map((room) => (
                            <div key={room.roomCode} className="room-card">
                                <h3>{room.roomName}</h3>
                                <p>Room Code: {room.roomCode}</p>
                                <button onClick={() => navigate(`/room/${room.roomCode}`)} className="enter-room-btn">
                                    Enter Room
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}