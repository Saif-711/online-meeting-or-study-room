package com.online.study_meet.Service;


import com.online.study_meet.DTO.Auth.RegisterRequest;
import com.online.study_meet.DTO.RoomDTO.RoomCreateRequest;
import com.online.study_meet.DTO.RoomDTO.RoomResponse;
import com.online.study_meet.Model.Room;
import com.online.study_meet.Model.User;
import com.online.study_meet.Repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomResponse createRoom(RoomCreateRequest request, User owner) {

        Room room = new Room();
        room.setRoomName(request.getRoomName());
        room.setDescription(request.getDescription());
        room.setPassword(request.getPassword());

        room.setRoomCode(UUID.randomUUID().toString());

        room.setOwner(owner);

        room.getMembers().add(owner);

        Room saved = roomRepository.save(room);

        return new RoomResponse(
                saved.getId(),
                saved.getRoomName(),
                saved.getRoomCode(),
                saved.getDescription(),
                saved.getOwner().getUsername(),
                saved.getMembers().size()
        );
    }
    public RoomResponse joinRoom(String roomCode,User user){
        Room room = roomRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        if(room.getMembers().contains(user)){
            throw new RuntimeException("User Already in the Room");
        }
        room.getMembers().add(user);
        Room saved=roomRepository.save(room);
        return new RoomResponse(
                saved.getId(),
                saved.getRoomName(),
                saved.getRoomCode(),
                saved.getDescription(),
                saved.getOwner().getUsername(),
                saved.getMembers().size()
        );
    }
}