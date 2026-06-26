package com.online.study_meet.DTO.RoomDTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyRoomResponse {
    private String roomCode;
    private String roomName;
}
