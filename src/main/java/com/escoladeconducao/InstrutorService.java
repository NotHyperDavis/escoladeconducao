package com.escoladeconducao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class InstrutorService {
    @Inject
    private InstrutorRepository instrutorRepository;

    public List<Instrutor> getAll() {
        return instrutorRepository.getAll();
    }

    @Transactional
    public Instrutor create(String nome, String categoriasHabilitado) {
        Instrutor instrutor = new Instrutor(nome, categoriasHabilitado);
        instrutorRepository.create(instrutor);
        return instrutor;
    }
}