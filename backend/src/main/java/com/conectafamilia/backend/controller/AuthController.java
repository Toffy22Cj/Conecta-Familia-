package com.conectafamilia.backend.controller;

import com.conectafamilia.backend.model.dto.auth.JwtResponse;
import com.conectafamilia.backend.model.dto.auth.LoginRequest;
import com.conectafamilia.backend.model.dto.auth.PasswordChangeRequest;
import com.conectafamilia.backend.model.dto.auth.ProfileUpdateRequest;
import com.conectafamilia.backend.model.dto.auth.RegisterRequest;
import com.conectafamilia.backend.model.dto.UserSummaryDTO;
import com.conectafamilia.backend.model.entity.User;
import com.conectafamilia.backend.model.enums.ClientType;
import com.conectafamilia.backend.model.enums.Role;
import com.conectafamilia.backend.repository.jpa.UserRepository;
import com.conectafamilia.backend.security.jwt.JwtProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtProvider jwtProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtProvider.generateToken(authentication);
        
        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(new JwtResponse(
                jwt,
                user.getId(),
                user.getEmail(),
                user.getRole().name(),
                user.getFullName()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        String email = registerRequest.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error: Email is already in use!");
        }

        User user = User.builder()
                .fullName(registerRequest.getFullName().trim())
                .email(email)
                .password(encoder.encode(registerRequest.getPassword()))
                .role(Role.USUARIO)
                .clientType(registerRequest.getClientType() != null
                        ? registerRequest.getClientType()
                        : ClientType.INDIVIDUAL)
                .build();

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @GetMapping("/me")
    public ResponseEntity<UserSummaryDTO> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok(UserSummaryDTO.from(getAuthenticatedUser(authentication)));
    }

    @PatchMapping("/me")
    public ResponseEntity<UserSummaryDTO> updateProfile(
            @Valid @RequestBody ProfileUpdateRequest request,
            Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        user.setFullName(request.getFullName().trim());
        return ResponseEntity.ok(UserSummaryDTO.from(userRepository.save(user)));
    }

    @PatchMapping("/password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody PasswordChangeRequest request,
            Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (!encoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña actual no coincide");
        }
        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.noContent().build();
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            return user;
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado");
    }
}
