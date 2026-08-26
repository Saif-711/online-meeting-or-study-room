package com.online.study_meet.Repository;

import com.online.study_meet.Model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {
    Optional<Room> findByRoomCode(String roomCode);

    @Query("SELECT DISTINCT r FROM Room r JOIN FETCH r.owner JOIN r.members m WHERE m.username = :username")
    List<Room> findByMembersUsername(@Param("username") String username);
}
