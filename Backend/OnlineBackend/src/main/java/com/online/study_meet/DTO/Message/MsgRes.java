package com.online.study_meet.DTO.Message;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class MsgRes {
    private Long id;
    private String content;
    private String senderUserName;
    private LocalDateTime createdAt;
}
