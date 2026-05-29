package com.backend.learner_placement.dtos;

// Used by mentor to update learner scores
public class ScoreUpdateRequest {

    private Integer attendance;
    private Integer codingScore;
    private Integer aptitudeScore;
    private Integer communicationScore;

    public ScoreUpdateRequest() {}

    public Integer getAttendance() { return attendance; }
    public void setAttendance(Integer attendance) { this.attendance = attendance; }

    public Integer getCodingScore() { return codingScore; }
    public void setCodingScore(Integer codingScore) { this.codingScore = codingScore; }

    public Integer getAptitudeScore() { return aptitudeScore; }
    public void setAptitudeScore(Integer aptitudeScore) { this.aptitudeScore = aptitudeScore; }

    public Integer getCommunicationScore() { return communicationScore; }
    public void setCommunicationScore(Integer communicationScore) { this.communicationScore = communicationScore; }
}
