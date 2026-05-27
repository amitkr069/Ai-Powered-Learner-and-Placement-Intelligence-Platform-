package com.backend.learner_placement.controller;

import java.util.List;

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

import com.backend.learner_placement.dtos.LearnerDto;
import com.backend.learner_placement.services.LearnerService;

@RestController
@RequestMapping("/api/learners")
public class LearnerController {

	private LearnerService learnerService;
	
	public LearnerController(LearnerService learnerService) {
		this.learnerService= learnerService;
	}
	
	@PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/upload")
    public ResponseEntity<String> uploadLearnersCsv(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED).body(learnerService.saveLearnersFromCsv(file));
    }
	
	//Creating learner
	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping
	public ResponseEntity<LearnerDto> addLearner(@RequestBody LearnerDto learnerDto){
		return ResponseEntity.status(HttpStatus.CREATED).body(learnerService.createLearner(learnerDto));
	}
	
	// Get All Learners
    @GetMapping
    public ResponseEntity<List<LearnerDto>> getAllLearners() {
        return new ResponseEntity<>(learnerService.getAllLearners(), HttpStatus.OK);
    }

    // Get Learner by ID
    @GetMapping("/{id}")
    public ResponseEntity<LearnerDto> getLearnerById(@PathVariable Long id) {
        return new ResponseEntity<>(learnerService.getLearnerById(id), HttpStatus.OK);
    }

    // Update Learner
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<LearnerDto> updateLearner(@PathVariable Long id, @RequestBody LearnerDto learnerDto) {
        return new ResponseEntity<>(learnerService.updateLearner(id, learnerDto), HttpStatus.OK);
    }

    // Delete Learner
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLearner(@PathVariable Long id) {
        learnerService.deleteLearner(id);
        return new ResponseEntity<>("Learner deleted successfully", HttpStatus.OK);
    } 
}
