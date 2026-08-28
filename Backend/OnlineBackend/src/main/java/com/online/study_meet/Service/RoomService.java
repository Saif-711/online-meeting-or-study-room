package com.online.study_meet.Service;


import com.online.study_meet.DTO.RoomDTO.MyRoomResponse;
import com.online.study_meet.DTO.RoomDTO.RoomCreateRequest;
import com.online.study_meet.DTO.RoomDTO.RoomResponse;
import com.online.study_meet.Exception.ForbiddenException;
import com.online.study_meet.Exception.RoomNotFoundException;
import com.online.study_meet.Exception.UserNotFoundException;
import com.online.study_meet.Model.Room;
import com.online.study_meet.Model.User;
import com.online.study_meet.Repository.MessageRepository;
import com.online.study_meet.Repository.RoomRepository;
import com.online.study_meet.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;

    public RoomResponse createRoom(RoomCreateRequest request, User owner) {

        Room room = new Room();
        room.setRoomName(request.getRoomName());
        room.setDescription(request.getDescription());
        room.setPassword(request.getPassword());

        room.setRoomCode(UUID.randomUUID().toString());

        room.setOwner(owner);
        room.setMembersCanChat(true);

        room.getMembers().add(owner);

        Room saved = roomRepository.save(room);

        return toResponse(saved);
    }
    public RoomResponse joinRoom(String roomCode,User user){
        Room room = roomRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        if(room.getMembers().contains(user)){
            throw new RuntimeException("User Already in the Room");
        }
        room.getMembers().add(user);
        Room saved=roomRepository.save(room);
        return toResponse(saved);
    }
    public String leaveRoom(String roomCode,String username){
        Room room=roomRepository.findByRoomCode(roomCode)
                .orElseThrow(()->new RuntimeException("Room not found"));
        User user=userRepository.findByUsername(username)
                .orElseThrow(()->new RuntimeException("User not found"));
        if(!room.getMembers().contains(user)){
            throw new RuntimeException("User not in the Room");
        }
        room.getMembers().remove(user);
        roomRepository.save(room);
        return "User left the room successfully";
    }

    public Optional<Room> findByRoomCode(String roomCode) {
        return roomRepository.findByRoomCode(roomCode);
    }

    public List<Room> findAllByUsername(String username) {
        userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException());

        return roomRepository.findByMembersUsername(username);
    }

    @Transactional(readOnly = true)
    public List<MyRoomResponse> getMyRooms(String username) {
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return roomRepository.findByMembersUsername(username).stream()
                .map(room -> {
                    boolean isOwner = room.getOwner() != null
                            && Objects.equals(room.getOwner().getId(), currentUser.getId());
                    return new MyRoomResponse(
                            room.getRoomCode(),
                            room.getRoomName(),
                            room.getOwner() != null ? room.getOwner().getUsername() : null,
                            isOwner ? "OWNER" : "MEMBER",
                            isOwner
                    );
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public RoomResponse getRoomDetails(String roomCode) {
        Room room = roomRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new RoomNotFoundException("room not found"));
        return toResponse(room);
    }

    @Transactional
    public RoomResponse setMembersCanChat(String roomCode, String username, boolean membersCanChat) {
        Room room = requireOwnedRoom(roomCode, username);
        room.setMembersCanChat(membersCanChat);
        return toResponse(roomRepository.save(room));
    }

    @Transactional
    public void deleteRoom(String roomCode, String username) {
        Room room = requireOwnedRoom(roomCode, username);
        messageRepository.deleteAll(messageRepository.findByRoomRoomCodeOrderByCreatedAtAsc(roomCode));
        room.getMembers().clear();
        roomRepository.delete(room);
    }

    public boolean membersAreAllowedToChat(Room room) {
        return room.getMembersCanChat() == null || room.getMembersCanChat();
    }

    private Room requireOwnedRoom(String roomCode, String username) {
        Room room = roomRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new RoomNotFoundException("room not found"));
        if (room.getOwner() == null || !room.getOwner().getUsername().equals(username)) {
            throw new ForbiddenException("Only the owner can do this");
        }
        return room;
    }

    private RoomResponse toResponse(Room room) {
        return new RoomResponse(
                room.getId(),
                room.getRoomName(),
                room.getRoomCode(),
                room.getDescription(),
                room.getOwner() != null ? room.getOwner().getUsername() : null,
                room.getMembers() != null ? room.getMembers().size() : 0,
                membersAreAllowedToChat(room)
        );
    }
}