package com.backend.learner_placement.services;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationService {

    private final RestTemplate restTemplate;
    private final String NOTIFICATION_SERVER_URL = "http://localhost:3001/api/notify";

    public NotificationService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void sendNotification(String role, Long id, String title, String description, String badge, String status) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> payload = new HashMap<>();
            payload.put("role", role);
            if (id != null) {
                payload.put("id", id);
            }
            payload.put("title", title);
            payload.put("description", description);
            payload.put("badge", badge);
            payload.put("status", status);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            restTemplate.postForEntity(NOTIFICATION_SERVER_URL, request, String.class);
        } catch (Exception e) {
            System.err.println("Failed to send notification: " + e.getMessage());
        }
    }
}
