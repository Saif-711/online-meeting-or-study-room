package com.online.study_meet.DTO.RoomDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RoomResponse {
    private Long id;
    private String roomName;
    private String roomCode;
    private String description;
    private String ownerUsername;
    private int roomCount;
}
