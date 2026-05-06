package com.conectafamilia.backend.controller;

import com.conectafamilia.backend.model.entity.Scenario;
import com.conectafamilia.backend.model.entity.SimulatorLog;
import com.conectafamilia.backend.model.entity.User;
import com.conectafamilia.backend.service.SimulatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/simulator")
public class SimulatorController {

    @Autowired
    private SimulatorService simulatorService;

    @GetMapping("/scenarios")
    public ResponseEntity<List<Scenario>> getAllScenarios() {
        return ResponseEntity.ok(simulatorService.getAllScenarios());
    }

    @GetMapping("/scenarios/{id}")
    public ResponseEntity<Scenario> getScenario(@PathVariable String id) {
        return ResponseEntity.ok(simulatorService.getScenario(id));
    }

    @PostMapping("/submit")
    public ResponseEntity<SimulatorLog> submitSimulatorLog(
            @RequestBody SimulatorLog log,
            Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        log.setUserId(user.getId());
        return ResponseEntity.ok(simulatorService.saveLog(log));
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            return user;
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado");
    }
}
