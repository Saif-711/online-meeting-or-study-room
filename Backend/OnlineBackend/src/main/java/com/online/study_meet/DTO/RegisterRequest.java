package com.online.study_meet.DTO;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
}
