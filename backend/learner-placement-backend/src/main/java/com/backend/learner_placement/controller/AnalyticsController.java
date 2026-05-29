package com.backend.learner_placement.controller;

import com.backend.learner_placement.services.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/analytics")
@PreAuthorize("hasAnyRole('ADMIN', 'MENTOR')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    // mentorId param: if provided, only return that mentor's learners' data
    // Admin passes no mentorId → sees all; Mentor passes their mentorId → sees only theirs
    @GetMapping("/top")
    public ResponseEntity<Object> getTopLearners(@RequestParam(required = false) Long mentorId) {
        return ResponseEntity.ok(analyticsService.getTopLearners(mentorId));
    }

    @GetMapping("/batch-performance")
    public ResponseEntity<Object> getBatchPerformance(@RequestParam(required = false) Long mentorId) {
        return ResponseEntity.ok(analyticsService.getBatchPerformance(mentorId));
    }

    @GetMapping("/weak")
    public ResponseEntity<Object> getWeakLearners(@RequestParam(required = false) Long mentorId) {
        return ResponseEntity.ok(analyticsService.getWeakLearners(mentorId));
    }
}