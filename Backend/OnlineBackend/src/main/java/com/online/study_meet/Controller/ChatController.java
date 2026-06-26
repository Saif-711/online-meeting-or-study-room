package com.online.study_meet.Controller;

import com.online.study_meet.DTO.Message.MsgRes;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatController {

    @MessageMapping("/chat.send")
    @SendTo("/topic/messages")
        public MsgRes sendMsg(MsgRes msg, Principal p){
            msg.setSenderUsername(p != null ? p.getName() : "Anonymous");
            return msg;
        }
}
