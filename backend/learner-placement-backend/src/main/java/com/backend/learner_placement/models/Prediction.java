package com.backend.learner_placement.models;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "prediction")
public class Prediction {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long predictionId;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "learner_id", nullable = false)
	private Learner learner;

	private Integer readinessScore; // e.g., 87
	private String recommendation; // e.g., "Placement Ready"
	
	public Prediction() {}

	public Prediction(Long predictionId, Learner learner, Integer readinessScore, String recommendation) {
		this.predictionId = predictionId;
		this.learner = learner;
		this.readinessScore = readinessScore;
		this.recommendation = recommendation;
	}

	public Long getPredictionId() {
		return predictionId;
	}

	public void setPredictionId(Long predictionId) {
		this.predictionId = predictionId;
	}

	public Learner getLearner() {
		return learner;
	}

	public void setLearner(Learner learner) {
		this.learner = learner;
	}

	public Integer getReadinessScore() {
		return readinessScore;
	}

	public void setReadinessScore(Integer readinessScore) {
		this.readinessScore = readinessScore;
	}

	public String getRecommendation() {
		return recommendation;
	}

	public void setRecommendation(String recommendation) {
		this.recommendation = recommendation;
	}
	
}