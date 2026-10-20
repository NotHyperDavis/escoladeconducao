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

    public Instrutor getById(int id) {
        return instrutorRepository.getById(id);
    }

    @Transactional
    public Instrutor create(String nome, String categoriasHabilitado) {
        Instrutor instrutor = new Instrutor(nome, categoriasHabilitado);
        instrutorRepository.create(instrutor);
        return instrutor;
    }

    @Transactional
    public Instrutor update(int id, String nome, String categoriasHabilitado) {
        Instrutor instrutor = instrutorRepository.getById(id);
        if (instrutor == null) {
            return null;
        }
        instrutor.setNome(nome);
        instrutor.setCategoriasHabilitado(categoriasHabilitado);
        return instrutor;
    }

    @Transactional
    public boolean delete(int id) {
        if (instrutorRepository.getById(id) == null) {
            return false;
        }
        instrutorRepository.delete(id);
        return true;
    }
}