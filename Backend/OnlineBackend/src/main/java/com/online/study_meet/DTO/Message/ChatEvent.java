package com.online.study_meet.DTO.Message;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatEvent {
    public static final String MESSAGE = "MESSAGE";
    public static final String MESSAGE_UPDATED = "MESSAGE_UPDATED";
    public static final String MESSAGE_DELETED = "MESSAGE_DELETED";
    public static final String ROOM_UPDATED = "ROOM_UPDATED";
    public static final String ROOM_DELETED = "ROOM_DELETED";

    private String type;
    private MsgRes message;
    private Long messageId;
    private Boolean membersCanChat;

    public static ChatEvent message(MsgRes message) {
        ChatEvent event = new ChatEvent();
        event.setType(MESSAGE);
        event.setMessage(message);
        return event;
    }

    public static ChatEvent messageUpdated(MsgRes message) {
        ChatEvent event = new ChatEvent();
        event.setType(MESSAGE_UPDATED);
        event.setMessage(message);
        return event;
    }

    public static ChatEvent messageDeleted(Long messageId) {
        ChatEvent event = new ChatEvent();
        event.setType(MESSAGE_DELETED);
        event.setMessageId(messageId);
        return event;
    }

    public static ChatEvent roomUpdated(boolean membersCanChat) {
        ChatEvent event = new ChatEvent();
        event.setType(ROOM_UPDATED);
        event.setMembersCanChat(membersCanChat);
        return event;
    }

    public static ChatEvent roomDeleted() {
        ChatEvent event = new ChatEvent();
        event.setType(ROOM_DELETED);
        return event;
    }
}
