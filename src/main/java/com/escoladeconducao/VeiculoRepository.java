package com.escoladeconducao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;

@ApplicationScoped
public class VeiculoRepository {
    @PersistenceContext
    private EntityManager em;

    public List<Veiculo> getAll() {
        return em.createQuery("select v from Veiculo v", Veiculo.class).getResultList();
    }

    public Veiculo getById(Long id) {
        return em.find(Veiculo.class, id);
    }

    public void create(Veiculo veiculo) {
        em.persist(veiculo);
    }
}