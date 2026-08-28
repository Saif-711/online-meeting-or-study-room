package com.online.study_meet.Controller;

import com.online.study_meet.DTO.Message.ChatSendRequest;
import com.online.study_meet.DTO.Message.ChatEvent;
import com.online.study_meet.DTO.Message.MsgRes;
import com.online.study_meet.Service.MessageService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger log = LoggerFactory.getLogger(ChatController.class);
    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMsg(@Payload ChatSendRequest request, Principal principal) {
        log.info("Received WebSocket message from: {}, roomCode: {}, content: {}", 
            principal != null ? principal.getName() : "null", 
            request.getRoomCode(), 
            request.getContent());
        
        if (principal == null) {
            log.error("Unauthorized WebSocket connection");
            throw new RuntimeException("Unauthorized WebSocket connection");
        }
        
        try {
            MsgRes saved = messageService.sendMessage(
                    request.getContent(),
                    request.getRoomCode(),
                    principal.getName()
            );
            log.info("Message saved to database with ID: {}", saved.getId());
            
            String topic = "/topic/room/" + request.getRoomCode();
            log.info("Broadcasting message to topic: {}", topic);
            messagingTemplate.convertAndSend(topic, ChatEvent.message(saved));
            log.info("Message broadcasted successfully");
        } catch (Exception e) {
            log.error("Error processing message: {}", e.getMessage(), e);
            throw e;
        }
    }
}
