package com.backend.learner_placement.controller;

import com.backend.learner_placement.services.FeedbackService;

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
import org.springframework.web.bind.annotation.RestController;

import com.backend.learner_placement.dtos.FeedbackDto;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

	private final FeedbackService feedbackService;

	public FeedbackController(FeedbackService feedbackService) {
		this.feedbackService = feedbackService;
	}
	
	@PreAuthorize("hasAnyRole('ADMIN', 'MENTOR')")
	@PostMapping
	public ResponseEntity<FeedbackDto> addFeedback(@RequestBody FeedbackDto feedbackDto){
		return ResponseEntity.status(HttpStatus.CREATED).body(feedbackService.addFeedback(feedbackDto)); 
	}
	
	@GetMapping("/learner/{learnerId}")
    public ResponseEntity<List<FeedbackDto>> getLearnerFeedback(@PathVariable Long learnerId) {
        return new ResponseEntity<>(feedbackService.getFeedbackForLearner(learnerId), HttpStatus.OK);
    }
	
	@PreAuthorize("hasAnyRole('ADMIN', 'MENTOR')")
	@PutMapping("/{feedbackId}")
	public ResponseEntity<FeedbackDto> updateFeedback(@PathVariable Long feedbackId, @RequestBody FeedbackDto feedbackDto){
		return ResponseEntity.status(HttpStatus.OK).body(feedbackService.updateFeedback(feedbackId, feedbackDto));
	}
	
	@PreAuthorize("hasAnyRole('ADMIN', 'MENTOR')")
	@DeleteMapping("/{feedbackId}")
	public ResponseEntity<String> deleteFeedback(@PathVariable Long feedbackId){
		feedbackService.deleteFeedback(feedbackId);
		return ResponseEntity.ok("Successfully deleted feeback id : "+feedbackId); 
	}
}
