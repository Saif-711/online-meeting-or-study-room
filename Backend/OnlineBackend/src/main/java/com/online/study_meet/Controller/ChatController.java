package com.online.study_meet.Controller;

import com.online.study_meet.DTO.Message.ChatSendRequest;
import com.online.study_meet.DTO.Message.MsgRes;
import com.online.study_meet.Service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.security.Principal;

@CrossOrigin("http://localhost:3000, http://localhost:3001,http://localhost:3002")
@Controller
@RequiredArgsConstructor
public class ChatController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMsg(@Payload ChatSendRequest request, Principal principal) {
        if (principal == null) {
            throw new RuntimeException("Unauthorized WebSocket connection");
        }
        MsgRes saved = messageService.sendMessage(
                request.getContent(),
                request.getRoomCode(),
                principal.getName()
        );
        messagingTemplate.convertAndSend("/topic/room/" + request.getRoomCode(), saved);
    }
}
