import { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { deleteMessage, editMessage, getChatHistory } from "../services/messageService";
import { deleteRoom, getRoomDetails, leaveRoom, setMembersCanChat } from "../services/roomService";
import { createChatClient } from "../services/websocketService";

export default function Room() {
    const { roomCode } = useParams();
    const navigate = useNavigate();
    const { username } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [roomName, setRoomName] = useState("");
    const [ownerUsername, setOwnerUsername] = useState("");
    const [membersCanChat, setMembersCanChatState] = useState(true);
    const [roomMenuOpen, setRoomMenuOpen] = useState(false);
    const [msgMenuId, setMsgMenuId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const chatClientRef = useRef(null);
    const messagesEndRef = useRef(null);

    const isOwner = Boolean(username && ownerUsername && username === ownerUsername);
    const canSend = isOwner || membersCanChat;

    useEffect(() => {
        const token = localStorage.getItem("token");
        let chatClient;

        const applyEvent = (event) => {
            if (event.type === "MESSAGE" && event.message) {
                setMessages((prev) =>
                    prev.some((m) => m.id === event.message.id) ? prev : [...prev, event.message]
                );
                return;
            }
            if (event.type === "MESSAGE_UPDATED" && event.message) {
                setMessages((prev) =>
                    prev.map((m) => (m.id === event.message.id ? event.message : m))
                );
                return;
            }
            if (event.type === "MESSAGE_DELETED") {
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === event.messageId ? { ...m, deleted: true, content: "" } : m
                    )
                );
                return;
            }
            if (event.type === "ROOM_UPDATED" && typeof event.membersCanChat === "boolean") {
                setMembersCanChatState(event.membersCanChat);
                return;
            }
            if (event.type === "ROOM_DELETED") {
                chatClientRef.current?.disconnect();
                chatClientRef.current = null;
                navigate("/dashboard");
            }
        };

        const init = async () => {
            try {
                const roomDetails = await getRoomDetails(roomCode, token);
                setRoomName(roomDetails.roomName);
                setOwnerUsername(roomDetails.ownerUsername || "");
                setMembersCanChatState(roomDetails.membersCanChat !== false);

                const data = await getChatHistory(roomCode, token);
                setMessages(data);
            } catch (error) {
                console.error("Error fetching room details or messages:", error);
            } finally {
                setLoading(false);
            }

            chatClient = createChatClient(token, roomCode, applyEvent);
            chatClientRef.current = chatClient;
        };

        init();

        return () => {
            chatClient?.disconnect();
            chatClientRef.current = null;
        };
    }, [roomCode, navigate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !chatClientRef.current || !canSend) return;

        chatClientRef.current.sendMessage(newMessage.trim());
        setNewMessage("");
    };

    const handleLeaveRoom = async () => {
        try {
            const token = localStorage.getItem("token");
            await leaveRoom(token, roomCode);
            chatClientRef.current?.disconnect();
            chatClientRef.current = null;
            navigate("/dashboard");
        } catch (error) {
            console.error("Error leaving room:", error);
        }
    };

    const handleDeleteGroup = async () => {
        if (!window.confirm("Delete this group for everyone? This cannot be undone.")) return;
        try {
            const token = localStorage.getItem("token");
            await deleteRoom(token, roomCode);
            chatClientRef.current?.disconnect();
            chatClientRef.current = null;
            navigate("/dashboard");
        } catch (error) {
            console.error("Error deleting room:", error);
        }
    };

    const handleToggleMemberChat = async () => {
        try {
            const token = localStorage.getItem("token");
            const updated = await setMembersCanChat(token, roomCode, !membersCanChat);
            setMembersCanChatState(updated.membersCanChat);
            setRoomMenuOpen(false);
        } catch (error) {
            console.error("Error updating chat lock:", error);
        }
    };

    const startEdit = (msg) => {
        setMsgMenuId(null);
        setEditingId(msg.id);
        setEditText(msg.content);
    };

    const saveEdit = async (messageId) => {
        if (!editText.trim()) return;
        try {
            const token = localStorage.getItem("token");
            const updated = await editMessage(roomCode, messageId, editText.trim(), token);
            setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
            setEditingId(null);
            setEditText("");
        } catch (error) {
            console.error("Error editing message:", error);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            const token = localStorage.getItem("token");
            await deleteMessage(roomCode, messageId, token);
            setMessages((prev) =>
                prev.map((m) => (m.id === messageId ? { ...m, deleted: true, content: "" } : m))
            );
            setMsgMenuId(null);
        } catch (error) {
            console.error("Error deleting message:", error);
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
                    <div className="d-flex align-items-center gap-2">
                        {isOwner && (
                            <div className="dropdown">
                                <button
                                    type="button"
                                    className="btn btn-outline-light"
                                    aria-label="Room options"
                                    onClick={() => setRoomMenuOpen((open) => !open)}
                                >
                                    <i className="bi bi-three-dots"></i>
                                </button>
                                {roomMenuOpen && (
                                    <ul className="dropdown-menu dropdown-menu-end show" style={{ position: "absolute", right: 0 }}>
                                        <li>
                                            <button className="dropdown-item" type="button" onClick={handleToggleMemberChat}>
                                                {membersCanChat
                                                    ? "Disable member chat"
                                                    : "Allow members to chat"}
                                            </button>
                                        </li>
                                        <li>
                                            <button className="dropdown-item text-danger" type="button" onClick={handleDeleteGroup}>
                                                Delete group
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        )}
                        <button onClick={handleLeaveRoom} className="btn btn-outline-light">
                            <i className="bi bi-box-arrow-right me-2"></i>Leave Room
                        </button>
                    </div>
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
                            {!membersCanChat && (
                                <div className="alert alert-warning mb-0 rounded-0">
                                    {isOwner
                                        ? "Members cannot send messages. You can still chat."
                                        : "The owner disabled chat for members."}
                                </div>
                            )}
                            <div className="flex-grow-1 overflow-auto p-4 bg-light">
                                {messages.length === 0 ? (
                                    <div className="text-center py-5">
                                        <i className="bi bi-chat-square-text fs-1 text-muted mb-3"></i>
                                        <h4 className="text-muted">No messages yet</h4>
                                        <p className="text-muted">Start the conversation!</p>
                                    </div>
                                ) : (
                                    <div className="d-flex flex-column gap-3">
                                        {messages.map((msg) => {
                                            const isMine = username && msg.senderUsername === username;
                                            return (
                                            <div key={msg.id ?? `${msg.senderUsername}-${msg.createdAt}`} className="card shadow-sm">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <h6 className="card-subtitle mb-0 text-primary fw-bold">
                                                            <i className="bi bi-person-circle me-1"></i>
                                                            {msg.senderUsername}
                                                        </h6>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <small className="text-muted">
                                                                {new Date(msg.createdAt).toLocaleTimeString()}
                                                                {msg.edited && !msg.deleted ? " • edited" : ""}
                                                            </small>
                                                            {isMine && !msg.deleted && (
                                                                <div className="dropdown">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-link text-muted p-0"
                                                                        aria-label="Message options"
                                                                        onClick={() => setMsgMenuId(msgMenuId === msg.id ? null : msg.id)}
                                                                    >
                                                                        <i className="bi bi-three-dots-vertical"></i>
                                                                    </button>
                                                                    {msgMenuId === msg.id && (
                                                                        <ul className="dropdown-menu dropdown-menu-end show" style={{ position: "absolute", right: 0 }}>
                                                                            <li>
                                                                                <button className="dropdown-item" type="button" onClick={() => startEdit(msg)}>
                                                                                    Edit
                                                                                </button>
                                                                            </li>
                                                                            <li>
                                                                                <button className="dropdown-item text-danger" type="button" onClick={() => handleDeleteMessage(msg.id)}>
                                                                                    Delete
                                                                                </button>
                                                                            </li>
                                                                        </ul>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {msg.deleted ? (
                                                        <p className="card-text mb-0 text-muted fst-italic">This message was deleted</p>
                                                    ) : editingId === msg.id ? (
                                                        <div className="d-flex gap-2">
                                                            <input
                                                                className="form-control"
                                                                value={editText}
                                                                onChange={(e) => setEditText(e.target.value)}
                                                            />
                                                            <button type="button" className="btn btn-sm btn-primary" onClick={() => saveEdit(msg.id)}>
                                                                Save
                                                            </button>
                                                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setEditingId(null)}>
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <p className="card-text mb-0">{msg.content}</p>
                                                    )}
                                                </div>
                                            </div>
                                            );
                                        })}
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
                                            placeholder={canSend ? "Type a message..." : "Only the owner can send messages"}
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            disabled={!canSend}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary px-4" disabled={!canSend || !newMessage.trim()}>
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
