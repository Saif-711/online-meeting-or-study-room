package com.online.study_meet.DTO.RoomDTO;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MyRoomResponse {
    private String roomCode;
    private String roomName;
    private String ownerUsername;
    /** OWNER if the current user created the room, MEMBER if they only joined it. */
    private String role;
    @JsonProperty("isOwner")
    private boolean isOwner;
}
