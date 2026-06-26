package com.online.study_meet.Controller;

import com.online.study_meet.DTO.Message.MsgRes;
import com.online.study_meet.DTO.RoomDTO.MyRoomResponse;
import com.online.study_meet.DTO.RoomDTO.RoomCreateRequest;
import com.online.study_meet.DTO.RoomDTO.RoomResponse;
import com.online.study_meet.Exception.UserNotFoundException;
import com.online.study_meet.Model.Room;
import com.online.study_meet.Model.User;
import com.online.study_meet.Repository.RoomRepository;
import com.online.study_meet.Repository.UserRepository;
import com.online.study_meet.Service.MessageService;
import com.online.study_meet.Service.RoomService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;
    private final UserRepository userRepository;
    private final MessageService messageService;
    private final RoomRepository roomRepository;

    //create Room
    @PostMapping("/create")
    public ResponseEntity<RoomResponse> createRoom(@RequestBody RoomCreateRequest request,
                                                   Authentication authentication) {
        String username = authentication.getName();
        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        RoomResponse response = roomService.createRoom(request, owner);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    //joining room api
    @PostMapping("/{roomCode}/join")
    public ResponseEntity<RoomResponse> joinRoom(@PathVariable String roomCode,Authentication auth){
        String username=auth.getName();
        User user=userRepository.findByUsername(username)
                .orElseThrow(()->new UserNotFoundException("User not found"));
        RoomResponse response= roomService.joinRoom(roomCode,user);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/{roomCode}/leave")
    public ResponseEntity<?>leaveRoom(@PathVariable String roomCode,Authentication auth){
        String username = auth.getName();
        roomService.leaveRoom(roomCode,username);
        return ResponseEntity.status(HttpStatus.OK).body("Left the room successfully");
    }

    @GetMapping("/mine")
    public ResponseEntity<List<MyRoomResponse>> fetchRooms(Authentication auth){
        //return room code,name
        String username=auth.getName();
        List<Room> roomList=roomService.findAllByUsername(username);
        List<MyRoomResponse> response;
        response=roomList.stream()
                .map(room->new MyRoomResponse(
                        room.getRoomCode(),
                        room.getRoomName()
                )).toList();
        return ResponseEntity.ok(response);
    }

}
