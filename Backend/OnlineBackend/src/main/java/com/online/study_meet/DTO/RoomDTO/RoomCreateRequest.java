package com.online.study_meet.DTO.RoomDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomCreateRequest {

    private String roomName;
    private String description;
    private String password;
}