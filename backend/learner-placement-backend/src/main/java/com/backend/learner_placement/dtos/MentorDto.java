package com.backend.learner_placement.dtos;

public class MentorDto {

    private Long mentorId;
    private String name;
    private String email;
    private String password;
    private String batch;

    public MentorDto() {}

    public MentorDto(Long mentorId, String name, String email, String password, String batch) {
        this.mentorId = mentorId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.batch = batch;
    }

    public Long getMentorId() { return mentorId; }
    public void setMentorId(Long mentorId) { this.mentorId = mentorId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getBatch() { return batch; }
    public void setBatch(String batch) { this.batch = batch; }
}
