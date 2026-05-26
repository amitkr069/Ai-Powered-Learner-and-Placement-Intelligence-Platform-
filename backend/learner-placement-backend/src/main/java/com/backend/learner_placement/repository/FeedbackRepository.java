package com.backend.learner_placement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.learner_placement.models.Feedback;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long>{
	
	List<Feedback> findByLearner_LearnerId(Long learnerId);

}
