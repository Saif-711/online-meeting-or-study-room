import axios from "axios";
const API_URL = "http://localhost:8088/api/messages";

export const getChatHistory = async (roomCode, token) => {
    const response = await axios.get(`${API_URL}/${roomCode}/messages`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const sendMessage = async (roomCode, content, token) => {
    const response = await axios.post(`${API_URL}/${roomCode}/send`, content, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};
