package com.online.study_meet.Service;

import com.online.study_meet.DTO.Message.MsgRes;
import com.online.study_meet.Exception.ForbiddenException;
import com.online.study_meet.Exception.NotMemberException;
import com.online.study_meet.Model.Message;
import com.online.study_meet.Model.Room;
import com.online.study_meet.Model.User;
import com.online.study_meet.Repository.MessageRepository;
import com.online.study_meet.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final RoomService roomService;

    @Transactional
    public MsgRes sendMessage(String content,
                              String roomCode,
                              String senderUsername) {
        User user = userRepository.findByUsername(senderUsername)
                .orElseThrow(() ->
                        new RuntimeException("[msg-service] Username " + senderUsername + " not found"));
        Room room = roomService.findByRoomCode(roomCode)
                .orElseThrow(() ->
                        new RuntimeException("[msg-service] Room not found"));

        requireMember(room, user);

        boolean isOwner = room.getOwner() != null
                && room.getOwner().getUsername().equals(senderUsername);
        if (!roomService.membersAreAllowedToChat(room) && !isOwner) {
            throw new ForbiddenException("Members cannot send messages in this room");
        }

        Message msg = new Message();
        msg.setContent(content);
        msg.setSender(user);
        msg.setRoom(room);
        msg.setCreatedAt(LocalDateTime.now());
        msg.setEdited(false);
        msg.setDeleted(false);
        Message saved = messageRepository.save(msg);

        return toMsgRes(saved);
    }

    public List<MsgRes> getChatHistory(String roomCode, String username) {
        Room room = roomService.findByRoomCode(roomCode)
                .orElseThrow(() -> new RuntimeException("room with code" + roomCode + "not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("username :" + username + " not found"));
        requireMember(room, user);
        return messageRepository.findByRoomRoomCodeOrderByCreatedAtAsc(roomCode).stream()
                .map(this::toMsgRes)
                .toList();
    }

    @Transactional
    public MsgRes editMessage(String roomCode, Long messageId, String content, String username) {
        Message msg = requireOwnMessage(roomCode, messageId, username);
        if (Boolean.TRUE.equals(msg.getDeleted())) {
            throw new ForbiddenException("Cannot edit a deleted message");
        }
        if (content == null || content.isBlank()) {
            throw new RuntimeException("Message cannot be empty");
        }
        msg.setContent(content.trim());
        msg.setEdited(true);
        msg.setUpdatedAt(LocalDateTime.now());
        return toMsgRes(messageRepository.save(msg));
    }

    @Transactional
    public void deleteMessage(String roomCode, Long messageId, String username) {
        Message msg = requireOwnMessage(roomCode, messageId, username);
        msg.setDeleted(true);
        msg.setContent("");
        msg.setUpdatedAt(LocalDateTime.now());
        messageRepository.save(msg);
    }

    private Message requireOwnMessage(String roomCode, Long messageId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("username :" + username + " not found"));
        Room room = roomService.findByRoomCode(roomCode)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        requireMember(room, user);

        Message msg = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        if (!msg.getRoom().getId().equals(room.getId())) {
            throw new ForbiddenException("Message is not in this room");
        }
        if (!msg.getSender().getUsername().equals(username)) {
            throw new ForbiddenException("You can only change your own messages");
        }
        return msg;
    }

    private void requireMember(Room room, User user) {
        boolean isMember = room.getMembers().stream()
                .anyMatch(member -> member.getUsername().equals(user.getUsername()));
        if (!isMember) {
            throw new NotMemberException("Not Member");
        }
    }

    private MsgRes toMsgRes(Message msg) {
        boolean deleted = Boolean.TRUE.equals(msg.getDeleted());
        return new MsgRes(
                msg.getId(),
                deleted ? "" : msg.getContent(),
                msg.getSender().getUsername(),
                msg.getCreatedAt(),
                msg.getUpdatedAt(),
                Boolean.TRUE.equals(msg.getEdited()),
                deleted
        );
    }
}
