import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_URL = "http://localhost:8088/ws";

export const createChatClient = (token, roomCode, onEvent) => {
    const client = new Client({
        webSocketFactory: () => new SockJS(WS_URL),
        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 5000,
        onConnect: () => {
            client.subscribe(`/topic/room/${roomCode}`, (message) => {
                const payload = JSON.parse(message.body);
                if (payload && payload.type) {
                    onEvent(payload);
                    return;
                }
                onEvent({ type: "MESSAGE", message: payload });
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
