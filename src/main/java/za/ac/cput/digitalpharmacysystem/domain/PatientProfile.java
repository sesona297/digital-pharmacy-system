package za.ac.cput.digitalpharmacysystem.domain;

import jakarta.persistence.*;
import java.time.LocalDate;

//Author: 221066748

@Entity
@Table(name = "patient_profiles")

public class PatientProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    @Column(name = "chronic_conditions", columnDefinition = "TEXT")
    private String chronicConditions;

    @Column(name = "emergency_contact_phone", length = 20)
    private String emergencyContactPhone;

    protected PatientProfile() {}

    private PatientProfile(Builder builder) {
        this.id = builder.id;
        this.user = builder.user;
        this.dateOfBirth = builder.dateOfBirth;
        this.allergies = builder.allergies;
        this.chronicConditions = builder.chronicConditions;
        this.emergencyContactPhone = builder.emergencyContactPhone;
    }
    public Long getId() { return id; }
    public User getUser() { return user; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public String getAllergies() { return allergies; }
    public String getChronicConditions() { return chronicConditions; }
    public String getEmergencyContactPhone() { return emergencyContactPhone; }

    @Override
    public String toString() {
        return "PatientProfile{" +
                "id=" + id +
                ", dateOfBirth=" + dateOfBirth +
                ", allergies='" + allergies + '\'' +
                ", chronicConditions='" + chronicConditions + '\'' +
                ", emergencyContactPhone='" + emergencyContactPhone + '\'' +
                '}';
    }
    public static class Builder {
        private Long id;
        private User user;
        private LocalDate dateOfBirth;
        private String allergies;
        private String chronicConditions;
        private String emergencyContactPhone;

        public Builder setId(Long id) {
            this.id = id;
            return this;
        }
        public Builder setUser(User user) {
            this.user = user;
            return this;
        }

        public Builder setDateOfBirth(LocalDate dateOfBirth) {
            this.dateOfBirth = dateOfBirth;
            return this;
        }

        public Builder setAllergies(String allergies) {
            this.allergies = allergies;
            return this;
        }
        public Builder setChronicConditions(String chronicConditions) {
            this.chronicConditions = chronicConditions;
            return this;
        }

        public Builder setEmergencyContactPhone(String emergencyContactPhone) {
            this.emergencyContactPhone = emergencyContactPhone;
            return this;
        }
        public Builder copy(PatientProfile profile) {
            this.id = profile.id;
            this.user = profile.user;
            this.dateOfBirth = profile.dateOfBirth;
            this.allergies = profile.allergies;
            this.chronicConditions = profile.chronicConditions;
            this.emergencyContactPhone = profile.emergencyContactPhone;
            return this;
        }

        public PatientProfile build() {
            return new PatientProfile(this);
        }
    }
}
