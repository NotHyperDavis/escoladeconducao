package com.escoladeconducao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;

@ApplicationScoped
public class InstrutorRepository {
    @PersistenceContext
    private EntityManager em;

    public List<Instrutor> getAll() {
        return em.createQuery("select i from Instrutor i", Instrutor.class).getResultList();
    }

    public Instrutor getById(int id) {
        return em.find(Instrutor.class, id);
    }

    public void create(Instrutor instrutor) {
        em.persist(instrutor);
    }
}