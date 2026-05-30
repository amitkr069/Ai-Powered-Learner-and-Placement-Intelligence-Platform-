package com.backend.learner_placement.dtos;

// Used by admin to assign mentorId + batch to a learner
public class AssignMentorRequest {

    private Long mentorId;
    private String batch;

    public AssignMentorRequest() {}

    public AssignMentorRequest(Long mentorId, String batch) {
        this.mentorId = mentorId;
        this.batch = batch;
    }

    public Long getMentorId() { return mentorId; }
    public void setMentorId(Long mentorId) { this.mentorId = mentorId; }

    public String getBatch() { return batch; }
    public void setBatch(String batch) { this.batch = batch; }
}
