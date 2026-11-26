package com.biblicom.backend.entity.dto.Exemplar;

import com.biblicom.backend.entity.ExemplarStatus;

public record ExemplarResponseDTO(
    Long id,
    ExemplarStatus status
) {
}
