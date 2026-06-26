package com.online.study_meet.DTO.Message;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatMsg {
    private String sender;
    private String content;
}
