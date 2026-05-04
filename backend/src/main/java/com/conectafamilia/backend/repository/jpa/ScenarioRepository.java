package com.conectafamilia.backend.repository.jpa;

import com.conectafamilia.backend.model.entity.Scenario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScenarioRepository extends JpaRepository<Scenario, String> {
}
