package com.backend.learner_placement.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.backend.learner_placement.dtos.AssessmentDto;
import com.backend.learner_placement.services.AssessmentService;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
public class AssessmentController {

   
    private AssessmentService assessmentService;
    
    public AssessmentController(AssessmentService assessmentService) {
    	this.assessmentService = assessmentService;
    }

    // Create Assessment
    @PreAuthorize("hasAnyRole('ADMIN', 'MENTOR')")
    @PostMapping
    public ResponseEntity<AssessmentDto> addAssessment(@RequestBody AssessmentDto assessmentDto) {
        return new ResponseEntity<>(assessmentService.createAssessment(assessmentDto), HttpStatus.CREATED);
    }

    // Get Assessments by Learner ID
    @GetMapping("/learner/{learnerId}")
    public ResponseEntity<List<AssessmentDto>> getAssessmentsByLearner(@PathVariable Long learnerId) {
        return new ResponseEntity<>(assessmentService.getAssessmentByLearnerId(learnerId), HttpStatus.OK);
    }

    // Update Assessment
    @PreAuthorize("hasAnyRole('ADMIN', 'MENTOR')")
    @PutMapping("/{id}")
    public ResponseEntity<AssessmentDto> updateAssessment(@PathVariable Long id, @RequestBody AssessmentDto assessmentDto) {
        return new ResponseEntity<>(assessmentService.updateAssessment(id, assessmentDto), HttpStatus.OK);
    }

    // Delete Assessment
    @PreAuthorize("hasAnyRole('ADMIN', 'MENTOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAssessment(@PathVariable Long id) {
        assessmentService.deleteAssessment(id);
        return new ResponseEntity<>("Assessment deleted successfully!", HttpStatus.OK);
    }
}