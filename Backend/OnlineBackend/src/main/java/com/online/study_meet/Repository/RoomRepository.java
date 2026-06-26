package com.online.study_meet.Repository;

import com.online.study_meet.Model.Room;
import com.online.study_meet.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {
//    List<Room> findByOwnerId(Long ownerId);
//    List<Room> findByMembersId(Long userId);
    Optional<Room> findByRoomCode(String roomCode);
    List<Room> findByMembersUsername(String username);
}
