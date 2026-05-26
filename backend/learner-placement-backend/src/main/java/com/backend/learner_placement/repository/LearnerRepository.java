package com.backend.learner_placement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.learner_placement.models.Learner;

@Repository
public interface LearnerRepository extends JpaRepository<Learner, Long> { 

}
