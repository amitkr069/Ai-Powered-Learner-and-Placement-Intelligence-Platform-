package com.backend.learner_placement.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.learner_placement.dtos.MentorDto;
import com.backend.learner_placement.services.MentorService;

@RestController
@RequestMapping("/api/mentors")
public class MentorController {

    private final MentorService mentorService;

    public MentorController(MentorService mentorService) {
        this.mentorService = mentorService;
    }

    // Admin only: add mentor
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<MentorDto> addMentor(@RequestBody MentorDto mentorDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mentorService.createMentor(mentorDto));
    }

    // Admin only: list all mentors
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<MentorDto>> getAllMentors() {
        return ResponseEntity.ok(mentorService.getAllMentors());
    }

    // Admin or Mentor: get mentor by id
    @PreAuthorize("hasAnyRole('ADMIN', 'MENTOR')")
    @GetMapping("/{id}")
    public ResponseEntity<MentorDto> getMentorById(@PathVariable Long id) {
        return ResponseEntity.ok(mentorService.getMentorById(id));
    }
}
