package com.online.study_meet.Exception;

import com.online.study_meet.DTO.RoomDTO.RoomResponse;

public class RoomNotFoundException extends RuntimeException{
    public RoomNotFoundException(){
        super("room not found");
    }
    public RoomNotFoundException(String msg){
        super(msg);
    }
}
