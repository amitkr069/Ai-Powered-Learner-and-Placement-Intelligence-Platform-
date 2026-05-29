package com.backend.learner_placement.controller;

import com.backend.learner_placement.services.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/analytics")
@PreAuthorize("hasAnyRole('ADMIN', 'MENTOR')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/top")
    public ResponseEntity<Object> getTopLearners() {
        return ResponseEntity.ok(analyticsService.getTopLearners());
    }

    @GetMapping("/batch-performance")
    public ResponseEntity<Object> getBatchPerformance() {
        return ResponseEntity.ok(analyticsService.getBatchPerformance());
    }

    @GetMapping("/weak")
    public ResponseEntity<Object> getWeakLearners() {
        return ResponseEntity.ok(analyticsService.getWeakLearners());
    }
}