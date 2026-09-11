package com.escoladeconducao.service;

import com.escoladeconducao.Aluno;
import com.escoladeconducao.repository.AlunoRepository;
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

    @Transactional
    public Aluno create(String nome, String email, String telefone) {
        Aluno aluno = new Aluno(nome, email, telefone);
        alunoRepository.create(aluno);
        return aluno;
    }
}