package za.ac.cput.digitalpharmacysystem.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

//Author: 221066748

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum UserRole {
        CUSTOMER, PHARMACIST, COURIER, ADMIN
    }
    protected User() {}

    private User(Builder builder) {
        this.id = builder.id;
        this.fullName = builder.fullName;
        this.email = builder.email;
        this.passwordHash = builder.passwordHash;
        this.phone = builder.phone;
        this.role = builder.role;
        this.createdAt = builder.createdAt != null ? builder.createdAt : LocalDateTime.now();
    }
    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public String getPhone() { return phone; }
    public UserRole getRole() { return role; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", role=" + role +
                ", createdAt=" + createdAt +
                '}';
    }
    public static class Builder {
        private Long id;
        private String fullName;
        private String email;
        private String passwordHash;
        private String phone;
        private UserRole role = UserRole.CUSTOMER;
        private LocalDateTime createdAt;

        public Builder setId(Long id) {
            this.id = id;
            return this;
        }

        public Builder setFullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public Builder setEmail(String email) {
            this.email = email;
            return this;
        }

        public Builder setPasswordHash(String passwordHash) {
            this.passwordHash = passwordHash;
            return this;
        }

        public Builder setPhone(String phone) {
            this.phone = phone;
            return this;
        }

        public Builder setRole(UserRole role) {
            this.role = role;
            return this;
        }

        public Builder setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }
        public Builder copy(User user) {
            this.id = user.id;
            this.fullName = user.fullName;
            this.email = user.email;
            this.passwordHash = user.passwordHash;
            this.phone = user.phone;
            this.role = user.role;
            this.createdAt = user.createdAt;
            return this;
        }

        public User build() {
            return new User(this);
        }
    }

}
