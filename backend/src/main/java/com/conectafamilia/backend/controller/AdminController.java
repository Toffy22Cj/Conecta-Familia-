package com.conectafamilia.backend.controller;

import com.conectafamilia.backend.model.dto.UserSummaryDTO;
import com.conectafamilia.backend.model.entity.User;
import com.conectafamilia.backend.model.enums.Role;
import com.conectafamilia.backend.repository.jpa.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<List<UserSummaryDTO>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserSummaryDTO> dtos = users.stream()
                .map(UserSummaryDTO::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PatchMapping("/users/{id}/promote")
    public ResponseEntity<UserSummaryDTO> promoteUserToSpecialist(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (user.getRole() == Role.ESPECIALISTA) {
            return ResponseEntity.ok(UserSummaryDTO.from(user));
        }
        user.setRole(Role.ESPECIALISTA);
        userRepository.save(user);
        return ResponseEntity.ok(UserSummaryDTO.from(user));
    }
}
