package com.backend.learner_placement.services;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.backend.learner_placement.dtos.AssignMentorRequest;
import com.backend.learner_placement.dtos.LearnerDto;
import com.backend.learner_placement.dtos.RegisterRequest;
import com.backend.learner_placement.dtos.ScoreUpdateRequest;
import com.backend.learner_placement.models.Learner;
import com.backend.learner_placement.repository.LearnerRepository;

@Service
public class LearnerService {

    private final LearnerRepository learnerRepository;
    private final PasswordEncoder passwordEncoder;

    public LearnerService(LearnerRepository learnerRepository, PasswordEncoder passwordEncoder) {
        this.learnerRepository = learnerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Learner self-registration: only name, email, password
    public LearnerDto registerLearner(RegisterRequest request) {
        if (learnerRepository.findByEmail(request.getEmail()) != null) {
            throw new RuntimeException("Email already registered.");
        }
        Learner learner = new Learner();
        learner.setName(request.getName());
        learner.setEmail(request.getEmail());
        learner.setPassword(passwordEncoder.encode(request.getPassword()));
        // mentor_id, batch, scores all null at registration
        Learner saved = learnerRepository.save(learner);
        return toDto(saved);
    }

    // Admin assigns mentorId + batch to learner
    public LearnerDto assignMentor(Long learnerId, AssignMentorRequest request) {
        Learner learner = learnerRepository.findById(learnerId)
                .orElseThrow(() -> new RuntimeException("Learner not found with id: " + learnerId));
        learner.setMentorId(request.getMentorId());
        learner.setBatch(request.getBatch());
        Learner updated = learnerRepository.save(learner);
        return toDto(updated);
    }

    // Mentor updates scores for their learner
    public LearnerDto updateScores(Long learnerId, ScoreUpdateRequest request) {
        Learner learner = learnerRepository.findById(learnerId)
                .orElseThrow(() -> new RuntimeException("Learner not found with id: " + learnerId));
        if (request.getAttendance() != null) learner.setAttendance(request.getAttendance());
        if (request.getCodingScore() != null) learner.setCodingScore(request.getCodingScore());
        if (request.getAptitudeScore() != null) learner.setAptitudeScore(request.getAptitudeScore());
        if (request.getCommunicationScore() != null) learner.setCommunicationScore(request.getCommunicationScore());
        Learner updated = learnerRepository.save(learner);
        return toDto(updated);
    }

    // Get all learners for a specific mentor
    public List<LearnerDto> getLearnersByMentorId(Long mentorId) {
        return learnerRepository.findByMentorId(mentorId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Page<Learner> getAllLearnersPaginated(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return learnerRepository.findAll(pageable);
    }

    // Bulk CSV load (admin)
    public String saveLearnersFromCsv(MultipartFile file) {
        if (file.isEmpty()) throw new RuntimeException("Please upload a valid CSV file!");

        List<Learner> learners = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), "UTF-8"))) {
            String line;
            boolean isFirstLine = true;
            while ((line = br.readLine()) != null) {
                if (isFirstLine) { isFirstLine = false; continue; }
                String[] data = line.split(",");
                Learner learner = new Learner();
                learner.setBatch(data[0].trim());
                learner.setAttendance(Integer.parseInt(data[1].trim()));
                learner.setCodingScore(Integer.parseInt(data[2].trim()));
                learner.setAptitudeScore(Integer.parseInt(data[3].trim()));
                learner.setCommunicationScore(Integer.parseInt(data[4].trim()));
                learners.add(learner);
            }
            learnerRepository.saveAll(learners);
            return "Successfully uploaded " + learners.size() + " learners from CSV";
        } catch (Exception e) {
            throw new RuntimeException("Failed to process CSV file: " + e.getMessage());
        }
    }

    public List<LearnerDto> getAllLearners() {
        return learnerRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public LearnerDto getLearnerById(Long learnerId) {
        Learner learner = learnerRepository.findById(learnerId)
                .orElseThrow(() -> new RuntimeException(learnerId + " not found"));
        return toDto(learner);
    }

    public void deleteLearner(Long learnerId) {
        Learner learner = learnerRepository.findById(learnerId)
                .orElseThrow(() -> new RuntimeException(learnerId + " not found"));
        learnerRepository.delete(learner);
    }

    // General update (admin) — full record
    public LearnerDto updateLearner(Long id, LearnerDto learnerDto) {
        Learner existing = learnerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Learner not found with id: " + id));
        if (learnerDto.getBatch() != null) existing.setBatch(learnerDto.getBatch());
        if (learnerDto.getMentorId() != null) existing.setMentorId(learnerDto.getMentorId());
        if (learnerDto.getAttendance() != null) existing.setAttendance(learnerDto.getAttendance());
        if (learnerDto.getCodingScore() != null) existing.setCodingScore(learnerDto.getCodingScore());
        if (learnerDto.getAptitudeScore() != null) existing.setAptitudeScore(learnerDto.getAptitudeScore());
        if (learnerDto.getCommunicationScore() != null) existing.setCommunicationScore(learnerDto.getCommunicationScore());
        Learner updated = learnerRepository.save(existing);
        return toDto(updated);
    }

    private LearnerDto toDto(Learner learner) {
        LearnerDto dto = new LearnerDto();
        dto.setLearnerId(learner.getLearnerId());
        dto.setName(learner.getName());
        dto.setEmail(learner.getEmail());
        dto.setBatch(learner.getBatch());
        dto.setMentorId(learner.getMentorId());
        dto.setAttendance(learner.getAttendance());
        dto.setCodingScore(learner.getCodingScore());
        dto.setAptitudeScore(learner.getAptitudeScore());
        dto.setCommunicationScore(learner.getCommunicationScore());
        return dto;
    }
}