package com.escoladeconducao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;

@ApplicationScoped
public class AlunoRepository {
    @PersistenceContext
    private EntityManager em;

    public List<Aluno> getAll() {
        return em.createQuery("select a from Aluno a", Aluno.class).getResultList();
    }

    public Aluno getById(int id) {
        return em.find(Aluno.class, id);
    }

    public void create(Aluno aluno) {
        em.persist(aluno);
    }
}