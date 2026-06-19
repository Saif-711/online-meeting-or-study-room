package com.online.study_meet.Repository;

import com.online.study_meet.Model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByRoomIdOrderByCreatedAtAsc(Long roomId);
}
