package com.backend.learner_placement.models;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "assessments")
public class Assessment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long assessmentId;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "learner_id",nullable = false)
	private Learner learner; 
	
	private Integer score;
	private String type;
	
	public Assessment(Long assessmentId, Learner learner, Integer score, String type) {
		this.assessmentId = assessmentId;
		this.learner = learner;
		this.score = score;
		this.type = type;
	}
	
	public Assessment() {}

	public Long getAssessmentId() {
		return assessmentId;
	}

	public void setAssessmentId(Long assessmentId) {
		this.assessmentId = assessmentId;
	}

	public Learner getLearner() {
		return learner;
	}

	public void setLearner(Learner learner) {
		this.learner = learner;
	}

	public Integer getScore() {
		return score;
	}

	public void setScore(Integer score) {
		this.score = score;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
}
