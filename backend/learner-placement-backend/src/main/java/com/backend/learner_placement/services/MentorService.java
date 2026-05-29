package com.backend.learner_placement.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.backend.learner_placement.dtos.MentorDto;
import com.backend.learner_placement.models.Mentor;
import com.backend.learner_placement.repository.MentorRepository;

@Service
public class MentorService {

    private final MentorRepository mentorRepository;
    private final PasswordEncoder passwordEncoder;

    public MentorService(MentorRepository mentorRepository, PasswordEncoder passwordEncoder) {
        this.mentorRepository = mentorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public MentorDto createMentor(MentorDto dto) {
        if (mentorRepository.findByEmail(dto.getEmail()) != null) {
            throw new RuntimeException("A mentor with this email already exists.");
        }
        Mentor mentor = new Mentor();
        mentor.setName(dto.getName());
        mentor.setEmail(dto.getEmail());
        mentor.setPassword(passwordEncoder.encode(dto.getPassword()));
        mentor.setBatch(dto.getBatch());
        Mentor saved = mentorRepository.save(mentor);
        return toDto(saved);
    }

    public List<MentorDto> getAllMentors() {
        return mentorRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public MentorDto getMentorById(Long id) {
        Mentor mentor = mentorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mentor not found with id: " + id));
        return toDto(mentor);
    }

    private MentorDto toDto(Mentor mentor) {
        MentorDto dto = new MentorDto();
        dto.setMentorId(mentor.getMentorId());
        dto.setName(mentor.getName());
        dto.setEmail(mentor.getEmail());
        // Never return password
        dto.setPassword(null);
        dto.setBatch(mentor.getBatch());
        return dto;
    }
}
