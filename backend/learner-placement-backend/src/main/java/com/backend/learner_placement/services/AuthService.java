package com.backend.learner_placement.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.backend.learner_placement.dtos.AuthResponse;
import com.backend.learner_placement.dtos.LoginRequest;
import com.backend.learner_placement.dtos.LearnerDto;
import com.backend.learner_placement.dtos.RegisterRequest;
import com.backend.learner_placement.models.Learner;
import com.backend.learner_placement.models.Mentor;
import com.backend.learner_placement.repository.LearnerRepository;
import com.backend.learner_placement.repository.MentorRepository;
import com.backend.learner_placement.security.JwtUtil;

@Service
public class AuthService {

    private final LearnerRepository learnerRepository;
    private final MentorRepository mentorRepository;
    private final LearnerService learnerService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.name}")
    private String adminName;

    public AuthService(LearnerRepository learnerRepository,
                       MentorRepository mentorRepository,
                       LearnerService learnerService,
                       JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager) {
        this.learnerRepository = learnerRepository;
        this.mentorRepository = mentorRepository;
        this.learnerService = learnerService;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    // Learner self-registration only
    public AuthResponse registerLearner(RegisterRequest request) {
        LearnerDto saved = learnerService.registerLearner(request);
        AuthResponse response = new AuthResponse();
        response.setId(saved.getLearnerId());
        response.setName(saved.getName());
        response.setEmail(saved.getEmail());
        response.setRole("LEARNER");
        response.setMessage("Registered successfully. Please login.");
        return response;
    }

    // Login: works for admin, mentor, learner
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception ex) {
            throw new RuntimeException("Invalid email or password!");
        }

        String token = jwtUtil.generateToken(request.getEmail());
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setEmail(request.getEmail());

        // 1. Admin
        if (request.getEmail().equalsIgnoreCase(adminEmail)) {
            response.setId(0L);
            response.setName(adminName);
            response.setRole("ADMIN");
            response.setMessage("Admin login successful");
            return response;
        }

        // 2. Mentor
        Mentor mentor = mentorRepository.findByEmail(request.getEmail());
        if (mentor != null) {
            response.setId(mentor.getMentorId());
            response.setMentorId(mentor.getMentorId());
            response.setName(mentor.getName());
            response.setRole("MENTOR");
            response.setMessage("Mentor login successful");
            return response;
        }

        // 3. Learner
        Learner learner = learnerRepository.findByEmail(request.getEmail());
        if (learner != null) {
            response.setId(learner.getLearnerId());
            response.setName(learner.getName());
            response.setRole("LEARNER");
            response.setMessage("Learner login successful");
            return response;
        }

        throw new RuntimeException("User not found after authentication.");
    }
}
