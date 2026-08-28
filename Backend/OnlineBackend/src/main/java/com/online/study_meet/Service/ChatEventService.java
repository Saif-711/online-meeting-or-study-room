package com.online.study_meet.Service;

import com.online.study_meet.DTO.Message.ChatEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatEventService {
    private final SimpMessagingTemplate messagingTemplate;

    public void send(String roomCode, ChatEvent event) {
        messagingTemplate.convertAndSend("/topic/room/" + roomCode, event);
    }
}
