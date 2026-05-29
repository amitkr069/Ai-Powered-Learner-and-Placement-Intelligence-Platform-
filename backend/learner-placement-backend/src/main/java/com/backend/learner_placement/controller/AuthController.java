package com.backend.learner_placement.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.learner_placement.dtos.AuthResponse;
import com.backend.learner_placement.dtos.LoginRequest;
import com.backend.learner_placement.dtos.RegisterRequest;
import com.backend.learner_placement.services.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Learner-only registration
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        AuthResponse authResponse = authService.registerLearner(registerRequest);
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    // Login for admin, mentor, or learner
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.login(loginRequest);
        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }
}
