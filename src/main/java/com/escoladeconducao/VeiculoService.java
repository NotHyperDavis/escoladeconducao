package com.escoladeconducao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class VeiculoService {
    @Inject
    private VeiculoRepository veiculoRepository;

    public List<Veiculo> getAll() {
        return veiculoRepository.getAll();
    }

    @Transactional
    public Veiculo create(String matricula, String categoria, String estado) {
        Veiculo veiculo = new Veiculo(matricula, categoria, estado);
        veiculoRepository.create(veiculo);
        return veiculo;
    }
}