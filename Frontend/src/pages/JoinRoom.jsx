import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinRoom } from "../services/roomService";

export default function JoinRoom() {
    const navigate = useNavigate();
    const [roomCode, setRoomCode] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleJoinRoom = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            await joinRoom(roomCode, password, token);
            navigate(`/room/${roomCode}`);
        } catch (err) {
            const errorMessage = err.response?.data 
                ? (typeof err.response.data === 'string' ? err.response.data : err.response.data.message)
                : err.message;
            setError(errorMessage || "Failed to join room. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <h2 className="card-title fw-bold text-primary">
                                    <i className="bi bi-box-arrow-in-right me-2"></i>Join Room
                                </h2>
                                <p className="text-muted">Enter room code to join an existing room</p>
                            </div>

                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    {error}
                                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                                </div>
                            )}

                            <form onSubmit={handleJoinRoom}>
                                <div className="mb-3">
                                    <label htmlFor="roomCode" className="form-label">Room Code</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="bi bi-hash"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="roomCode"
                                            placeholder="Enter room code"
                                            value={roomCode}
                                            onChange={(e) => setRoomCode(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label">Password (if required)</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="bi bi-lock"></i>
                                        </span>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            placeholder="Enter room password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <small className="text-muted">Only required if the room has a password</small>
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-success btn-lg" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Joining...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                                Join Room
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="text-center mt-4">
                                <button 
                                    onClick={() => navigate("/dashboard")} 
                                    className="btn btn-outline-secondary"
                                >
                                    <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
