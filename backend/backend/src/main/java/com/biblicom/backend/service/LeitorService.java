package com.biblicom.backend.service;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.biblicom.backend.entity.Leitor;
import com.biblicom.backend.entity.dto.Leitor.LeitorCreateDTO;
import com.biblicom.backend.entity.dto.Leitor.LeitorResponseDTO;
import com.biblicom.backend.entity.dto.Leitor.LeitorUpdateDTO;
import com.biblicom.backend.repository.LeitorRepository;

@Service 
public class LeitorService {
    
    private final LeitorRepository leitorRepository;

    public LeitorService(LeitorRepository leitorRepository){
        this.leitorRepository = leitorRepository;
    }

    // Listar leitores
    @Transactional(readOnly = true)
    public List<LeitorResponseDTO> getLeitores(){
        return leitorRepository.findAll().stream()
            .map(this::toResponseDTO)
            .toList();
    }

    // Listar leitor ID
    @Transactional(readOnly = true)
    public LeitorResponseDTO getLeitorById(Long id){
        Leitor leitor = findLeitor(id);
        return toResponseDTO(leitor);
    }

    // Cadastrar Leitor
    @Transactional
    public LeitorResponseDTO createLeitor(LeitorCreateDTO leitorCreateDTO){
        Leitor leitor = new Leitor();
        leitor.setNome(leitorCreateDTO.nome());
        leitor.setEmail(leitorCreateDTO.email());
        leitor.setCpf(leitorCreateDTO.cpf());
        return toResponseDTO(leitorRepository.save(leitor));
    }

    // Editar leitor
    @Transactional
    public LeitorResponseDTO updateLeitor(Long id, LeitorUpdateDTO leitorUpdateDTO){
        Leitor leitor = findLeitor(id);
        leitor.setNome(leitorUpdateDTO.nome());
        return toResponseDTO(leitorRepository.save(leitor));
    }


    // Apagar leitor
    public void deleteLeitor(Long id){
        try{
            leitorRepository.deleteById(id);
        } catch(DataIntegrityViolationException exception){
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Leitor com vínculos não pode ser apagado",
                exception);
        }
    }

    private Leitor findLeitor(Long id){
        return leitorRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Leitor não encontrado"));
    }

    private LeitorResponseDTO toResponseDTO(Leitor leitor){
        return new LeitorResponseDTO(
            leitor.getId(),
            leitor.getNome(),
            leitor.getEmail(),
            leitor.getCpf());
    }

}
