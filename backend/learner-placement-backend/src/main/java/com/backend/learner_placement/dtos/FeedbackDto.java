package com.backend.learner_placement.dtos;

public class FeedbackDto {
	
    private Long feedbackId;
    private Long mentorId;
    private Long learnerId;
    private String comments;
    
	public FeedbackDto() {}

	public FeedbackDto(Long feedbackId, Long mentorId, Long learnerId, String comments) {
		this.feedbackId = feedbackId;
		this.mentorId = mentorId;
		this.learnerId = learnerId;
		this.comments = comments;
	}

	public Long getFeedbackId() {
		return feedbackId;
	}

	public void setFeedbackId(Long feedbackId) {
		this.feedbackId = feedbackId;
	}

	public Long getMentorId() {
		return mentorId;
	}

	public void setMentorId(Long mentorId) {
		this.mentorId = mentorId;
	}

	public Long getLearnerId() {
		return learnerId;
	}

	public void setLearnerId(Long learnerId) {
		this.learnerId = learnerId;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}
	
}
