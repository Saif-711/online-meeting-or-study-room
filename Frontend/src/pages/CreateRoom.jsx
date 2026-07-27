import React, { useState } from "react";
import { createRoom } from "../services/roomService";

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
        <div>
            <h2>Create Room</h2>

            <form onSubmit={handleCreateRoom}>

                <div>
                    <label>Room Name:</label>
                    <br />

                    <input
                        type="text"
                        name="roomName"
                        placeholder="Enter room name"
                        value={roomData.roomName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Description:</label>
                    <br />

                    <input
                        type="text"
                        name="description"
                        placeholder="Enter description (optional)"
                        value={roomData.description}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <div>
                    <label>Password:</label>
                    <br />

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter room password"
                        value={roomData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                {error && (
                    <p style={{ color: "red" }}>
                        {error}
                    </p>
                )}

                {success &&(
                    <p style={{color:"green"}}>
                        {success}
                    </p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create"}
                </button>

            </form>
        </div>
    );
}