package com.biblicom.backend.entity.dto.Emprestimo;

import java.util.List;

public record EmprestimoRelatorioDTO(
    Long emprestimosAtivos,
    Long emprestimosAtrasados,
    List<EmprestimosPorMesDTO> emprestimosPorMes
) {
}
