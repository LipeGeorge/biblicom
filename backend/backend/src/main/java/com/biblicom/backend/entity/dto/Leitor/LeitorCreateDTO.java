package com.biblicom.backend.entity.dto.Leitor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record LeitorCreateDTO(
    @NotBlank
    @Size(max = 255)
    String nome,

    @NotBlank
    @Email
    @Size(max = 254)
    String email,

    @NotBlank
    @Pattern(regexp = "(\\d{11}|\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2})")
    String cpf
) {
    
}
