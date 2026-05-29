package com.backend.learner_placement.services;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.backend.learner_placement.models.Learner;
import com.backend.learner_placement.repository.LearnerRepository;

@Service
public class AnalyticsService {

    private final LearnerRepository learnerRepository;

    public AnalyticsService(LearnerRepository learnerRepository) {
        this.learnerRepository = learnerRepository;
    }

    // Get top 5 learners by average score, optionally filtered by mentorId
    public Object getTopLearners(Long mentorId) {
        List<Learner> source = (mentorId != null)
                ? learnerRepository.findByMentorId(mentorId)
                : learnerRepository.findAll();

        List<Map<String, Object>> top = source.stream()
                .filter(l -> l.getCodingScore() != null && l.getAptitudeScore() != null && l.getCommunicationScore() != null)
                .sorted((a, b) -> {
                    int avgA = (a.getCodingScore() + a.getAptitudeScore() + a.getCommunicationScore()) / 3;
                    int avgB = (b.getCodingScore() + b.getAptitudeScore() + b.getCommunicationScore()) / 3;
                    return Integer.compare(avgB, avgA);
                })
                .limit(5)
                .map(l -> Map.<String, Object>of(
                        "learnerId", l.getLearnerId(),
                        "name", l.getName() != null ? l.getName() : "N/A",
                        "batch", l.getBatch() != null ? l.getBatch() : "UNASSIGNED",
                        "attendance", l.getAttendance() != null ? l.getAttendance() : 0,
                        "codingScore", l.getCodingScore() != null ? l.getCodingScore() : 0,
                        "aptitudeScore", l.getAptitudeScore() != null ? l.getAptitudeScore() : 0,
                        "communicationScore", l.getCommunicationScore() != null ? l.getCommunicationScore() : 0
                ))
                .collect(Collectors.toList());

        return Map.of("data", top);
    }

    // Get average scores per batch, optionally filtered by mentorId
    public Object getBatchPerformance(Long mentorId) {
        List<Learner> source = (mentorId != null)
                ? learnerRepository.findByMentorId(mentorId)
                : learnerRepository.findAll();

        Map<String, Double> batchAvgMap = source.stream()
                .filter(l -> l.getBatch() != null && l.getCodingScore() != null)
                .collect(Collectors.groupingBy(
                        l -> l.getBatch(),
                        Collectors.averagingInt(Learner::getCodingScore)
                ));

        return Map.of("data", batchAvgMap);
    }

    // Get weak learners (coding score < 50), optionally filtered by mentorId
    public Object getWeakLearners(Long mentorId) {
        List<Learner> source = (mentorId != null)
                ? learnerRepository.findByMentorId(mentorId)
                : learnerRepository.findAll();

        List<Map<String, Object>> weak = source.stream()
                .filter(l -> l.getCodingScore() != null && l.getCodingScore() < 50)
                .sorted((a, b) -> Integer.compare(a.getCodingScore(), b.getCodingScore()))
                .limit(10)
                .map(l -> Map.<String, Object>of(
                        "learnerId", l.getLearnerId(),
                        "name", l.getName() != null ? l.getName() : "N/A",
                        "batch", l.getBatch() != null ? l.getBatch() : "UNASSIGNED",
                        "codingScore", l.getCodingScore()
                ))
                .collect(Collectors.toList());

        return Map.of("data", weak);
    }
}