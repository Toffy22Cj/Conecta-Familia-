package com.conectafamilia.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.conectafamilia.backend.repository.jpa")
public class ConectaFamiliaBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(ConectaFamiliaBackendApplication.class, args);
	}

}
