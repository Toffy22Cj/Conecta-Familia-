package com.conectafamilia.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.conectafamilia.backend.model.dto.UserSummaryDTO;
import com.conectafamilia.backend.model.entity.User;
import com.conectafamilia.backend.model.enums.Role;
import com.conectafamilia.backend.repository.jpa.UserRepository;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/especialistas")
public class SpecialistController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<UserSummaryDTO>> getSpecialists() {
        List<UserSummaryDTO> specialists = userRepository.findByRole(Role.ESPECIALISTA).stream()
                .map(UserSummaryDTO::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(specialists);
    }

    @GetMapping("/pacientes")
    @PreAuthorize("hasAnyRole('ADMIN', 'ESPECIALISTA')")
    public ResponseEntity<List<UserSummaryDTO>> getPacientes() {
        List<User> patients = userRepository.findByRole(Role.USUARIO);
        List<UserSummaryDTO> dtos = patients.stream()
                .map(UserSummaryDTO::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
