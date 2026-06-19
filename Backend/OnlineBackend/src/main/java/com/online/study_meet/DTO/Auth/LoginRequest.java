package com.online.study_meet.DTO.Auth;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
