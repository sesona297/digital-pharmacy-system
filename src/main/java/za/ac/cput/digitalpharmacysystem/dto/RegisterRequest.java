package za.ac.cput.digitalpharmacysystem.dto;

import za.ac.cput.digitalpharmacysystem.domain.User;

public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phone;
    private User.UserRole role;

    private String medicalAidProvider;
    private String medicalAidMemberId;

    public RegisterRequest() {}

    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getFullName() { return firstName + " " + lastName; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getPhone() { return phone; }
    public User.UserRole getRole() { return role; }
    public String getMedicalAidProvider() { return medicalAidProvider; }
    public String getMedicalAidMemberId() { return medicalAidMemberId; }
}