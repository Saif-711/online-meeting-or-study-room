package com.online.study_meet.Controller;


import com.online.study_meet.DTO.Auth.AuthResponse;
import com.online.study_meet.DTO.Auth.LoginRequest;
import com.online.study_meet.DTO.Auth.RegisterRequest;
import com.online.study_meet.Model.User;
import com.online.study_meet.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.PostExchange;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request){
        String response = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request){
        AuthResponse response = userService.login(request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


}
