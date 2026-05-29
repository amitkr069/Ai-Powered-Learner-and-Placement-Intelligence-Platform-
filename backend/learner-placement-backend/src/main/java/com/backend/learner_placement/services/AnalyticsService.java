package com.backend.learner_placement.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AnalyticsService {

    private final RestTemplate restTemplate;
    private final String PYTHON_BASE_URL = "http://localhost:8000/analytics";

    public AnalyticsService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Object getTopLearners() {
        return restTemplate.getForObject(PYTHON_BASE_URL + "/top-learners", Object.class);
    }

    public Object getBatchPerformance() {
        return restTemplate.getForObject(PYTHON_BASE_URL + "/batch-performance", Object.class);
    }

    public Object getWeakLearners() {
        return restTemplate.getForObject(PYTHON_BASE_URL + "/weak-learners", Object.class);
    }
}