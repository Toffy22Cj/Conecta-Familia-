package com.conectafamilia.backend.repository.jpa;

import com.conectafamilia.backend.model.entity.SimulatorLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SimulatorLogRepository extends JpaRepository<SimulatorLog, Long> {
    List<SimulatorLog> findByUserId(Long userId);
}
