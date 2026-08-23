import { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getChatHistory } from "../services/messageService";
import { createChatClient } from "../services/websocketService";

export default function Room() {
    const { roomCode } = useParams();
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const chatClientRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        let chatClient;

        const init = async () => {
            try {
                const data = await getChatHistory(roomCode, token);
                setMessages(data);
            } catch (error) {
                console.error("Error fetching messages:", error);
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

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !chatClientRef.current) return;

        chatClientRef.current.sendMessage(newMessage.trim());
        setNewMessage("");
    };

    const handleLeaveRoom = async () => {
        try {
            const token = localStorage.getItem("token");
            // TODO: Implement leave room API call
            navigate("/dashboard");
        } catch (error) {
            console.error("Error leaving room:", error);
        }
    };

    return (
        <div className="room-container">
            <div className="room-header">
                <h2>Room: {roomCode}</h2>
                <button onClick={handleLeaveRoom} className="leave-room-btn">Leave Room</button>
            </div>

            {loading ? (
                <p>Loading messages...</p>
            ) : (
                <div className="chat-container">
                    <div className="messages-list">
                        {messages.length === 0 ? (
                            <p>No messages yet. Start the conversation!</p>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id ?? `${msg.senderUsername}-${msg.createdAt}`} className="message">
                                    <span className="message-sender">{msg.senderUsername}:</span>
                                    <span className="message-content">{msg.content}</span>
                                </div>
                            ))
                        )}
                    </div>

                    <form onSubmit={handleSendMessage} className="message-form">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="message-input"
                        />
                        <button type="submit" className="send-btn">Send</button>
                    </form>
                </div>
            )}
        </div>
    );
}
