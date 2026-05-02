package com.conectafamilia.backend.service;

import com.conectafamilia.backend.model.document.Scenario;
import com.conectafamilia.backend.model.document.SimulatorLog;
import com.conectafamilia.backend.repository.ScenarioRepository;
import com.conectafamilia.backend.repository.SimulatorLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SimulatorService {

    @Autowired
    private SimulatorLogRepository logRepository;

    @Autowired
    private ScenarioRepository scenarioRepository;

    public List<Scenario> getAllScenarios() {
        return scenarioRepository.findAll();
    }

    public Scenario getScenario(String id) {
        return scenarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Scenario not found"));
    }

    public SimulatorLog saveLog(SimulatorLog log) {
        return logRepository.save(log);
    }
}
