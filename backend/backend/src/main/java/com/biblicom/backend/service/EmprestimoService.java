package com.biblicom.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.biblicom.backend.entity.Emprestimo;
import com.biblicom.backend.entity.EmprestimoSituacao;
import com.biblicom.backend.entity.Exemplar;
import com.biblicom.backend.entity.ExemplarStatus;
import com.biblicom.backend.entity.Leitor;
import com.biblicom.backend.entity.dto.Emprestimo.EmprestimoCreateDTO;
import com.biblicom.backend.entity.dto.Emprestimo.EmprestimoRelatorioDTO;
import com.biblicom.backend.entity.dto.Emprestimo.EmprestimoResponseDTO;
import com.biblicom.backend.repository.EmprestimoRepository;
import com.biblicom.backend.repository.ExemplarRepository;
import com.biblicom.backend.repository.LeitorRepository;

@Service
public class EmprestimoService {

    private final EmprestimoRepository emprestimoRepository;
    private final ExemplarRepository exemplarRepository;
    private final LeitorRepository leitorRepository;

    public EmprestimoService(
        EmprestimoRepository emprestimoRepository,
        ExemplarRepository exemplarRepository,
        LeitorRepository leitorRepository
    ) {
        this.emprestimoRepository = emprestimoRepository;
        this.exemplarRepository = exemplarRepository;
        this.leitorRepository = leitorRepository;
    }

    @Transactional
    public EmprestimoResponseDTO criar(EmprestimoCreateDTO request) {
        LocalDate hoje = LocalDate.now();
        if (request.dataPrevistaDevolucao().isBefore(hoje)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "A data prevista para devolução não pode estar no passado");
        }

        Leitor leitor = leitorRepository.findById(request.leitorId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Leitor não encontrado"));
        Exemplar exemplar = exemplarRepository.findByIdForUpdate(request.exemplarId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Exemplar não encontrado"));

        if (exemplar.getStatus() != ExemplarStatus.DISPONIVEL) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Exemplar não está disponível para empréstimo");
        }

        exemplar.emprestar();
        exemplarRepository.save(exemplar);

        Emprestimo emprestimo = new Emprestimo(
            leitor,
            exemplar,
            hoje,
            request.dataPrevistaDevolucao());
        return toResponseDTO(emprestimoRepository.save(emprestimo), hoje);
    }

    @Transactional(readOnly = true)
    public List<EmprestimoResponseDTO> listar() {
        LocalDate hoje = LocalDate.now();
        return emprestimoRepository.findAllByOrderByDataEmprestimoDesc().stream()
            .map(emprestimo -> toResponseDTO(emprestimo, hoje))
            .toList();
    }

    @Transactional(readOnly = true)
    public List<EmprestimoResponseDTO> listarPorLeitor(Long leitorId) {
        if (!leitorRepository.existsById(leitorId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Leitor não encontrado");
        }
        LocalDate hoje = LocalDate.now();
        return emprestimoRepository.findByLeitor_IdOrderByDataEmprestimoDesc(leitorId).stream()
            .map(emprestimo -> toResponseDTO(emprestimo, hoje))
            .toList();
    }

    @Transactional(readOnly = true)
    public EmprestimoResponseDTO buscarPorId(Long id) {
        Emprestimo emprestimo = emprestimoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Empréstimo não encontrado"));
        return toResponseDTO(emprestimo, LocalDate.now());
    }

    @Transactional
    public EmprestimoResponseDTO registrarDevolucao(Long id) {
        Emprestimo emprestimo = emprestimoRepository.findByIdForUpdate(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Empréstimo não encontrado"));
        if (!emprestimo.estaAtivo()) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Este empréstimo já foi devolvido");
        }

        Exemplar exemplar = exemplarRepository.findByIdForUpdate(emprestimo.getExemplar().getId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Exemplar associado ao empréstimo não foi encontrado"));
        if (exemplar.getStatus() != ExemplarStatus.EMPRESTADO) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "O estado do exemplar não corresponde ao empréstimo");
        }

        LocalDate hoje = LocalDate.now();
        emprestimo.registrarDevolucao(hoje);
        exemplar.devolver();
        exemplarRepository.save(exemplar);
        return toResponseDTO(emprestimoRepository.save(emprestimo), hoje);
    }

    @Transactional(readOnly = true)
    public EmprestimoRelatorioDTO gerarRelatorio() {
        LocalDate hoje = LocalDate.now();
        return new EmprestimoRelatorioDTO(
            emprestimoRepository.countByDataDevolucaoIsNull(),
            emprestimoRepository.countByDataDevolucaoIsNullAndDataPrevistaDevolucaoBefore(hoje),
            emprestimoRepository.contarEmprestimosPorMes());
    }

    private EmprestimoResponseDTO toResponseDTO(Emprestimo emprestimo, LocalDate hoje) {
        EmprestimoSituacao situacao = emprestimo.estaAtrasado(hoje)
            ? EmprestimoSituacao.ATRASADO
            : emprestimo.estaAtivo()
                ? EmprestimoSituacao.ATIVO
                : EmprestimoSituacao.DEVOLVIDO;

        return new EmprestimoResponseDTO(
            emprestimo.getId(),
            emprestimo.getLeitor().getId(),
            emprestimo.getLeitor().getNome(),
            emprestimo.getExemplar().getId(),
            emprestimo.getExemplar().getLivro().getId(),
            emprestimo.getExemplar().getLivro().getTitulo(),
            emprestimo.getDataEmprestimo(),
            emprestimo.getDataPrevistaDevolucao(),
            emprestimo.getDataDevolucao(),
            situacao);
    }
}
