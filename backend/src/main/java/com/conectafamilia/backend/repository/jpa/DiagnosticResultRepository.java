package com.conectafamilia.backend.repository.jpa;

import com.conectafamilia.backend.model.entity.DiagnosticResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiagnosticResultRepository extends JpaRepository<DiagnosticResult, Long> {
    List<DiagnosticResult> findByUserId(Long userId);
}
