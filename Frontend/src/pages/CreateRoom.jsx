import React, { useState } from "react";
import { createRoom } from "../services/roomService";
import { useNavigate } from "react-router-dom";

export default function CreateRoom() {

    const [roomData, setRoomData] = useState({
        roomName: "",
        description: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success,setSuccess]=useState("");

    const handleChange = (e) => {
        setRoomData({
            ...roomData,
            [e.target.name]: e.target.value
        });
    };


    const handleCreateRoom = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("token");

            const data = await createRoom(roomData, token);

            console.log(data);
            setRoomData({
                roomName:"",
                description:"",
                password:""
            });
            setSuccess("Room created successfully!");

        } catch (err) {
            console.log("Error:", err);
            console.log("Response:", err.response);
            const errorMessage = err.response?.data 
                ? (typeof err.response.data === 'string' ? err.response.data : err.response.data.message)
                : err.message;
            setError(errorMessage || "Failed to create room. Please try again.");
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
                                    <i className="bi bi-plus-circle me-2"></i>Create Room
                                </h2>
                                <p className="text-muted">Create a new study room for collaboration</p>
                            </div>

                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    {error}
                                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                    <i className="bi bi-check-circle me-2"></i>
                                    {success}
                                    <button type="button" className="btn-close" onClick={() => setSuccess("")}></button>
                                </div>
                            )}

                            <form onSubmit={handleCreateRoom}>
                                <div className="mb-3">
                                    <label htmlFor="roomName" className="form-label">Room Name</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="bi bi-door-closed"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="roomName"
                                            name="roomName"
                                            placeholder="Enter room name"
                                            value={roomData.roomName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="bi bi-card-text"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            placeholder="Enter description (optional)"
                                            value={roomData.description}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="bi bi-lock"></i>
                                        </span>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            placeholder="Enter room password"
                                            value={roomData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <small className="text-muted">Required for room security</small>
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-plus-circle me-2"></i>
                                                Create Room
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="text-center mt-4">
                                <button 
                                    onClick={() => window.history.back()} 
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