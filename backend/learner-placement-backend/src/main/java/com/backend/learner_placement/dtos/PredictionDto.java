package com.backend.learner_placement.dtos;

public class PredictionDto {
	
    private Long predictionId;
    private Long learnerId;
    private Integer readinessScore;
    private String recommendation;
    
    public PredictionDto() {}

	public PredictionDto(Long predictionId, Long learnerId, Integer readinessScore, String recommendation) {
		this.predictionId = predictionId;
		this.learnerId = learnerId;
		this.readinessScore = readinessScore;
		this.recommendation = recommendation;
	}

	public Long getPredictionId() {
		return predictionId;
	}

	public void setPredictionId(Long predictionId) {
		this.predictionId = predictionId;
	}

	public Long getLearnerId() {
		return learnerId;
	}

	public void setLearnerId(Long learnerId) {
		this.learnerId = learnerId;
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