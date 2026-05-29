package com.backend.learner_placement.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.backend.learner_placement.models.Learner;
import com.backend.learner_placement.models.Mentor;
import com.backend.learner_placement.repository.LearnerRepository;
import com.backend.learner_placement.repository.MentorRepository;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final LearnerRepository learnerRepository;
    private final MentorRepository mentorRepository;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPasswordHash;

    public CustomUserDetailsService(LearnerRepository learnerRepository, MentorRepository mentorRepository) {
        this.learnerRepository = learnerRepository;
        this.mentorRepository = mentorRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // 1. Check if hardcoded admin
        if (adminEmail.equalsIgnoreCase(email)) {
            return new org.springframework.security.core.userdetails.User(
                    adminEmail,
                    adminPasswordHash,
                    List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        }

        // 2. Check mentor table
        Mentor mentor = mentorRepository.findByEmail(email);
        if (mentor != null) {
            return new org.springframework.security.core.userdetails.User(
                    mentor.getEmail(),
                    mentor.getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_MENTOR"))
            );
        }

        // 3. Check learner table
        Learner learner = learnerRepository.findByEmail(email);
        if (learner != null) {
            return new org.springframework.security.core.userdetails.User(
                    learner.getEmail(),
                    learner.getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_LEARNER"))
            );
        }

        throw new UsernameNotFoundException("No user found with email: " + email);
    }
}