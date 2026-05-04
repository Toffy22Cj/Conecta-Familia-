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
@RequestMapping("/api/especialistas")
public class SpecialistController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<User>> getSpecialists() {
        List<User> specialists = userRepository.findByRole(Role.ESPECIALISTA);
        return ResponseEntity.ok(specialists);
    }

    @GetMapping("/pacientes")
    public ResponseEntity<List<UserSummaryDTO>> getPacientes() {
        List<User> patients = userRepository.findByRole(Role.USUARIO);
        List<UserSummaryDTO> dtos = patients.stream()
                .map(UserSummaryDTO::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
