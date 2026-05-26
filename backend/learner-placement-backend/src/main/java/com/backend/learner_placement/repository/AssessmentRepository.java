package com.backend.learner_placement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.learner_placement.models.Assessment;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
	
	List<Assessment> findByLearner_LearnerId(Long learnerId);

}
