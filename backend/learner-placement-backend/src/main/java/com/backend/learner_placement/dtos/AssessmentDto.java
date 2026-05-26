package com.backend.learner_placement.dtos;

public class AssessmentDto {

	private Long assessmentId;
	private Long learnerId; 
	private Integer score;
	private String type;
	
	public AssessmentDto() {}

	public AssessmentDto(Long assessmentId, Long learnerId, Integer score, String type) {
		this.assessmentId = assessmentId;
		this.learnerId = learnerId;
		this.score = score;
		this.type = type;
	}

	public Long getAssessmentId() {
		return assessmentId;
	}

	public void setAssessmentId(Long assessmentId) {
		this.assessmentId = assessmentId;
	}

	public Long getLearnerId() {
		return learnerId;
	}

	public void setLearnerId(Long learnerId) {
		this.learnerId = learnerId;
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
