package za.ac.cput.digitalpharmacysystem.dto;

public record CreateStaffRequest(
        String fullName,
        String email,
        String phone,
        String password,
        String role
) {
    public CreateStaffRequest {
        if (email == null || !email.matches("(?i)^[A-Za-z0-9._%+-]+@pharmaflow\\.com$")) {
            throw new IllegalArgumentException(
                    "Staff accounts must use an @pharmaflow.com email address."
            );
        }
    }
}
