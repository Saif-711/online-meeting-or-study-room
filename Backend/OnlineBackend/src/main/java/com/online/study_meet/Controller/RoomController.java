package com.online.study_meet.Controller;

import com.online.study_meet.DTO.RoomDTO.MyRoomResponse;
import com.online.study_meet.DTO.RoomDTO.RoomChatLockRequest;
import com.online.study_meet.DTO.RoomDTO.RoomCreateRequest;
import com.online.study_meet.DTO.RoomDTO.RoomResponse;
import com.online.study_meet.DTO.Message.ChatEvent;
import com.online.study_meet.Exception.UserNotFoundException;
import com.online.study_meet.Model.User;
import com.online.study_meet.Repository.UserRepository;
import com.online.study_meet.Service.ChatEventService;
import com.online.study_meet.Service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:3000, http://localhost:3001,http://localhost:3002")
@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;
    private final UserRepository userRepository;
    private final ChatEventService chatEventService;

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
        return ResponseEntity.ok(roomService.getMyRooms(auth.getName()));
    }
    @GetMapping("/{roomCode}") 
    public ResponseEntity<RoomResponse> getRoomDetails(@PathVariable String roomCode){
         return ResponseEntity.status(HttpStatus.OK).body(roomService.getRoomDetails(roomCode));
    }

    @PatchMapping("/{roomCode}/chat-lock")
    public ResponseEntity<RoomResponse> setChatLock(@PathVariable String roomCode,
                                                    @RequestBody RoomChatLockRequest request,
                                                    Authentication auth) {
        RoomResponse response = roomService.setMembersCanChat(
                roomCode, auth.getName(), request.isMembersCanChat());
        chatEventService.send(roomCode, ChatEvent.roomUpdated(response.isMembersCanChat()));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{roomCode}")
    public ResponseEntity<String> deleteRoom(@PathVariable String roomCode, Authentication auth) {
        roomService.deleteRoom(roomCode, auth.getName());
        chatEventService.send(roomCode, ChatEvent.roomDeleted());
        return ResponseEntity.ok("Room deleted");
    }

}
