package com.conectafamilia.backend.controller;

import com.conectafamilia.backend.model.dto.UserSummaryDTO;
import com.conectafamilia.backend.model.entity.User;
import com.conectafamilia.backend.model.enums.Role;
import com.conectafamilia.backend.repository.jpa.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        if (user.getRole() == Role.ESPECIALISTA) {
            return ResponseEntity.ok(UserSummaryDTO.from(user));
        }
        if (user.getRole() != Role.USUARIO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Solo se pueden promover usuarios familiares");
        }
        user.setRole(Role.ESPECIALISTA);
        userRepository.save(user);
        return ResponseEntity.ok(UserSummaryDTO.from(user));
    }
}
