package com.online.study_meet.Service;

import com.online.study_meet.DTO.Message.MsgRes;
import com.online.study_meet.Model.Message;
import com.online.study_meet.Model.Room;
import com.online.study_meet.Model.User;
import com.online.study_meet.Repository.MessageRepository;
import com.online.study_meet.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final RoomService roomService;

    public MsgRes sendMessage(String content,
                              String roomCode,
                              String senderUsername) {
        User user=userRepository.findByUsername(senderUsername)
                .orElseThrow(()->
                        new RuntimeException("[msg-service] Username "+senderUsername+" not found"));
        Room room=roomService.findByRoomCode(roomCode)
                .orElseThrow(()->
                        new RuntimeException("[msg-service] Room not found"));

        if(!room.getMembers().contains(user)){
            throw new RuntimeException("user not member in room");
        }
        Message msg=new Message();
        msg.setContent(content);
        msg.setSender(user);
        msg.setRoom(room);
        msg.setCreatedAt(LocalDateTime.now());
        Message saved=messageRepository.save(msg);

        return new MsgRes(
                saved.getId(),
                saved.getContent(),
                saved.getSender().getUsername(),
                saved.getCreatedAt()
        );
    }
}
