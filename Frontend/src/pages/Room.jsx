import { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getChatHistory } from "../services/messageService";
import { getRoomDetails,leaveRoom } from "../services/roomService";
import { createChatClient } from "../services/websocketService";

export default function Room() {
    const { roomCode } = useParams();
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [roomName, setRoomName] = useState("");
    const chatClientRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        let chatClient;

        const init = async () => {
            try {
                // Fetch room details to get room name
                const roomDetails = await getRoomDetails(roomCode, token);
                setRoomName(roomDetails.roomName);

                // Fetch chat history
                const data = await getChatHistory(roomCode, token);
                setMessages(data);
            } catch (error) {
                console.error("Error fetching room details or messages:", error);
            } finally {
                setLoading(false);
            }

            chatClient = createChatClient(token, roomCode, (msg) => {
                setMessages((prev) =>
                    prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
                );
            });
            chatClientRef.current = chatClient;
        };

        init();

        return () => {
            chatClient?.disconnect();
            chatClientRef.current = null;
        };
    }, [roomCode]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !chatClientRef.current) return;

        chatClientRef.current.sendMessage(newMessage.trim());
        setNewMessage("");
    };

    const handleLeaveRoom = async () => {
        try {
            const token = localStorage.getItem("token");
            await leaveRoom(token, roomCode); // Call the leaveRoom service
            // TODO: Implement leave room API call
            navigate("/dashboard");
        } catch (error) {
            console.error("Error leaving room:", error);
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="card shadow-lg">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="mb-0">
                            <i className="bi bi-chat-dots me-2"></i>
                            {roomName || roomCode}
                        </h2>
                        <small className="text-white-50">Room Code: {roomCode} • Real-time chat</small>
                    </div>
                    <button onClick={handleLeaveRoom} className="btn btn-outline-light">
                        <i className="bi bi-box-arrow-right me-2"></i>Leave Room
                    </button>
                </div>

                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3 text-muted">Loading messages...</p>
                        </div>
                    ) : (
                        <div className="d-flex flex-column" style={{height: '70vh'}}>
                            <div className="flex-grow-1 overflow-auto p-4 bg-light">
                                {messages.length === 0 ? (
                                    <div className="text-center py-5">
                                        <i className="bi bi-chat-square-text fs-1 text-muted mb-3"></i>
                                        <h4 className="text-muted">No messages yet</h4>
                                        <p className="text-muted">Start the conversation!</p>
                                    </div>
                                ) : (
                                    <div className="d-flex flex-column gap-3">
                                        {messages.map((msg) => (
                                            <div key={msg.id ?? `${msg.senderUsername}-${msg.createdAt}`} className="card shadow-sm">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <h6 className="card-subtitle mb-0 text-primary fw-bold">
                                                            <i className="bi bi-person-circle me-1"></i>
                                                            {msg.senderUsername}
                                                        </h6>
                                                        <small className="text-muted">
                                                            {new Date(msg.createdAt).toLocaleTimeString()}
                                                        </small>
                                                    </div>
                                                    <p className="card-text mb-0">{msg.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-top bg-white">
                                <form onSubmit={handleSendMessage} className="d-flex gap-2">
                                    <div className="input-group flex-grow-1">
                                        <span className="input-group-text">
                                            <i className="bi bi-chat-text"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Type a message..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary px-4" disabled={!newMessage.trim()}>
                                        <i className="bi bi-send me-2"></i>Send
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
