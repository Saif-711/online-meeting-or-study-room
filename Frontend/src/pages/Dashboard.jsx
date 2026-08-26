import {useContext} from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getMyRooms } from '../services/roomService';

export default function Dashboard() {
    const navigate = useNavigate();
    const { logout, username } = useContext(AuthContext);
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
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-bold text-primary">
                        <i className="bi bi-grid-3x3-gap me-2"></i>Dashboard
                    </h1>
                    <p className="text-muted mb-0">Welcome back! Manage your study rooms here.</p>
                </div>
                <button onClick={handleLogout} className="btn btn-outline-danger">
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                </button>
            </div>

            <div className="row mb-4">
                <div className="col-md-6">
                    <button onClick={() => navigate("/create-room")} className="btn btn-primary btn-lg w-100">
                        <i className="bi bi-plus-circle me-2"></i>Create Room
                    </button>
                </div>
                <div className="col-md-6">
                    <button onClick={() => navigate("/join-room")} className="btn btn-success btn-lg w-100">
                        <i className="bi bi-box-arrow-in-right me-2"></i>Join Room
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading rooms...</p>
                </div>
            ) : rooms.length === 0 ? (
                <div className="card shadow-sm">
                    <div className="card-body text-center py-5">
                        <i className="bi bi-inbox fs-1 text-muted mb-3"></i>
                        <h3 className="text-muted">No rooms yet</h3>
                        <p className="text-muted">Create or join a room to get started!</p>
                    </div>
                </div>
            ) : (
                <div>
                    <h2 className="mb-4">
                        <i className="bi bi-door-open me-2"></i>Your Rooms
                    </h2>
                    <p className="text-muted mb-3">
                        <span className="badge bg-danger me-2">Owner</span>
                        Rooms you created
                        <span className="badge bg-primary ms-3 me-2">Member</span>
                        Rooms you joined
                    </p>
                    <div className="row">
                        {rooms.map((room) => {
                            const isOwner =
                                room.isOwner === true ||
                                room.role === "OWNER" ||
                                (username && room.ownerUsername === username);
                            return (
                            <div key={room.roomCode} className="col-md-6 col-lg-4 mb-4">
                                <div className={`card shadow-sm h-100 ${isOwner ? "border-danger" : "border-primary"}`}
                                     style={{ borderWidth: "2px" }}>
                                    <div className={`card-header ${isOwner ? "bg-danger text-white" : "bg-primary text-white"}`}>
                                        <span className="badge bg-light text-dark">
                                            {isOwner ? "Owner" : "Member"}
                                        </span>
                                    </div>
                                    <div className="card-body">
                                        <h5 className={`card-title fw-bold ${isOwner ? "text-danger" : "text-primary"}`}>
                                            <i className={`bi bi-door-closed me-2 ${isOwner ? "text-danger" : "text-primary"}`}></i>
                                            {room.roomName}
                                        </h5>
                                        <p className="card-text text-muted mb-3">
                                            <small>
                                                <i className="bi bi-hash me-1"></i>
                                                Code: {room.roomCode}
                                            </small>
                                        </p>
                                        <button 
                                            onClick={() => navigate(`/room/${room.roomCode}`)} 
                                            className={`btn w-100 ${isOwner ? "btn-danger" : "btn-primary"}`}
                                        >
                                            <i className="bi bi-arrow-right-circle me-2"></i>Enter Room
                                        </button>
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}