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
        <div className="join-room-container">
            <h2>Join Room</h2>
            <form onSubmit={handleJoinRoom}>
                <div>
                    <label>Room Code:</label>
                    <br />
                    <input
                        type="text"
                        placeholder="Enter room code"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        required
                    />
                </div>
                <br />
                <div>
                    <label>Password (if required):</label>
                    <br />
                    <input
                        type="password"
                        placeholder="Enter room password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <br />
                {error && (
                    <p style={{ color: "red" }}>
                        {error}
                    </p>
                )}
                <button type="submit" disabled={loading}>
                    {loading ? "Joining..." : "Join Room"}
                </button>
            </form>
        </div>
    );
}
