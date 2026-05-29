package com.backend.learner_placement.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "mentors")
public class Mentor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mentorId;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private String batch;

    public Mentor() {}

    public Mentor(Long mentorId, String name, String email, String password, String batch) {
        this.mentorId = mentorId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.batch = batch;
    }

    // Getters and Setters
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
