package com.backend.learner_placement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.learner_placement.models.Learner;

@Repository
public interface LearnerRepository extends JpaRepository<Learner, Long> {
    Learner findByEmail(String email);
    List<Learner> findByMentorId(Long mentorId);
}
