package com.backend.learner_placement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.learner_placement.models.Mentor;

@Repository
public interface MentorRepository extends JpaRepository<Mentor, Long> {
    Mentor findByEmail(String email);
}
