package za.ac.cput.digitalpharmacysystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.digitalpharmacysystem.domain.User;
import za.ac.cput.digitalpharmacysystem.dto.AuthResponse;
import za.ac.cput.digitalpharmacysystem.dto.LoginRequest;
import za.ac.cput.digitalpharmacysystem.dto.RegisterRequest;
import za.ac.cput.digitalpharmacysystem.factory.UserFactory;
import za.ac.cput.digitalpharmacysystem.repository.UserRepository;
import za.ac.cput.digitalpharmacysystem.security.JwtUtils;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Autowired
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already registered");
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        User user = UserFactory.buildUser(
                request.getFullName(),
                request.getEmail(),
                hashedPassword,
                request.getPhone(),
                request.getRole()
        );

        User savedUser = userRepository.save(user);
        String token = jwtUtils.generateToken(savedUser.getEmail(), savedUser.getRole().name());

        return ResponseEntity.ok(new AuthResponse(token, savedUser.getEmail(), savedUser.getRole().name()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(new AuthResponse(token, user.getEmail(), user.getRole().name()));
    }
}
