import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_URL = "http://localhost:8088/ws";

export const createChatClient = (token, roomCode, onMessage) => {
    const client = new Client({
        webSocketFactory: () => new SockJS(WS_URL),//here interceptor in backend will check the token and if valid it will allow the connection
        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 5000,
        onConnect: () => {
            client.subscribe(`/topic/room/${roomCode}`, (message) => {
                console.log("Received message:", message.body);
                onMessage(JSON.parse(message.body));
            });
        },
        onStompError: (frame) => {
            console.error("STOMP error:", frame.headers["message"], frame.body);
        },
    });

    client.activate();

 

    return {
        sendMessage: (content) => {
            client.publish({
                destination: "/app/chat.send",
                body: JSON.stringify({ roomCode, content }),
            });
        },
        disconnect: () => client.deactivate(),
    };
};
