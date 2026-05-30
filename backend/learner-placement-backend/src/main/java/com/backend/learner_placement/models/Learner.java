package com.backend.learner_placement.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "learners")
public class Learner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long learnerId;

    // Auth fields (set at registration)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    // Assigned by admin
    private Long mentorId;
    private String batch;

    // Updated by mentor
    private Integer attendance;
    private Integer codingScore;
    private Integer aptitudeScore;
    private Integer communicationScore;

    public Learner() {}

    public Learner(Long learnerId, String name, String email, String password, Long mentorId,
                   String batch, Integer attendance, Integer codingScore,
                   Integer aptitudeScore, Integer communicationScore) {
        this.learnerId = learnerId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.mentorId = mentorId;
        this.batch = batch;
        this.attendance = attendance;
        this.codingScore = codingScore;
        this.aptitudeScore = aptitudeScore;
        this.communicationScore = communicationScore;
    }

    // Getters and Setters
    public Long getLearnerId() { return learnerId; }
    public void setLearnerId(Long learnerId) { this.learnerId = learnerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Long getMentorId() { return mentorId; }
    public void setMentorId(Long mentorId) { this.mentorId = mentorId; }

    public String getBatch() { return batch; }
    public void setBatch(String batch) { this.batch = batch; }

    public Integer getAttendance() { return attendance; }
    public void setAttendance(Integer attendance) { this.attendance = attendance; }

    public Integer getCodingScore() { return codingScore; }
    public void setCodingScore(Integer codingScore) { this.codingScore = codingScore; }

    public Integer getAptitudeScore() { return aptitudeScore; }
    public void setAptitudeScore(Integer aptitudeScore) { this.aptitudeScore = aptitudeScore; }

    public Integer getCommunicationScore() { return communicationScore; }
    public void setCommunicationScore(Integer communicationScore) { this.communicationScore = communicationScore; }
}
