package com.backend.learner_placement.dtos;


public class LearnerDto {

	private Long learnerId;
	private String batch;
	private Long mentorId;
	private Integer attendance;
	private Integer codingScore;
	private Integer aptitudeScore;
	private Integer communicationScore;

	public LearnerDto() {}

	public LearnerDto(Long learnerId, String batch, Long mentorId, Integer attendance, Integer codingScore,
			Integer aptitudeScore, Integer communicationScore) {
		this.learnerId = learnerId;
		this.batch = batch;
		this.mentorId = mentorId;
		this.attendance = attendance;
		this.codingScore = codingScore;
		this.aptitudeScore = aptitudeScore;
		this.communicationScore = communicationScore;
	}

	public Long getLearnerId() {
		return learnerId;
	}

	public void setLearnerId(Long learnerId) {
		this.learnerId = learnerId;
	}

	public String getBatch() {
		return batch;
	}

	public void setBatch(String batch) {
		this.batch = batch;
	}

	public Long getMentorId() {
		return mentorId;
	}

	public void setMentorId(Long mentorId) {
		this.mentorId = mentorId;
	}

	public Integer getAttendance() {
		return attendance;
	}

	public void setAttendance(Integer attendance) {
		this.attendance = attendance;
	}

	public Integer getCodingScore() {
		return codingScore;
	}

	public void setCodingScore(Integer codingScore) {
		this.codingScore = codingScore;
	}

	public Integer getAptitudeScore() {
		return aptitudeScore;
	}

	public void setAptitudeScore(Integer aptitudeScore) {
		this.aptitudeScore = aptitudeScore;
	}

	public Integer getCommunicationScore() {
		return communicationScore;
	}

	public void setCommunicationScore(Integer communicationScore) {
		this.communicationScore = communicationScore;
	}


}
