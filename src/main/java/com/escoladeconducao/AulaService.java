package com.escoladeconducao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class AulaService {
    @Inject
    private AulaRepository aulaRepository;
    @Inject
    private AlunoRepository alunoRepository;
    @Inject
    private InstrutorRepository instrutorRepository;
    @Inject
    private VeiculoRepository veiculoRepository;

    public List<Aula> getAll() {
        return aulaRepository.getAll();
    }

    public Aula getById(int id) {
        return aulaRepository.getById(id);
    }

    @Transactional
    public Aula create(int alunoId, int instrutorId, Integer veiculoId, Aula.Tipo tipo,
                        LocalDateTime dataHoraInicio, LocalDateTime dataHoraFim) {
        Aluno aluno = alunoRepository.getById(alunoId);
        Instrutor instrutor = instrutorRepository.getById(instrutorId);
        Veiculo veiculo = (tipo == Aula.Tipo.PRATICA && veiculoId != null)
                ? veiculoRepository.getById(veiculoId)
                : null;

        if (aulaRepository.existeConflitoInstrutor(instrutor, dataHoraInicio, dataHoraFim)) {
            throw new ConflitoAgendamentoException("O instrutor já tem uma aula marcada nesse horário.");
        }
        if (veiculo != null && aulaRepository.existeConflitoVeiculo(veiculo, dataHoraInicio, dataHoraFim)) {
            throw new ConflitoAgendamentoException("O veículo já está reservado nesse horário.");
        }

        Aula aula = new Aula(aluno, instrutor, veiculo, tipo, dataHoraInicio, dataHoraFim);
        aulaRepository.create(aula);
        return aula;
    }

    @Transactional
    public Aula updateEstado(int id, Aula.Estado estado) {
        Aula aula = aulaRepository.getById(id);
        if (aula == null) {
            return null;
        }
        aula.setEstado(estado);
        return aula;
    }
    
    @Transactional
    public boolean delete(int id) {
    if (aulaRepository.getById(id) == null) {
        return false;
    }
    aulaRepository.delete(id);
    return true;
    }   
}