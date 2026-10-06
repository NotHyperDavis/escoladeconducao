package com.escoladeconducao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class AlunoService {
    @Inject
    private AlunoRepository alunoRepository;

    public List<Aluno> getAll() {
        return alunoRepository.getAll();
    }

    public Aluno getById(int id) {
        return alunoRepository.getById(id);
    }

    @Transactional
    public Aluno create(String nome, String email, String telefone) {
        Aluno aluno = new Aluno(nome, email, telefone);
        alunoRepository.create(aluno);
        return aluno;
    }

    @Transactional
    public Aluno update(int id, String nome, String email, String telefone) {
        Aluno aluno = alunoRepository.getById(id);
        if (aluno == null) {
            return null;
        }
        aluno.setNome(nome);
        aluno.setEmail(email);
        aluno.setTelefone(telefone);
        return aluno;
    }

    @Transactional
    public boolean delete(int id) {
        if (alunoRepository.getById(id) == null) {
            return false;
        }
        alunoRepository.delete(id);
        return true;
    }
}