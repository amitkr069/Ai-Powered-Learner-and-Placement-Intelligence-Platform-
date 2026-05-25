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
import com.backend.learner_placement.services.UserService;

@RestController
@RequestMapping("/auth")
public class AuthController {

	private final UserService userService; 

	public AuthController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {

		AuthResponse authResponse = userService.registerUser(registerRequest);
		return new ResponseEntity<>(authResponse, HttpStatus.CREATED);		

	}

	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {

		AuthResponse authResponse = userService.loginUser(loginRequest);
		return new ResponseEntity<>(authResponse, HttpStatus.OK);


	}
}
