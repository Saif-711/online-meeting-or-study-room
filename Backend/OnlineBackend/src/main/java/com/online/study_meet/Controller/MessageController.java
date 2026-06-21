package com.online.study_meet.Controller;

import com.online.study_meet.DTO.Message.MsgRes;
import com.online.study_meet.Service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageService messageService;
    @PostMapping("{roomCode}/send")
    public ResponseEntity<?> sendMessage(@PathVariable String roomCode,
                                         @RequestBody String content,
                                         Authentication auth){
        String username=auth.getName();
        MsgRes response=messageService.sendMessage(content,roomCode,username);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/{roomCode}/messages")
    public ResponseEntity<List<MsgRes>> chatHistory(@PathVariable String roomCode,
                                                    Authentication auth){
        String username=auth.getName();
        List<MsgRes>response=messageService.getChatHistory(roomCode,username);
        return ResponseEntity.ok(response);
    }
}
