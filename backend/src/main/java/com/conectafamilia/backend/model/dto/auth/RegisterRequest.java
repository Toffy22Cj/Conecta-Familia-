package com.conectafamilia.backend.model.dto.auth;

import com.conectafamilia.backend.model.enums.ClientType;
import com.conectafamilia.backend.model.enums.Role;
import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class RegisterRequest {
    @NotBlank
    private String fullName;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    @NotNull
    private Role role;

    @NotNull
    private ClientType clientType;
}
