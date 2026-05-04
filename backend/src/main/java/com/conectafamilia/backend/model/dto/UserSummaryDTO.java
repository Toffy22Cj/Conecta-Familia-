package com.conectafamilia.backend.model.dto;

import com.conectafamilia.backend.model.entity.User;
import com.conectafamilia.backend.model.enums.Role;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDTO {

    private Long id;
    private String fullName;
    private String email;
    private Role role;

    public static UserSummaryDTO from(User user) {
        return UserSummaryDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
