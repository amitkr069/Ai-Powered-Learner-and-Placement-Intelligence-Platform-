package com.backend.learner_placement.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.backend.learner_placement.dtos.AssignMentorRequest;
import com.backend.learner_placement.dtos.LearnerDto;
import com.backend.learner_placement.dtos.ScoreUpdateRequest;
import com.backend.learner_placement.models.Learner;
import com.backend.learner_placement.services.LearnerService;

@RestController
@RequestMapping("/api/learners")
public class LearnerController {

    private final LearnerService learnerService;

    public LearnerController(LearnerService learnerService) {
        this.learnerService = learnerService;
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<Learner>> getLearnersPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "learnerId") String sortBy) {
        return ResponseEntity.ok(learnerService.getAllLearnersPaginated(page, size, sortBy));
    }

    // Admin: CSV upload
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/upload")
    public ResponseEntity<String> uploadLearnersCsv(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED).body(learnerService.saveLearnersFromCsv(file));
    }

    // Admin: get all learners
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<LearnerDto>> getAllLearners() {
        return new ResponseEntity<>(learnerService.getAllLearners(), HttpStatus.OK);
    }

    // Admin or Mentor: get learner by ID
    @PreAuthorize("hasAnyRole('ADMIN', 'MENTOR', 'LEARNER')")
    @GetMapping("/{id}")
    public ResponseEntity<LearnerDto> getLearnerById(@PathVariable Long id) {
        return new ResponseEntity<>(learnerService.getLearnerById(id), HttpStatus.OK);
    }

    // Mentor: get all learners assigned to a specific mentor
    @PreAuthorize("hasAnyRole('ADMIN', 'MENTOR')")
    @GetMapping("/mentor/{mentorId}")
    public ResponseEntity<List<LearnerDto>> getLearnersByMentor(@PathVariable Long mentorId) {
        return ResponseEntity.ok(learnerService.getLearnersByMentorId(mentorId));
    }

    // Admin: assign mentor + batch to a learner
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/assign")
    public ResponseEntity<LearnerDto> assignMentor(@PathVariable Long id, @RequestBody AssignMentorRequest request) {
        return new ResponseEntity<>(learnerService.assignMentor(id, request), HttpStatus.OK);
    }

    // Mentor: update scores for a learner
    @PreAuthorize("hasAnyRole('ADMIN', 'MENTOR')")
    @PutMapping("/{id}/scores")
    public ResponseEntity<LearnerDto> updateScores(@PathVariable Long id, @RequestBody ScoreUpdateRequest request) {
        return new ResponseEntity<>(learnerService.updateScores(id, request), HttpStatus.OK);
    }

    // Admin: general update (kept for backward compat)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<LearnerDto> updateLearner(@PathVariable Long id, @RequestBody LearnerDto learnerDto) {
        return new ResponseEntity<>(learnerService.updateLearner(id, learnerDto), HttpStatus.OK);
    }

    // Admin: delete learner
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLearner(@PathVariable Long id) {
        learnerService.deleteLearner(id);
        return new ResponseEntity<>("Learner deleted successfully", HttpStatus.OK);
    }
}
