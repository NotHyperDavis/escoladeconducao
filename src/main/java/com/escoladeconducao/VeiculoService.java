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

    public Veiculo getById(int id) {
        return veiculoRepository.getById(id);
    }

    @Transactional
    public Veiculo create(String matricula, String categoria, String estado) {
        Veiculo veiculo = new Veiculo(matricula, categoria, estado);
        veiculoRepository.create(veiculo);
        return veiculo;
    }

    @Transactional
    public Veiculo update(int id, String matricula, String categoria, String estado) {
        Veiculo veiculo = veiculoRepository.getById(id);
        if (veiculo == null) {
            return null;
        }
        veiculo.setMatricula(matricula);
        veiculo.setCategoria(categoria);
        veiculo.setEstado(estado);
        return veiculo;
    }

    @Transactional
    public boolean delete(int id) {
        if (veiculoRepository.getById(id) == null) {
            return false;
        }
        veiculoRepository.delete(id);
        return true;
    }
}