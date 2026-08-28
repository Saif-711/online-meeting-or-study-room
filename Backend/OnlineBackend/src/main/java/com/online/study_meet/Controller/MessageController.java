package com.online.study_meet.Controller;

import com.online.study_meet.DTO.Message.ChatEvent;
import com.online.study_meet.DTO.Message.MessageContentRequest;
import com.online.study_meet.DTO.Message.MsgRes;
import com.online.study_meet.Service.ChatEventService;
import com.online.study_meet.Service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:3000, http://localhost:3001,http://localhost:3002")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageService messageService;
    private final ChatEventService chatEventService;

    @PostMapping("{roomCode}/send")
    public ResponseEntity<?> sendMessage(@PathVariable String roomCode,
                                         @RequestBody String content,
                                         Authentication auth){
        String username=auth.getName();
        MsgRes response=messageService.sendMessage(content,roomCode,username);
        chatEventService.send(roomCode, ChatEvent.message(response));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{roomCode}/messages")
    public ResponseEntity<List<MsgRes>> chatHistory(@PathVariable String roomCode,
                                                    Authentication auth){
        String username=auth.getName();
        List<MsgRes>response=messageService.getChatHistory(roomCode,username);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{roomCode}/messages/{messageId}")
    public ResponseEntity<MsgRes> editMessage(@PathVariable String roomCode,
                                              @PathVariable Long messageId,
                                              @RequestBody MessageContentRequest request,
                                              Authentication auth) {
        MsgRes updated = messageService.editMessage(
                roomCode, messageId, request.getContent(), auth.getName());
        chatEventService.send(roomCode, ChatEvent.messageUpdated(updated));
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{roomCode}/messages/{messageId}")
    public ResponseEntity<String> deleteMessage(@PathVariable String roomCode,
                                                @PathVariable Long messageId,
                                                Authentication auth) {
        messageService.deleteMessage(roomCode, messageId, auth.getName());
        chatEventService.send(roomCode, ChatEvent.messageDeleted(messageId));
        return ResponseEntity.ok("Message deleted");
    }
}
